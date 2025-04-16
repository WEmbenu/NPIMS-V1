import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Sidebar from "../components/navigation/Sidebar";
import Header from "../components/navigation/Header";
import Footer from "../components/navigation/Footer";
import LoadingScreen from "../components/ui/LoadingScreen";
import usePermissionStore from "../store/permissionStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MainLayout = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { fetchUserPermissions, userPermissions } = usePermissionStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true); // Track desktop sidebar state
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Get and set sidebar preference from localStorage
  useEffect(() => {
    const savedSidebarState = localStorage.getItem("npims-sidebar-expanded");
    if (savedSidebarState !== null) {
      setSidebarExpanded(savedSidebarState === "true");
    }
  }, []);

  // Save sidebar preference to localStorage
  useEffect(() => {
    localStorage.setItem("npims-sidebar-expanded", sidebarExpanded.toString());
  }, [sidebarExpanded]);

  useEffect(() => {
    // Close mobile sidebar on route change
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
  }, [isAuthenticated, user?.id, fetchUserPermissions, userPermissions]);

  // Toggle sidebar expanded state (for desktop)
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Show loading screen while initializing
  if (loading) {
    return <LoadingScreen message="Loading application..." />;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar for navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isExpanded={sidebarExpanded}
      />

      {/* Main content area with correct padding based on sidebar state */}
      <div
        className={`flex flex-col flex-1 overflow-hidden ${
          sidebarExpanded ? "md:ml-64" : "md:ml-16"
        } transition-all duration-300`}
      >
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={logout}
          user={user}
        />

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {/* Sidebar toggle button for desktop */}
          <button
            onClick={toggleSidebar}
            className="hidden md:flex absolute top-2 left-0 z-10 items-center justify-center h-8 w-5 bg-primary-600 text-white rounded-r-md focus:outline-none hover:bg-primary-700 transition-colors"
            aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarExpanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

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
