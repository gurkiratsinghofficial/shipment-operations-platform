
import { useEffect, useRef, useState } from "react";

export function useVirtualization({
  data,
  resultIndices,
  height,
  rowHeight,
  headerHeight = 65,
  overscan = 3
}) {
  const containerRef = useRef(null);

  const visibleCount = Math.ceil(
    (height - headerHeight) / rowHeight
  );

  const [indices, setIndices] = useState([
    0,
    visibleCount + overscan * 2
  ]);

  // Reset scroll position when query results change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }

    setIndices([
      0,
      visibleCount + overscan * 2
    ]);
  }, [resultIndices, visibleCount, overscan]);

  // Calculate visible range on scroll
  const handleScroll = (event) => {
    const scrollTop = event.target.scrollTop;

    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / rowHeight) - overscan
    );

    const endIndex =
      startIndex + visibleCount + overscan * 2;

    setIndices([startIndex, endIndex]);
  };

  const startIndex = indices[0];

  const endIndex = Math.min(
    indices[1],
    resultIndices.length
  );

  // Get only the rows required for rendering
  const visibleList = resultIndices
    .slice(startIndex, endIndex)
    .map((dataIndex, index) => ({
      item: data[dataIndex],
      virtualIndex: startIndex + index
    }));

  // Calculate spacer heights
  const topSpacerHeight = startIndex * rowHeight;

  const bottomSpacerHeight =
    (resultIndices.length - endIndex) * rowHeight;

  return {
    containerRef,
    handleScroll,
    visibleList,
    startIndex,
    endIndex,
    topSpacerHeight,
    bottomSpacerHeight
  };
}
