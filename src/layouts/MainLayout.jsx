import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Sidebar from "../components/navigation/Sidebar";
import Header from "../components/navigation/Header";
import Footer from "../components/navigation/Footer";
import LoadingScreen from "../components/ui/LoadingScreen";
import usePermissionStore from "../store/permissionStore";

const MainLayout = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { fetchUserPermissions, userPermissions } = usePermissionStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Close sidebar on route change on mobile
    setSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    const initializeApp = async () => {
      if (isAuthenticated && user?.id) {
        try {
          // Load permissions if not already loaded
          if (!userPermissions) {
            await fetchUserPermissions(user.id);
          }
        } catch (error) {
          console.error("Error initializing app:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeApp();
  }, [isAuthenticated, user?.id]);

  // Show loading screen while initializing
  if (loading) {
    return <LoadingScreen message="Loading application..." />;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar for navigation */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content area */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={logout}
          user={user}
        />

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Main content */}
              <Outlet />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
