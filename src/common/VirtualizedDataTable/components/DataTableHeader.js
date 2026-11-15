
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
      <thead className="table w-full table-fixed bg-[#333] text-white">
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
              className="p-2 text-left overflow-hidden align-top box-border"
              style={{ width: column.width || "auto" }}
            >
              <div className="flex flex-col justify-start gap-[5px]">
                {/* Column title and sorting */}
                <div className="flex items-center gap-[5px]">
                  <span>{column.header}</span>
  
                  {column.sortable && (
                    <button
                      type="button"
                      onClick={() => onSort(column.key)}
                      aria-label={`Sort by ${column.header}`}
                      className="cursor-pointer bg-transparent border-none text-white"
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
                  <div className="relative w-full min-w-0">
                    <input
                      type="text"
                      value={filterDraft[column.key] || ""}
                      aria-label={`Search by ${column.header}`}
                      placeholder={`Search ${column.header}`}
                      onChange={(event) =>
                        onFilter(column.key, event.target.value)
                      }
                      className="w-full min-w-0 box-border p-[3px] pr-[18px] text-[#111] bg-white"
                    />
  
                    {Boolean(filterDraft[column.key]) && (
                      <button
                        type="button"
                        onClick={() => onClearFilter(column.key)}
                        aria-label={`Clear ${column.header} filter`}
                        className="absolute right-1 top-1/2 -translate-y-1/2 z-[1] flex items-center justify-center size-3.5 p-0 border-none bg-transparent text-[#555] text-sm leading-none cursor-pointer"
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
