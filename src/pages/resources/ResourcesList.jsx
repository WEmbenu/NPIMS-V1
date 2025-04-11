import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Edit,
  Trash,
  Download,
  Upload,
  User,
  MapPin,
} from "lucide-react";
import Table from "../../components/ui/Table";
import { resourcesAPI } from "../../services/mockAPI";
import usePermission from "../../hooks/usePermission";

const ResourcesList = () => {
  const navigate = useNavigate();
  const { can } = usePermission();

  // State for data
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resourceTypes, setResourceTypes] = useState([]);

  // State for pagination, sorting, and filtering
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    location: "",
  });

  // Fetch resources data
  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await resourcesAPI.getAll({
        page: pagination.currentPage,
        per_page: pagination.pageSize,
        search: searchTerm,
        sort_by: sortColumn,
        sort_direction: sortDirection,
        type: filters.type || null,
        status: filters.status || null,
        location: filters.location || null,
      });

      setResources(response.data.data);
      setPagination({
        currentPage: response.data.page,
        totalPages: response.data.total_pages,
        totalItems: response.data.total,
        pageSize: response.data.per_page,
      });
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch resource types for filtering
  const fetchResourceTypes = async () => {
    try {
      const response = await resourcesAPI.getTypes();
      setResourceTypes(response.data);
    } catch (error) {
      console.error("Error fetching resource types:", error);
    }
  };

  // Fetch data when component mounts or when dependencies change
  useEffect(() => {
    fetchResources();
  }, [
    pagination.currentPage,
    pagination.pageSize,
    sortColumn,
    sortDirection,
    searchTerm,
    filters,
  ]);

  // Fetch resource types once when component mounts
  useEffect(() => {
    fetchResourceTypes();
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
      key: "identifier",
      label: "ID",
      sortable: true,
    },
    {
      key: "name",
      label: "Resource",
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.type}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.status === "Available"
              ? "bg-green-100 text-green-800"
              : row.status === "In Use"
              ? "bg-blue-100 text-blue-800"
              : row.status === "Maintenance"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
      render: (row) => (
        <div className="flex items-center">
          <MapPin className="h-3 w-3 mr-1 text-gray-400 flex-shrink-0" />
          <span className="text-sm">{row.location}</span>
        </div>
      ),
    },
    {
      key: "assignment",
      label: "Assignment",
      sortable: false,
      render: (row) =>
        row.assignedTo ? (
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1 text-gray-400 flex-shrink-0" />
            <span className="text-sm">Officer #{row.assignedTo}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-500">Unassigned</span>
        ),
    },
    {
      key: "condition",
      label: "Condition",
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.condition === "Excellent"
              ? "bg-green-100 text-green-800"
              : row.condition === "Good"
              ? "bg-blue-100 text-blue-800"
              : row.condition === "Fair"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.condition}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/resources/${row.id}`)}
            className="text-gray-500 hover:text-indigo-600"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {can("resources", "update") && (
            <button
              onClick={() => navigate(`/resources/${row.id}/edit`)}
              className="text-gray-500 hover:text-blue-600"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {can("resources", "delete") && (
            <button
              onClick={() => handleDeleteResource(row.id)}
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
    type: resourceTypes.map((type) => ({ value: type.name, label: type.name })),
    status: [
      { value: "Available", label: "Available" },
      { value: "In Use", label: "In Use" },
      { value: "Maintenance", label: "Maintenance" },
      { value: "Out of Service", label: "Out of Service" },
    ],
    // In a real app, this would be a dynamic list of stations/locations
    location: [
      { value: "Kinshasa Central Station", label: "Kinshasa Central" },
      { value: "Lubumbashi Main Station", label: "Lubumbashi Main" },
      { value: "Goma Central Station", label: "Goma Central" },
    ],
  };

  // Handle resource deletion
  const handleDeleteResource = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) {
      return;
    }

    try {
      await resourcesAPI.delete(id);
      // Refresh the data
      fetchResources();
    } catch (error) {
      console.error("Error deleting resource:", error);
      alert("Failed to delete resource");
    }
  };

  // Handle export to CSV
  const handleExport = () => {
    // In a real app, this would call an API endpoint that returns a CSV file
    alert("CSV export functionality would be implemented here");
  };

  // Handle import from CSV
  const handleImport = () => {
    // In a real app, this would open a file dialog and import resources
    alert("Import functionality would be implemented here");
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Resource Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage vehicles, equipment, and other resources
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

            {can("resources", "create") && (
              <button
                onClick={handleImport}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Upload className="h-4 w-4 mr-1.5" />
                Import
              </button>
            )}

            {can("resources", "create") && (
              <Link
                to="/resources/new"
                className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Resource
              </Link>
            )}
          </div>
        </div>

        <Table
          columns={columns}
          data={resources}
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
          emptyMessage="No resources found"
        />
      </div>
    </div>
  );
};

export default ResourcesList;
