import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

export function DataTable({ 
  columns, 
  data, 
  searchPlaceholder = "Search...", 
  searchable = true,
  itemsPerPageOptions = [5, 10, 20, 50],
  defaultItemsPerPage = 10
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [searchQuery, setSearchQuery] = useState("");

  // Memoized filtering logic
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    
    const query = searchQuery.toLowerCase();
    return data.filter((row) => {
      // Check if any value in the row matches the query
      return Object.values(row).some(
        (val) => val && val.toString().toLowerCase().includes(query)
      );
    });
  }, [data, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  return (
    <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden">
      
      {/* Toolbar */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
        {searchable ? (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
        ) : <div />}
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className={`px-6 py-4 font-semibold ${col.headerClassName || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-muted/30 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={`px-6 py-4 ${col.cellClassName || ""}`}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center text-muted-foreground">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Show</span>
          <select 
            value={itemsPerPage} 
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="bg-background border border-border rounded-md px-2 py-1 outline-none focus:border-primary"
          >
            {itemsPerPageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <span>entries</span>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredData.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </p>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || filteredData.length === 0}
              className="p-1 rounded-md border border-border bg-background text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="px-3 py-1 text-sm font-medium text-foreground">
              {totalPages === 0 ? 0 : currentPage} / {totalPages}
            </div>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || filteredData.length === 0}
              className="p-1 rounded-md border border-border bg-background text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
