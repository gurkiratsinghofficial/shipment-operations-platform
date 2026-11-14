
export default function DataTableFooter({
    filteredCount,
    totalCount
  }) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "2px 12px",
          borderTop: "1px solid #ddd",
          background: "#f9f9f9",
          color: "#555"
        }}
      >
        <span>
          Displaying {filteredCount} of {totalCount} records
        </span>
  
       
      </div>
    );
  }
  