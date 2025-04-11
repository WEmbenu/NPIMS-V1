import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  X,
} from "lucide-react";

// Table component for displaying data with sorting, filtering, and pagination
const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  totalItems = 0,
  pageSize = 10,
  currentPage = 1,
  onPageChange = () => {},
  onPageSizeChange = () => {},
  onSort = () => {},
  onSearch = () => {},
  onFilter = () => {},
  sortColumn = null,
  sortDirection = null,
  searchTerm = "",
  filters = {},
  filterOptions = {},
  emptyMessage = "No data available",
  renderRow = null,
}) => {
  const [search, setSearch] = useState(searchTerm);
  const [localFilters, setLocalFilters] = useState(filters);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Handle search input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      onSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, onSearch]);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilter(newFilters);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setLocalFilters({});
    onSearch("");
    onFilter({});
  };

  // Check if any filters are active
  const hasActiveFilters =
    search ||
    Object.values(localFilters).some((val) => val !== null && val !== "");

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Table header with search and filters */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          {/* Search input */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="form-input pl-10 py-2 text-sm w-full"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => {
                  setSearch("");
                  onSearch("");
                }}
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Filter controls */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* Filter dropdown(s) */}
            {Object.keys(filterOptions).map((key) => (
              <div key={key} className="relative">
                <select
                  className="form-input py-2 text-sm pr-8 pl-3"
                  value={localFilters[key] || ""}
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                >
                  <option value="">All {key}</option>
                  {filterOptions[key].map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}

            {/* Reset filters button */}
            {hasActiveFilters && (
              <button
                className="text-xs text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded px-2 py-1 flex items-center"
                onClick={resetFilters}
              >
                <X className="h-3 w-3 mr-1" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table content */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable !== false
                      ? "cursor-pointer hover:text-gray-700"
                      : ""
                  } ${column.className || ""}`}
                  onClick={() => {
                    if (column.sortable !== false) {
                      let direction = "asc";
                      if (sortColumn === column.key) {
                        direction = sortDirection === "asc" ? "desc" : "asc";
                      }
                      onSort(column.key, direction);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <span>{column.label}</span>
                    {column.sortable !== false && (
                      <span className="ml-1">
                        {sortColumn === column.key ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        ) : (
                          <div className="text-gray-300 opacity-50">
                            <ArrowUp className="h-3 w-3" />
                          </div>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              // Loading state
              Array(pageSize)
                .fill(0)
                .map((_, index) => (
                  <tr key={`skeleton-${index}`}>
                    {columns.map((column) => (
                      <td
                        key={`skeleton-${index}-${column.key}`}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        <div className="animate-pulse h-4 bg-gray-200 rounded w-full"></div>
                      </td>
                    ))}
                  </tr>
                ))
            ) : data.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center">
                  <p className="text-gray-500">{emptyMessage}</p>
                  {hasActiveFilters && (
                    <button
                      className="mt-2 text-primary-600 hover:text-primary-800 text-sm"
                      onClick={resetFilters}
                    >
                      Clear filters and try again
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              // Data rows
              data.map((row, rowIndex) => {
                if (renderRow) {
                  return renderRow(row, rowIndex);
                }

                return (
                  <tr key={row.id || rowIndex}>
                    {columns.map((column) => (
                      <td
                        key={`${row.id || rowIndex}-${column.key}`}
                        className={`px-6 py-4 whitespace-nowrap ${
                          column.cellClassName || ""
                        }`}
                      >
                        {column.render ? column.render(row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center text-xs text-gray-700 mb-2 sm:mb-0">
          <span>Show</span>
          <select
            className="mx-2 form-select rounded border-gray-300 text-xs"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>

        <div className="flex justify-between w-full sm:w-auto">
          <div className="sm:hidden text-xs text-gray-700">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">First page</span>
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="hidden sm:block px-4 py-2 border-t border-b border-gray-300 bg-white text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next page</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Last page</span>
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
