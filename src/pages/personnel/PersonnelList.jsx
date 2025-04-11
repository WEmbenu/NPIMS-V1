import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Eye, Edit, Trash, Download, Mail, Phone } from "lucide-react";
import Table from "../../components/ui/Table";
import { personnelAPI } from "../../services/mockAPI";
import usePermission from "../../hooks/usePermission";

const PersonnelList = () => {
  const navigate = useNavigate();
  const { can } = usePermission();

  // State for data
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);

  // State for pagination, sorting, and filtering
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const [sortColumn, setSortColumn] = useState("lastName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    department: "",
    status: "",
  });

  // Fetch personnel data
  const fetchPersonnel = async () => {
    setLoading(true);
    try {
      const response = await personnelAPI.getAll({
        page: pagination.currentPage,
        per_page: pagination.pageSize,
        search: searchTerm,
        sort_by: sortColumn,
        sort_direction: sortDirection,
        department: filters.department || null,
        status: filters.status || null,
      });

      setPersonnel(response.data.data);
      setPagination({
        currentPage: response.data.page,
        totalPages: response.data.total_pages,
        totalItems: response.data.total,
        pageSize: response.data.per_page,
      });
    } catch (error) {
      console.error("Error fetching personnel:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments for filtering
  const fetchDepartments = async () => {
    try {
      const response = await personnelAPI.getDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Fetch data when component mounts or when dependencies change
  useEffect(() => {
    fetchPersonnel();
  }, [
    pagination.currentPage,
    pagination.pageSize,
    sortColumn,
    sortDirection,
    searchTerm,
    filters,
  ]);

  // Fetch departments once when component mounts
  useEffect(() => {
    fetchDepartments();
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
      key: "badgeNumber",
      label: "Badge No.",
      sortable: true,
    },
    {
      key: "fullName",
      label: "Name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center">
          {row.photo ? (
            <img
              src={row.photo}
              alt={`${row.firstName} ${row.lastName}`}
              className="h-8 w-8 rounded-full mr-2"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-2">
              {row.firstName.charAt(0)}
              {row.lastName.charAt(0)}
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">
              {row.rank} {row.firstName} {row.lastName}
            </div>
            <div className="text-gray-500 text-xs">{row.department}</div>
          </div>
        </div>
      ),
    },
    {
      key: "station",
      label: "Station",
      sortable: true,
    },
    {
      key: "contact",
      label: "Contact",
      sortable: false,
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center text-xs">
            <Mail className="h-3 w-3 mr-1 text-gray-400" />
            <a
              href={`mailto:${row.email}`}
              className="text-primary-600 hover:text-primary-800"
            >
              {row.email}
            </a>
          </div>
          <div className="flex items-center text-xs">
            <Phone className="h-3 w-3 mr-1 text-gray-400" />
            <span>{row.phone}</span>
          </div>
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
            row.status === "Active"
              ? "bg-green-100 text-green-800"
              : row.status === "On Leave"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.status}
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
            onClick={() => navigate(`/personnel/${row.id}`)}
            className="text-gray-500 hover:text-indigo-600"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {can("personnel", "update") && (
            <button
              onClick={() => navigate(`/personnel/${row.id}/edit`)}
              className="text-gray-500 hover:text-blue-600"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {can("personnel", "delete") && (
            <button
              onClick={() => handleDeletePersonnel(row.id)}
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

  // Filter options for departments and status
  const filterOptions = {
    department: departments.map((dept) => ({
      value: dept.name,
      label: dept.name,
    })),
    status: [
      { value: "Active", label: "Active" },
      { value: "On Leave", label: "On Leave" },
      { value: "Suspended", label: "Suspended" },
      { value: "Retired", label: "Retired" },
    ],
  };

  // Handle personnel deletion
  const handleDeletePersonnel = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this personnel record?")
    ) {
      return;
    }

    try {
      await personnelAPI.delete(id);
      // Refresh the data
      fetchPersonnel();
    } catch (error) {
      console.error("Error deleting personnel:", error);
      alert("Failed to delete personnel record");
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
              Personnel Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage police officers and administrative staff records
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

            {can("personnel", "create") && (
              <Link
                to="/personnel/new"
                className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Personnel
              </Link>
            )}
          </div>
        </div>

        <Table
          columns={columns}
          data={personnel}
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
          emptyMessage="No personnel records found"
        />
      </div>
    </div>
  );
};

export default PersonnelList;
