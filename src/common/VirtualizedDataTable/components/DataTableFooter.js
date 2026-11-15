
export default function DataTableFooter({
    filteredCount,
    totalCount
  }) {
    return (
      <div className="flex items-center justify-end py-0.5 px-3 border-t border-[#ddd] bg-[#f9f9f9] text-[#555]">
        <span>
          Displaying {filteredCount} of {totalCount} records
        </span>
  
       
      </div>
    );
  }
