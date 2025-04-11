import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import usePermissionStore from "../../store/permissionStore";
import LoadingScreen from "../ui/LoadingScreen";

/**
 * ProtectedRoute component that checks authentication and permissions
 * @param {Object} props - Component props
 * @param {JSX.Element} props.element - The element to render if authorized
 * @param {String} props.requiredPermission - Optional specific permission required
 * @param {String} props.redirectPath - Path to redirect to if unauthorized
 */
const ProtectedRoute = ({
  element,
  requiredPermission = null,
  redirectPath = "/auth/login",
}) => {
  const location = useLocation();
  const { isAuthenticated, checkAuthStatus, user } = useAuthStore();
  const { fetchUserPermissions, hasPermission, loadingPermissions } =
    usePermissionStore();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // First check if the token is valid
      const isValid = checkAuthStatus();

      if (!isValid) {
        setAuthorized(false);
        setChecking(false);
        return;
      }

      // If no specific permission required, user is authorized
      if (!requiredPermission) {
        setAuthorized(true);
        setChecking(false);
        return;
      }

      // Load user permissions if needed
      if (user?.id) {
        await fetchUserPermissions(user.id);

        // Check if user has the required permission
        const hasRequired = hasPermission(requiredPermission);
        setAuthorized(hasRequired);
      } else {
        setAuthorized(false);
      }

      setChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, requiredPermission, user?.id]);

  // Show loading screen while checking authentication
  if (checking || loadingPermissions) {
    return <LoadingScreen message="Verifying access..." />;
  }

  // Redirect if not authenticated or not authorized
  if (!authorized) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Render the protected element
  return element;
};

export default ProtectedRoute;
