import { Fragment, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import {
  X,
  Home,
  Users,
  Briefcase,
  Truck,
  FileText,
  BarChart2,
  MapPin,
  Shield,
  Settings,
  AlertTriangle,
  MessageSquare,
  Database,
  UserCheck,
  HelpCircle,
} from "lucide-react";
import usePermission from "../../hooks/usePermission";
import useAuthStore from "../../store/authStore";

// Navigation item component
const NavItem = ({ to, icon: Icon, label, active, children }) => {
  const location = useLocation();
  const isActive = active || location.pathname.startsWith(to);

  return (
    <div className="space-y-1">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `${
            isActive
              ? "bg-primary-800 text-white"
              : "text-primary-100 hover:bg-primary-700"
          } group flex items-center px-2 py-2 text-sm font-medium rounded-md`
        }
      >
        <Icon
          className="mr-3 flex-shrink-0 h-5 w-5 text-primary-300"
          aria-hidden="true"
        />
        {label}
      </NavLink>
      {isActive && children && <div className="ml-8 space-y-1">{children}</div>}
    </div>
  );
};

// Sidebar component
const Sidebar = ({ isOpen, setIsOpen }) => {
  const { can, hasRole } = usePermission();
  const { user } = useAuthStore();
  const [modules, setModules] = useState([]);

  // Generate available modules based on user permissions
  useEffect(() => {
    // Define all possible modules
    const allModules = [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: Home,
        path: "/",
        permission: null, // Always visible
      },
      {
        id: "personnel",
        label: "Personnel Management",
        icon: Users,
        path: "/personnel",
        permission: "personnel:read",
      },
      {
        id: "cases",
        label: "Case Management",
        icon: Briefcase,
        path: "/cases",
        permission: "cases:read",
      },
      {
        id: "resources",
        label: "Resource Management",
        icon: Truck,
        path: "/resources",
        permission: "resources:read",
      },
      {
        id: "reports",
        label: "Reports",
        icon: FileText,
        path: "/reports",
        permission: "reports:read",
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: BarChart2,
        path: "/analytics",
        permission: "analytics:read",
      },
      {
        id: "incidents",
        label: "Incident Tracking",
        icon: MapPin,
        path: "/incidents",
        permission: "incidents:read",
      },
      {
        id: "intelligence",
        label: "Intelligence",
        icon: Shield,
        path: "/intelligence",
        permission: "intelligence:read",
      },
      {
        id: "wanted",
        label: "Wanted Persons",
        icon: AlertTriangle,
        path: "/wanted",
        permission: "wanted:read",
      },
      {
        id: "communications",
        label: "Communications",
        icon: MessageSquare,
        path: "/communications",
        permission: "communications:read",
      },
      {
        id: "approvals",
        label: "Approvals",
        icon: UserCheck,
        path: "/approvals",
        permission: "approvals:read",
      },
      {
        id: "admin",
        label: "Administration",
        icon: Settings,
        path: "/admin",
        permission: "admin:read",
        children: [
          {
            id: "roles",
            label: "Role Management",
            path: "/admin/roles",
            permission: "admin:roles",
          },
          {
            id: "users",
            label: "User Management",
            path: "/admin/users",
            permission: "admin:users",
          },
          {
            id: "settings",
            label: "System Settings",
            path: "/admin/settings",
            permission: "admin:settings",
          },
        ],
      },
    ];

    // Filter modules based on user role and permissions
    let visibleModules;

    // National Commissioner gets all modules
    if (hasRole("national_commissioner")) {
      visibleModules = allModules;
    } else {
      // Filter based on individual permissions
      visibleModules = allModules.filter((module) => {
        // Dashboard is always visible
        if (module.id === "dashboard") return true;

        // Check if user has permission for this module
        return !module.permission || can(module.permission);
      });
    }

    setModules(visibleModules);
  }, [can, hasRole, user]);

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-40 md:hidden"
          onClose={setIsOpen}
        >
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          {/* Sidebar panel */}
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-primary-700">
              {/* Close button */}
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <X className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>

              {/* Logo */}
              <div className="flex-shrink-0 flex items-center px-4">
                <img className="h-8 w-auto" src="/logo.png" alt="NPIMS Logo" />
                <span className="ml-2 text-white font-semibold text-lg">
                  NPIMS
                </span>
              </div>

              {/* User info */}
              <div className="px-4 py-2 mt-2 border-b border-primary-800">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        className="h-8 w-8 rounded-full"
                        alt={user.name}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                        {user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-primary-300 truncate">
                      {user?.role
                        ?.replace("_", " ")
                        ?.replace(/\b\w/g, (l) => l.toUpperCase()) || "Role"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-2 flex-1 h-0 overflow-y-auto">
                <nav className="px-2 space-y-1">
                  {modules.map((module) => (
                    <NavItem
                      key={module.id}
                      to={module.path}
                      icon={module.icon}
                      label={module.label}
                    >
                      {module.children?.map((child) =>
                        hasRole("national_commissioner") ||
                        can(child.permission) ? (
                          <NavLink
                            key={child.id}
                            to={child.path}
                            className={({ isActive }) =>
                              `${
                                isActive
                                  ? "bg-primary-800 text-white"
                                  : "text-primary-100 hover:bg-primary-700"
                              } group flex items-center px-2 py-2 text-xs font-medium rounded-md`
                            }
                          >
                            {child.label}
                          </NavLink>
                        ) : null
                      )}
                    </NavItem>
                  ))}
                </nav>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-primary-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <img className="h-8 w-auto" src="/logo.png" alt="NPIMS Logo" />
              <span className="ml-2 text-white font-semibold text-lg">
                NPIMS
              </span>
            </div>

            {/* User info */}
            <div className="px-4 py-2 mt-2 border-b border-primary-800">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      className="h-8 w-8 rounded-full"
                      alt={user.name}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div className="ml-2 overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-primary-300 truncate">
                    {user?.role
                      ?.replace("_", " ")
                      ?.replace(/\b\w/g, (l) => l.toUpperCase()) || "Role"}
                  </p>
                </div>
              </div>
            </div>

            <nav className="mt-5 flex-1 px-2 space-y-1">
              {modules.map((module) => (
                <NavItem
                  key={module.id}
                  to={module.path}
                  icon={module.icon}
                  label={module.label}
                >
                  {module.children?.map((child) =>
                    hasRole("national_commissioner") ||
                    can(child.permission) ? (
                      <NavLink
                        key={child.id}
                        to={child.path}
                        className={({ isActive }) =>
                          `${
                            isActive
                              ? "bg-primary-800 text-white"
                              : "text-primary-100 hover:bg-primary-700"
                          } group flex items-center px-2 py-2 text-xs font-medium rounded-md`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ) : null
                  )}
                </NavItem>
              ))}
            </nav>
          </div>

          {/* Help button */}
          <div className="flex-shrink-0 flex border-t border-primary-800 p-4">
            <Link
              to="/help"
              className="flex-shrink-0 w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-primary-100 hover:bg-primary-700"
            >
              <HelpCircle className="mr-3 flex-shrink-0 h-5 w-5 text-primary-300" />
              Help & Support
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
