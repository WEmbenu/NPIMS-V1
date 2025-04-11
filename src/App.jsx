import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import useAuthStore from "./store/authStore";
import usePermissionStore from "./store/permissionStore";
import LoadingScreen from "./components/ui/LoadingScreen";

function App() {
  const { isAuthenticated, user, checkAuthStatus } = useAuthStore();
  const { fetchUserPermissions, loadingPermissions } = usePermissionStore();

  // Check auth status when app loads
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Fetch user permissions when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUserPermissions(user.id);
    }
  }, [isAuthenticated, user?.id, fetchUserPermissions]);

  // Show loading screen while initializing
  if (loadingPermissions) {
    return <LoadingScreen message="Loading application..." />;
  }

  return <RouterProvider router={router} />;
}

export default App;
