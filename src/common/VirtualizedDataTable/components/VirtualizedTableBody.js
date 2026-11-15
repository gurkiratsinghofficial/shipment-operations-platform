
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
  bottomSpacerHeight,
  isLoading
}) {

  return (
    <tbody
      ref={containerRef}
      onScroll={handleScroll}
      className="block overflow-y-auto"
      style={{ height: height - headerHeight }}
    >
      {isLoading ? (
          <tr className="table w-full table-fixed">
            <td
              colSpan={columns.length}
              className="h-[150px] text-center align-middle"
            >
              <span
                role="status"
                className="text-sm text-slate-500"
              >
                Loading records...
              </span>
            </td>
          </tr>
      ) : visibleList.length === 0 ? (
        <tr className="table w-full table-fixed">
          <td
            colSpan={columns.length}
            className="h-[150px] text-center align-middle"
          >
            <div
              role="status"
              aria-live="polite"
              className="flex flex-col items-center justify-center gap-2"
            >
              <span className="text-sm font-medium text-slate-600">
                No matching records found
              </span>
            </div>
          </td>
        </tr>
      ) : (
        <>
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
        </>
      )}
    </tbody>
  );
  
}
