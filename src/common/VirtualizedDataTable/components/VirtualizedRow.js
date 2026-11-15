
export default function VirtualizedRow({
    item,
    columns,
    virtualIndex,
    rowHeight
  }) {
    return (
      <tr
        key={item.id ?? virtualIndex}
        aria-rowindex={virtualIndex + 2}
        className={`table w-full table-fixed ${
          virtualIndex % 2 === 0 ? "bg-neutral-100" : "bg-white"
        }`}
        style={{ height: rowHeight }}
      >
        {columns.map((column) => (
          <td
            key={column.key}
            className="p-2 border-b border-[#ddd] overflow-hidden text-ellipsis whitespace-nowrap box-border"
            style={{ width: column.width || "auto" }}
          >
            {typeof column.renderCell === "function"
              ? column.renderCell({
                  value: item[column.key],
                  row: item,
                  column,
                  index: virtualIndex
                })
              : item[column.key]}
          </td>
        ))}
      </tr>
    );
  }
