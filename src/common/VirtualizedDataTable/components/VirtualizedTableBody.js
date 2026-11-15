
import VirtualizedRow from "./VirtualizedRow";

function SpacerRow({ height, columnCount }) {
  if (height <= 0) return null;

  return (
    <tr
      aria-hidden="true"
      className="block"
    >
      <td
        colSpan={columnCount}
        className="p-0 border-0 block"
        style={{ height }}
      />
    </tr>
  );
}

export default function VirtualizedTableBody({
  columns,
  containerRef,
  handleScroll,
  height,
  headerHeight,
  rowHeight,
  visibleList,
  topSpacerHeight,
  bottomSpacerHeight
}) {
  return (
    <tbody
      ref={containerRef}
      onScroll={handleScroll}
      className="block overflow-y-auto"
      style={{ height: height - headerHeight }}
    >
      <SpacerRow
        height={topSpacerHeight}
        columnCount={columns.length}
      />

      {visibleList.map(({ item, virtualIndex }) => (
        <VirtualizedRow
          key={item.id ?? virtualIndex}
          item={item}
          columns={columns}
          virtualIndex={virtualIndex}
          rowHeight={rowHeight}
        />
      ))}

      <SpacerRow
        height={bottomSpacerHeight}
        columnCount={columns.length}
      />
    </tbody>
  );
}
