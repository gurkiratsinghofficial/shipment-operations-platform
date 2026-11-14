
let data = [];

self.onmessage = (event) => {
  const { type, payload, requestId } = event.data;

  if (type === "INIT") {
    data = payload.data;

    self.postMessage({ type: "INIT_READY" });
    return;
  }

  if (type === "QUERY") {
    const { columns, filters, sortConfig } = payload;

    // Start with original row indices
    let indices = data.map((_, index) => index);

    // Filtering
    indices = indices.filter((index) => {
      const item = data[index];

      return columns.every((column) => {
        if (!column.filter || !filters[column.key]) {
          return true;
        }

        return String(item[column.key] ?? "")
          .toLowerCase()
          .includes(filters[column.key].toLowerCase());
      });
    });

    // Sorting
    if (sortConfig.key) {
      const { key, direction } = sortConfig;

      indices.sort((a, b) => {
        const valueA = data[a][key];
        const valueB = data[b][key];

        if (valueA === valueB) return 0;
        if (valueA == null) return 1;
        if (valueB == null) return -1;

        let result;

        if (
          typeof valueA === "number" &&
          typeof valueB === "number"
        ) {
          result = valueA - valueB;
        } else {
          result = String(valueA) < String(valueB) ? -1 : 1;
        }

        return direction === "asc" ? result : -result;
      });
    }

    // Return indices instead of complete objects
    self.postMessage({
      type: "QUERY_RESULT",
      requestId,
      indices,
    });
  }
};
