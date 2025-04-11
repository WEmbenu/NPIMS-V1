import { create } from "zustand";
import { devtools } from "zustand/middleware";
import api from "../utils/api";

const usePermissionStore = create(
  devtools(
    (set, get) => ({
      // State
      roles: [],
      userPermissions: null,
      loadingPermissions: false,
      permissionsError: null,

      // Get all roles with their permissions
      fetchRoles: async () => {
        try {
          set({ loadingPermissions: true });

          // In production, this would come from an API
          // const response = await api.get("/roles");
          // const roles = response.data.data;

          // For now, we'll use mock data
          const mockRoles = [
            {
              id: 1,
              name: "national_commissioner",
              display_name: "National Police Commissioner",
              description: "Highest authority in the national police force",
              permissions: ["*"], // Wildcard for all permissions
            },
            {
              id: 2,
              name: "provincial_commissioner",
              display_name: "Provincial Commissioner",
              description: "Head of police in a province",
              permissions: [
                "personnel:read",
                "personnel:create",
                "personnel:update",
                "cases:read",
                "cases:create",
                "cases:update",
                "cases:delete",
                "resources:read",
                "resources:create",
                "resources:update",
                "resources:approve",
                "intelligence:read",
                "intelligence:create",
                "reports:read",
                "reports:create",
              ],
            },
            {
              id: 3,
              name: "station_commander",
              display_name: "Station Commander",
              description: "Head of a police station",
              permissions: [
                "personnel:read",
                "cases:read",
                "cases:create",
                "cases:update",
                "resources:read",
                "resources:request",
                "intelligence:read",
                "intelligence:create",
                "reports:read",
                "reports:create",
              ],
            },
            {
              id: 4,
              name: "officer",
              display_name: "Police Officer",
              description: "Regular police officer",
              permissions: [
                "personnel:read:self",
                "cases:read",
                "cases:create",
                "resources:read",
                "resources:request",
                "intelligence:read",
                "reports:read",
                "reports:create:self",
              ],
            },
            {
              id: 5,
              name: "admin_staff",
              display_name: "Administrative Staff",
              description: "Non-officer administrative personnel",
              permissions: [
                "personnel:read",
                "resources:read",
                "resources:create",
                "resources:update",
                "reports:read",
                "reports:create",
              ],
            },
          ];

          set({
            roles: mockRoles,
            loadingPermissions: false,
            permissionsError: null,
          });

          return mockRoles;
        } catch (error) {
          set({
            loadingPermissions: false,
            permissionsError: error.message,
          });
          console.error("Error fetching roles:", error);
          return [];
        }
      },

      // Load permissions for the current user
      fetchUserPermissions: async (userId) => {
        try {
          set({ loadingPermissions: true });

          // In production, this would come from an API
          // const response = await api.get(`/users/${userId}/permissions`);
          // const permissions = response.data.data;

          // For now, we'll use mock data based on the authStore
          const { user } = useAuthStore.getState();

          if (!user || !user.role) {
            throw new Error("User or role information not available");
          }

          // Find the role in our mock data
          const roles = get().roles.length
            ? get().roles
            : await get().fetchRoles();
          const userRole = roles.find((role) => role.name === user.role);

          if (!userRole) {
            throw new Error(`Role '${user.role}' not found`);
          }

          set({
            userPermissions: userRole.permissions,
            loadingPermissions: false,
            permissionsError: null,
          });

          return userRole.permissions;
        } catch (error) {
          set({
            loadingPermissions: false,
            permissionsError: error.message,
          });
          console.error("Error fetching user permissions:", error);
          return [];
        }
      },

      // Create a new role
      createRole: async (roleData) => {
        try {
          // In production, this would be an API call
          // const response = await api.post("/roles", roleData);
          // const newRole = response.data.data;

          // For demo, we'll just update the local state
          const newRole = {
            id: Math.max(0, ...get().roles.map((r) => r.id)) + 1,
            ...roleData,
          };

          set({ roles: [...get().roles, newRole] });
          return { success: true, data: newRole };
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.message || "Failed to create role",
          };
        }
      },

      // Update an existing role
      updateRole: async (roleId, roleData) => {
        try {
          // In production, this would be an API call
          // const response = await api.put(`/roles/${roleId}`, roleData);
          // const updatedRole = response.data.data;

          // For demo, we'll just update the local state
          const roles = get().roles;
          const updatedRoles = roles.map((role) =>
            role.id === roleId ? { ...role, ...roleData } : role
          );

          set({ roles: updatedRoles });
          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.message || "Failed to update role",
          };
        }
      },

      // Delete a role
      deleteRole: async (roleId) => {
        try {
          // In production, this would be an API call
          // await api.delete(`/roles/${roleId}`);

          // For demo, we'll just update the local state
          const roles = get().roles;
          set({ roles: roles.filter((role) => role.id !== roleId) });
          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.message || "Failed to delete role",
          };
        }
      },

      // Check if user has a specific permission
      hasPermission: (permission) => {
        const permissions = get().userPermissions;

        if (!permissions) {
          return false;
        }

        // Check for wildcard permission
        if (permissions.includes("*")) {
          return true;
        }

        // Direct permission match
        if (permissions.includes(permission)) {
          return true;
        }

        // Module-level wildcard (e.g., "cases:*" grants all case permissions)
        const moduleWildcard = permission.split(":")[0] + ":*";
        if (permissions.includes(moduleWildcard)) {
          return true;
        }

        return false;
      },

      // More granular permission check for module:submodule:action pattern
      checkPermission: (module, submodule = null, action = null) => {
        // Get the current user from auth store
        const { user } = useAuthStore.getState();

        // National Commissioner has all permissions
        if (user?.role === "national_commissioner") {
          return true;
        }

        // Build the permission string based on provided params
        let permissionToCheck;

        if (!submodule && !action) {
          // Just checking module access
          permissionToCheck = `${module}:read`; // Default to read permission
        } else if (!action) {
          // Checking module:action
          permissionToCheck = `${module}:${submodule}`;
        } else {
          // Full module:submodule:action check
          permissionToCheck = `${module}:${submodule}:${action}`;
        }

        return get().hasPermission(permissionToCheck);
      },
    }),
    {
      name: "npims-permissions-store",
    }
  )
);

export default usePermissionStore;
