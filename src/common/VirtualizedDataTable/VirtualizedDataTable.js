
import { useState } from "react";

import { useDataTableWorker } from "./hooks/useDataTableWorker";
import { useDataTableFilters } from "./hooks/useDataTableFilters";
import { useVirtualization } from "./hooks/useVirtualization";

import DataTableHeader from "./components/DataTableHeader";
import VirtualizedTableBody from "./components/VirtualizedTableBody";
import DataTableFooter from "./components/DataTableFooter";

export default function VirtualizedDataTable({
  data,
  columns,
  height,
  width,
  rowHeight
}) {
  const headerHeight = 65;
  const footerHeight = 40;

  const bodyHeight = height - headerHeight - footerHeight;

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc"
  });

  // Filtering logic
  const {
    filterDraft,
    filters,
    handleFilter,
    handleClearFilter
  } = useDataTableFilters(900);

  // Web Worker communication
  const {
    resultIndices,
    workerError
  } = useDataTableWorker({
    data,
    columns,
    filters,
    sortConfig
  });

  // Virtualization logic
  const {
    containerRef,
    handleScroll,
    visibleList,
    topSpacerHeight,
    bottomSpacerHeight
  } = useVirtualization({
    data,
    resultIndices,
    height,
    rowHeight,
    headerHeight,
    overscan: 3
  });

  // Sorting handler
  const handleSort = (key) => {
    setSortConfig((prev) => {
      // Different column: start with ascending
      if (prev.key !== key) {
        return { key, direction: "asc" };
      }

      // Ascending -> Descending
      if (prev.direction === "asc") {
        return { key, direction: "desc" };
      }

      // Descending -> Unsorted
      return { key: null, direction: null };
    });
  };

  

  return (
    <div
      className="bg-white overflow-hidden flex flex-col"
      style={{ height, width }}
    >
      {workerError && (
        <div role="alert">
          Failed to process table data: {workerError}
        </div>
      )}

      <table
        aria-label="Users DataTable"
        aria-rowcount={resultIndices.length + 1}
        aria-colcount={columns.length}
        className="w-full table-fixed border-collapse"
      >
        {/* Column widths */}
        <colgroup className="hidden">
          {columns.map((column) => (
            <col
              key={column.key}
              style={{ width: column.width || "auto" }}
            />
          ))}
        </colgroup>

        <DataTableHeader
          columns={columns}
          headerHeight={headerHeight}
          sortConfig={sortConfig}
          filterDraft={filterDraft}
          onSort={handleSort}
          onFilter={handleFilter}
          onClearFilter={handleClearFilter}
        />

        <VirtualizedTableBody
          columns={columns}
          containerRef={containerRef}
          handleScroll={handleScroll}
          height={bodyHeight + headerHeight}
          headerHeight={headerHeight}
          rowHeight={rowHeight}
          visibleList={visibleList}
          topSpacerHeight={topSpacerHeight}
          bottomSpacerHeight={bottomSpacerHeight}
        />
      </table>
      <DataTableFooter
        filteredCount={resultIndices.length}
        totalCount={data.length}
      />
    </div>
  );
}
