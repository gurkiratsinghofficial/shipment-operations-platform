
import { useEffect, useRef, useState } from "react";

export function useDataTableFilters(debounceDelay = 900) {
  const [filterDraft, setFilterDraft] = useState({});
  const [filters, setFilters] = useState({});

  const filterDraftRef = useRef({});
  const filterTimeoutRef = useRef(null);

  // Update draft filter state
  const applyFilters = (nextDraft) => {
    filterDraftRef.current = nextDraft;
    setFilterDraft(nextDraft);
  };

  // Handle filter input with debounce
  const handleFilter = (key, value) => {
    const nextDraft = {
      ...filterDraftRef.current,
      [key]: value
    };

    applyFilters(nextDraft);

    clearTimeout(filterTimeoutRef.current);

    filterTimeoutRef.current = setTimeout(() => {
      setFilters({ ...filterDraftRef.current });
    }, debounceDelay);
  };

  // Clear individual filter immediately
  const handleClearFilter = (key) => {
    clearTimeout(filterTimeoutRef.current);

    const nextDraft = {
      ...filterDraftRef.current,
      [key]: ""
    };

    applyFilters(nextDraft);
    setFilters({ ...nextDraft });
  };

  // Cleanup pending timeout on unmount
  useEffect(() => {
    return () => {
      clearTimeout(filterTimeoutRef.current);
    };
  }, []);

  return {
    filterDraft,
    filters,
    handleFilter,
    handleClearFilter
  };
}
