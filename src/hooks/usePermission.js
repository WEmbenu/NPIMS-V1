import { useEffect } from "react";
import usePermissionStore from "../store/permissionStore";
import useAuthStore from "../store/authStore";

/**
 * Custom hook for checking user permissions
 * @returns {Object} Permission helper functions
 */
const usePermission = () => {
  const {
    userPermissions,
    fetchUserPermissions,
    hasPermission,
    checkPermission,
  } = usePermissionStore();

  const { user, isAuthenticated } = useAuthStore();

  // Load user permissions if not already loaded
  useEffect(() => {
    if (isAuthenticated && user?.id && !userPermissions) {
      fetchUserPermissions(user.id);
    }
  }, [isAuthenticated, user?.id, userPermissions]);

  /**
   * Check if user can access a feature
   * @param {String} module - The module name
   * @param {String|null} submodule - Optional submodule name
   * @param {String|null} action - Optional action (create, read, update, delete)
   * @returns {Boolean} Whether user has permission
   */
  const can = (module, submodule = null, action = null) => {
    return checkPermission(module, submodule, action);
  };

  /**
   * Check if user can perform a specific action
   * @param {String} permission - Full permission string (e.g., "cases:create")
   * @returns {Boolean} Whether user has permission
   */
  const canDo = (permission) => {
    return hasPermission(permission);
  };

  /**
   * Check if current user has a specific role
   * @param {String|Array} roleName - Role name or array of role names
   * @returns {Boolean} Whether user has the role
   */
  const hasRole = (roleName) => {
    if (!user || !user.role) return false;

    if (Array.isArray(roleName)) {
      return roleName.includes(user.role);
    }

    return user.role === roleName;
  };

  return {
    can,
    canDo,
    hasRole,
    isLoading: !userPermissions,
  };
};

export default usePermission;
