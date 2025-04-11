import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Edit,
  Trash,
  Download,
  BarChart,
  AlertTriangle,
  Clock,
} from "lucide-react";
import Table from "../../components/ui/Table";
import { casesAPI } from "../../services/mockAPI";
import usePermission from "../../hooks/usePermission";

const CasesList = () => {
  const navigate = useNavigate();
  const { can } = usePermission();

  // State for data
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [caseTypes, setCaseTypes] = useState([]);

  // State for pagination, sorting, and filtering
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const [sortColumn, setSortColumn] = useState("reportedDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    priority: "",
  });

  // Fetch cases data
  const fetchCases = async () => {
    setLoading(true);
    try {
      const response = await casesAPI.getAll({
        page: pagination.currentPage,
        per_page: pagination.pageSize,
        search: searchTerm,
        sort_by: sortColumn,
        sort_direction: sortDirection,
        status: filters.status || null,
        type: filters.type || null,
        priority: filters.priority || null,
      });

      setCases(response.data.data);
      setPagination({
        currentPage: response.data.page,
        totalPages: response.data.total_pages,
        totalItems: response.data.total,
        pageSize: response.data.per_page,
      });
    } catch (error) {
      console.error("Error fetching cases:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch case types for filtering
  const fetchCaseTypes = async () => {
    try {
      const response = await casesAPI.getTypes();
      setCaseTypes(response.data);
    } catch (error) {
      console.error("Error fetching case types:", error);
    }
  };

  // Fetch data when component mounts or when dependencies change
  useEffect(() => {
    fetchCases();
  }, [
    pagination.currentPage,
    pagination.pageSize,
    sortColumn,
    sortDirection,
    searchTerm,
    filters,
  ]);

  // Fetch case types once when component mounts
  useEffect(() => {
    fetchCaseTypes();
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    setPagination({
      ...pagination,
      currentPage: page,
    });
  };

  // Handle page size change
  const handlePageSizeChange = (pageSize) => {
    setPagination({
      ...pagination,
      pageSize,
      currentPage: 1, // Reset to first page when changing page size
    });
  };

  // Handle sort change
  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  // Handle search change
  const handleSearch = (term) => {
    setSearchTerm(term);
    setPagination({
      ...pagination,
      currentPage: 1, // Reset to first page when searching
    });
  };

  // Handle filter change
  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPagination({
      ...pagination,
      currentPage: 1, // Reset to first page when filtering
    });
  };

  // Define table columns
  const columns = [
    {
      key: "caseNumber",
      label: "Case #",
      sortable: true,
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.title}</div>
          <div className="text-xs text-gray-500 truncate max-w-xs">
            {row.description}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {row.type}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.status === "Active"
              ? "bg-blue-100 text-blue-800"
              : row.status === "Closed"
              ? "bg-gray-100 text-gray-800"
              : "bg-purple-100 text-purple-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.priority === "High"
              ? "bg-red-100 text-red-800"
              : row.priority === "Medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {row.priority}
        </span>
      ),
    },
    {
      key: "reportedDate",
      label: "Reported",
      sortable: true,
      render: (row) => (
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          {new Date(row.reportedDate).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/cases/${row.id}`)}
            className="text-gray-500 hover:text-indigo-600"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {can("cases", "update") && (
            <button
              onClick={() => navigate(`/cases/${row.id}/edit`)}
              className="text-gray-500 hover:text-blue-600"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {can("cases", "delete") && (
            <button
              onClick={() => handleDeleteCase(row.id)}
              className="text-gray-500 hover:text-red-600"
              title="Delete"
            >
              <Trash className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  // Filter options
  const filterOptions = {
    type: caseTypes.map((type) => ({ value: type.name, label: type.name })),
    status: [
      { value: "Active", label: "Active" },
      { value: "Closed", label: "Closed" },
      { value: "Under Investigation", label: "Under Investigation" },
    ],
    priority: [
      { value: "High", label: "High" },
      { value: "Medium", label: "Medium" },
      { value: "Low", label: "Low" },
    ],
  };

  // Handle case deletion
  const handleDeleteCase = async (id) => {
    if (!window.confirm("Are you sure you want to delete this case?")) {
      return;
    }

    try {
      await casesAPI.delete(id);
      // Refresh the data
      fetchCases();
    } catch (error) {
      console.error("Error deleting case:", error);
      alert("Failed to delete case");
    }
  };

  // Handle export to CSV
  const handleExport = () => {
    // In a real app, this would call an API endpoint that returns a CSV file
    alert("CSV export functionality would be implemented here");
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Case Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track investigation cases
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Export
            </button>

            <Link
              to="/cases/analytics"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <BarChart className="h-4 w-4 mr-1.5" />
              Analytics
            </Link>

            {can("cases", "create") && (
              <Link
                to="/cases/new"
                className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                New Case
              </Link>
            )}
          </div>
        </div>

        <Table
          columns={columns}
          data={cases}
          isLoading={loading}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          currentPage={pagination.currentPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSort={handleSort}
          onSearch={handleSearch}
          onFilter={handleFilter}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          searchTerm={searchTerm}
          filters={filters}
          filterOptions={filterOptions}
          emptyMessage="No cases found"
        />
      </div>
    </div>
  );
};

export default CasesList;
