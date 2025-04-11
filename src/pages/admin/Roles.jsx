import { useState, useEffect } from "react";
import { Plus, Edit, Trash, Check, X } from "lucide-react";
import Table from "../../components/ui/Table";
import {
  Form,
  FormSection,
  FormGroup,
  Input,
  Textarea,
  SubmitButton,
  Button,
  Checkbox,
  FormAlert,
} from "../../components/ui/Form";
import { rolesAPI } from "../../services/mockAPI";
import usePermission from "../../hooks/usePermission";

// Module permissions component
const ModulePermissions = ({
  module,
  permissions,
  selectedPermissions,
  onChange,
}) => {
  // Generate all possible permissions for this module
  const modulePermissions = [
    `${module}:read`,
    `${module}:create`,
    `${module}:update`,
    `${module}:delete`,
  ];

  // Special permissions for certain modules
  if (module === "resources") {
    modulePermissions.push(`${module}:request`);
    modulePermissions.push(`${module}:approve`);
  }

  if (module === "reports") {
    modulePermissions.push(`${module}:export`);
  }

  if (module === "admin") {
    modulePermissions.push(`${module}:users`);
    modulePermissions.push(`${module}:roles`);
    modulePermissions.push(`${module}:settings`);
  }

  // Function to check if a permission is selected
  const isSelected = (permission) => selectedPermissions.includes(permission);

  // Handle checkbox change
  const handleChange = (permission, checked) => {
    if (checked) {
      onChange([...selectedPermissions, permission]);
    } else {
      onChange(selectedPermissions.filter((p) => p !== permission));
    }
  };

  // Calculate if all permissions for this module are selected
  const allSelected = modulePermissions.every((p) => isSelected(p));

  // Handle selecting all permissions for this module
  const handleSelectAll = (checked) => {
    if (checked) {
      // Add all module permissions
      const newPermissions = [...selectedPermissions];
      modulePermissions.forEach((p) => {
        if (!newPermissions.includes(p)) {
          newPermissions.push(p);
        }
      });
      onChange(newPermissions);
    } else {
      // Remove all module permissions
      onChange(selectedPermissions.filter((p) => !p.startsWith(`${module}:`)));
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center mb-2">
        <Checkbox
          id={`select-all-${module}`}
          checked={allSelected}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
        <label
          htmlFor={`select-all-${module}`}
          className="ml-2 text-sm font-medium text-gray-700"
        >
          {module.charAt(0).toUpperCase() + module.slice(1)}
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2 ml-6">
        {modulePermissions.map((permission) => (
          <div key={permission} className="flex items-center">
            <Checkbox
              id={permission}
              checked={isSelected(permission)}
              onChange={(e) => handleChange(permission, e.target.checked)}
            />
            <label htmlFor={permission} className="ml-2 text-xs text-gray-600">
              {permission.split(":")[1]}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

// Role editor component
const RoleEditor = ({ role, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: role?.name || "",
    displayName: role?.displayName || "",
    description: role?.description || "",
    permissions: role?.permissions || [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle permissions changes
  const handlePermissionsChange = (permissions) => {
    setFormData((prev) => ({
      ...prev,
      permissions,
    }));
  };

  // Handle wildcard permission toggle
  const handleWildcardToggle = (checked) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        permissions: ["*"],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        permissions: [],
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await onSave(formData);
      if (!result.success) {
        setError(result.error || "Failed to save role");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error saving role:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check if wildcard permission is selected
  const hasWildcard = formData.permissions.includes("*");

  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <FormAlert
          type="error"
          title="Error"
          message={error}
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}

      <FormSection
        title={role ? "Edit Role" : "Create New Role"}
        description="Configure role details and permissions"
      >
        <FormGroup
          label="Role Name"
          htmlFor="name"
          helpText="Unique identifier for the role (lowercase, no spaces)"
          required
        >
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. station_commander"
            required
            pattern="^[a-z0-9_]+$"
            title="Lowercase letters, numbers, and underscores only"
          />
        </FormGroup>

        <FormGroup
          label="Display Name"
          htmlFor="displayName"
          className="mt-4"
          required
        >
          <Input
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="e.g. Station Commander"
            required
          />
        </FormGroup>

        <FormGroup label="Description" htmlFor="description" className="mt-4">
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of this role"
            rows={2}
          />
        </FormGroup>

        <hr className="my-6" />

        <h3 className="text-base font-medium text-gray-900 mb-4">
          Permissions
        </h3>

        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
          <div className="flex items-center">
            <Checkbox
              id="wildcard-permission"
              checked={hasWildcard}
              onChange={(e) => handleWildcardToggle(e.target.checked)}
            />
            <label
              htmlFor="wildcard-permission"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Full System Access (all permissions)
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500 ml-6">
            This grants unrestricted access to all system functions. Use with
            caution.
          </p>
        </div>

        {!hasWildcard && (
          <div className="space-y-4">
            <ModulePermissions
              module="personnel"
              selectedPermissions={formData.permissions}
              onChange={handlePermissionsChange}
            />

            <ModulePermissions
              module="cases"
              selectedPermissions={formData.permissions}
              onChange={handlePermissionsChange}
            />

            <ModulePermissions
              module="resources"
              selectedPermissions={formData.permissions}
              onChange={handlePermissionsChange}
            />

            <ModulePermissions
              module="intelligence"
              selectedPermissions={formData.permissions}
              onChange={handlePermissionsChange}
            />

            <ModulePermissions
              module="reports"
              selectedPermissions={formData.permissions}
              onChange={handlePermissionsChange}
            />

            <ModulePermissions
              module="admin"
              selectedPermissions={formData.permissions}
              onChange={handlePermissionsChange}
            />
          </div>
        )}
      </FormSection>

      <div className="mt-6 flex justify-end space-x-3">
        <Button type="button" onClick={onCancel} variant="default">
          Cancel
        </Button>

        <SubmitButton
          loading={loading}
          loadingText={role ? "Updating..." : "Creating..."}
        >
          {role ? "Update Role" : "Create Role"}
        </SubmitButton>
      </div>
    </Form>
  );
};

// Main Roles component
const Roles = () => {
  const { can } = usePermission();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  // Fetch roles
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await rolesAPI.getAll();
      if (response.success) {
        setRoles(response.data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchRoles();
  }, []);

  // Handle role edit
  const handleEditRole = (role) => {
    setEditingRole(role);
    setShowEditor(true);
  };

  // Handle role creation
  const handleCreateRole = () => {
    setEditingRole(null);
    setShowEditor(true);
  };

  // Handle role deletion
  const handleDeleteRole = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) {
      return;
    }

    try {
      const response = await rolesAPI.delete(id);
      if (response.success) {
        // Refresh the roles list
        fetchRoles();
      } else {
        alert(
          "Failed to delete role: " + (response.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("Failed to delete role");
    }
  };

  // Handle save role (create or update)
  const handleSaveRole = async (formData) => {
    try {
      let response;

      if (editingRole) {
        // Update existing role
        response = await rolesAPI.update(editingRole.id, formData);
      } else {
        // Create new role
        response = await rolesAPI.create(formData);
      }

      if (response.success) {
        // Refresh the roles list and close the editor
        fetchRoles();
        setShowEditor(false);
        return { success: true };
      } else {
        return {
          success: false,
          error: response.message || "Failed to save role",
        };
      }
    } catch (error) {
      console.error("Error saving role:", error);
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  };

  // Define table columns
  const columns = [
    {
      key: "displayName",
      label: "Role",
      sortable: true,
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.displayName}</div>
          <div className="text-xs text-gray-500 font-mono">{row.name}</div>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
    },
    {
      key: "permissions",
      label: "Access Level",
      sortable: false,
      render: (row) => (
        <div>
          {row.permissions.includes("*") ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Full Access
            </span>
          ) : (
            <span className="text-xs text-gray-500">
              {row.permissions.length} permissions
            </span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <div className="flex items-center space-x-2">
          {can("admin", "roles") && (
            <button
              onClick={() => handleEditRole(row)}
              className="text-gray-500 hover:text-blue-600"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {can("admin", "roles") && row.name !== "national_commissioner" && (
            <button
              onClick={() => handleDeleteRole(row.id)}
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

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {showEditor ? (
          // Role editor view
          <div>
            <RoleEditor
              role={editingRole}
              onSave={handleSaveRole}
              onCancel={() => setShowEditor(false)}
            />
          </div>
        ) : (
          // Roles list view
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Role Management
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage roles and permissions for system users
                </p>
              </div>

              {can("admin", "roles") && (
                <div className="mt-4 sm:mt-0">
                  <button
                    onClick={handleCreateRole}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    New Role
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <Table
                  columns={columns}
                  data={roles}
                  isLoading={loading}
                  emptyMessage="No roles found"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roles;
