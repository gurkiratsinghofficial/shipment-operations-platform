
import VirtualizedRow from "./VirtualizedRow";

function SpacerRow({ height, columnCount }) {
  if (height <= 0) return null;

  return (
    <tr
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <td
        colSpan={columnCount}
        style={{
          height,
          padding: 0,
          border: 0,
          display: "block"
        }}
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
      style={{
        display: "block",
        height: height - headerHeight,
        overflowY: "auto"
      }}
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
