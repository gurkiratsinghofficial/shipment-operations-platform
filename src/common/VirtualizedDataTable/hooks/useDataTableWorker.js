
import { useEffect, useRef, useState } from "react";

export function useDataTableWorker({
  data,
  columns,
  filters,
  sortConfig
}) {
  const workerRef = useRef(null);
  const requestIdRef = useRef(0);

  const [workerReady, setWorkerReady] = useState(false);
  const [resultIndices, setResultIndices] = useState([]);
  const [workerError, setWorkerError] = useState(null);

  // Effect 1: Manage worker lifecycle
  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/virtualizedDataTable.worker.js", import.meta.url),
      { type: "module" }
    );

    workerRef.current = worker;
    requestIdRef.current = 0;

    setWorkerReady(false);
    setResultIndices([]);
    setWorkerError(null);

    worker.onmessage = (event) => {
      const { type, indices, requestId, error } = event.data;

      if (workerRef.current !== worker) return;

      if (type === "INIT_READY") {
        setWorkerReady(true);
      }

      if (
        type === "QUERY_RESULT" &&
        requestId === requestIdRef.current
      ) {
        setResultIndices(indices);
      }

      if (type === "ERROR") {
        setWorkerError(error);
      }
    };

    worker.onerror = (event) => {
      setWorkerError(event.message || "Worker failed");
    };

    worker.postMessage({
      type: "INIT",
      payload: { data }
    });

    return () => {
      worker.terminate();

      if (workerRef.current === worker) {
        workerRef.current = null;
      }
    };
  }, [data]);

  // Effect 2: Synchronize queries with worker
  useEffect(() => {
    const worker = workerRef.current;

    if (!workerReady || !worker) return;

    const requestId = ++requestIdRef.current;

    const workerColumns = columns.map(
      ({ key, filter, sortable }) => ({
        key,
        filter,
        sortable
      })
    );

    worker.postMessage({
      type: "QUERY",
      requestId,
      payload: {
        columns: workerColumns,
        filters,
        sortConfig
      }
    });
  }, [workerReady, columns, filters, sortConfig]);

  return {
    workerReady,
    resultIndices,
    workerError
  };
}
