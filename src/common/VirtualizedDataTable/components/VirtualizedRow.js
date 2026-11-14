
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
        style={{
          display: "table",
          width: "100%",
          tableLayout: "fixed",
          height: rowHeight,
          background:
            virtualIndex % 2 === 0 ? "#f5f5f5" : "white"
        }}
      >
        {columns.map((column) => (
          <td
            key={column.key}
            style={{
              width: column.width || "auto",
              padding: 8,
              borderBottom: "1px solid #ddd",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              boxSizing: "border-box"
            }}
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
  