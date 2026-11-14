
export default function DataTableHeader({
    columns,
    headerHeight,
    sortConfig,
    filterDraft,
    onSort,
    onFilter,
    onClearFilter
  }) {
    return (
      <thead
        style={{
          display: "table",
          width: "100%",
          tableLayout: "fixed",
          background: "#333",
          color: "white"
        }}
      >
        <tr style={{ height: headerHeight }}>
          {columns.map((column) => (
            <th
              key={column.key}
              scope="col"
              aria-sort={
                sortConfig.key === column.key
                  ? sortConfig.direction === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
              style={{
                width: column.width || "auto",
                padding: 8,
                textAlign: "left",
                overflow: "hidden",
                verticalAlign: "top",
                boxSizing: "border-box"
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  gap: 5
                }}
              >
                {/* Column title and sorting */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5
                  }}
                >
                  <span>{column.header}</span>
  
                  {column.sortable && (
                    <button
                      type="button"
                      onClick={() => onSort(column.key)}
                      aria-label={`Sort by ${column.header}`}
                      style={{
                        cursor: "pointer",
                        background: "transparent",
                        border: "none",
                        color: "white"
                      }}
                    >
                      <span aria-hidden="true">
                        {sortConfig.key !== column.key
                          ? "↕"
                          : sortConfig.direction === "asc"
                            ? "↑"
                            : "↓"}
                      </span>
                    </button>
                  )}
                </div>
  
                {/* Column filter */}
                {column.filter && (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      minWidth: 0
                    }}
                  >
                    <input
                      type="text"
                      value={filterDraft[column.key] || ""}
                      aria-label={`Search by ${column.header}`}
                      placeholder={`Search ${column.header}`}
                      onChange={(event) =>
                        onFilter(column.key, event.target.value)
                      }
                      style={{
                        width: "100%",
                        minWidth: 0,
                        boxSizing: "border-box",
                        padding: 3,
                        paddingRight: 18,
                        color: "#111",
                        background: "white"
                      }}
                    />
  
                    {Boolean(filterDraft[column.key]) && (
                      <button
                        type="button"
                        onClick={() => onClearFilter(column.key)}
                        aria-label={`Clear ${column.header} filter`}
                        style={{
                          position: "absolute",
                          right: 4,
                          top: "50%",
                          transform: "translateY(-50%)",
                          zIndex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 14,
                          height: 14,
                          padding: 0,
                          border: "none",
                          background: "transparent",
                          color: "#555",
                          fontSize: 14,
                          lineHeight: 1,
                          cursor: "pointer"
                        }}
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
    );
  }
  