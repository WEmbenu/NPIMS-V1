import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Shield,
  Settings,
  Database,
  Activity,
  AlertTriangle,
  Clock,
  Server,
} from "lucide-react";
import usePermission from "../../hooks/usePermission";

// Stat card component
const StatCard = ({ title, value, icon: Icon, color, loading }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-md bg-${color}-100`}>
              <Icon className={`h-6 w-6 text-${color}-600`} />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd>
              {loading ? (
                <div className="animate-pulse h-6 bg-gray-200 rounded w-16 mt-1"></div>
              ) : (
                <div className="text-lg font-semibold text-gray-900">
                  {value}
                </div>
              )}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin panel card component
const AdminPanelCard = ({
  title,
  description,
  icon: Icon,
  color,
  linkTo,
  loading,
}) => {
  return (
    <Link
      to={linkTo}
      className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-md bg-${color}-100`}>
              <Icon className={`h-6 w-6 text-${color}-600`} />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

// System status component
const SystemStatus = ({ status }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          System Status
        </h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">System Health</dt>
            <dd className="mt-1 flex items-center">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  status.health === "Good"
                    ? "bg-green-100 text-green-800"
                    : status.health === "Warning"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {status.health}
              </span>
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Database</dt>
            <dd className="mt-1 flex items-center">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  status.database === "Connected"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {status.database}
              </span>
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              System Version
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{status.version}</dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
            <dd className="mt-1 text-sm text-gray-900">{status.lastUpdated}</dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Active Sessions
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {status.activeSessions}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Server Uptime</dt>
            <dd className="mt-1 text-sm text-gray-900">{status.uptime}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

// Recent activity log component
const ActivityLog = ({ activities, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex">
              <div className="h-8 w-8 rounded-full bg-gray-200 mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, index) => (
          <li key={index}>
            <div className="relative pb-8">
              {index !== activities.length - 1 && (
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                ></span>
              )}
              <div className="relative flex items-start space-x-3">
                <div>
                  <div
                    className={`relative px-1 bg-${activity.color}-100 rounded-full`}
                  >
                    <activity.icon
                      className={`h-8 w-8 p-1 text-${activity.color}-600`}
                    />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div>
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {activity.timestamp} • {activity.user}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Main admin dashboard component
const AdminDashboard = () => {
  const { can } = usePermission();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    roles: 0,
    activeSessions: 0,
    pendingApprovals: 0,
  });
  const [systemStatus, setSystemStatus] = useState({
    health: "Good",
    database: "Connected",
    version: "1.0.0",
    lastUpdated: "2023-06-01",
    activeSessions: 0,
    uptime: "7d 12h 45m",
  });
  const [activities, setActivities] = useState([]);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      // Mock data that would come from APIs in a real application
      setStats({
        users: 87,
        roles: 5,
        activeSessions: 32,
        pendingApprovals: 12,
      });

      setSystemStatus({
        health: "Good",
        database: "Connected",
        version: "1.0.0",
        lastUpdated: "2023-06-01",
        activeSessions: 32,
        uptime: "7d 12h 45m",
      });

      setActivities([
        {
          message: "System backup completed successfully",
          timestamp: "Just now",
          user: "System",
          icon: Server,
          color: "green",
        },
        {
          message: "User 'Marie Tshombe' updated role permissions",
          timestamp: "2 hours ago",
          user: "Marie Tshombe",
          icon: Shield,
          color: "blue",
        },
        {
          message: "Failed login attempt from unauthorized IP",
          timestamp: "5 hours ago",
          user: "Security System",
          icon: AlertTriangle,
          color: "red",
        },
        {
          message: "System settings updated",
          timestamp: "Yesterday",
          user: "John Kabila",
          icon: Settings,
          color: "indigo",
        },
        {
          message: "New user 'Pierre Mulele' added to the system",
          timestamp: "3 days ago",
          user: "Admin",
          icon: Users,
          color: "purple",
        },
      ]);

      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Administration Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          System overview and administration tools
        </p>

        {/* Stats overview */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats.users}
            icon={Users}
            color="blue"
            loading={loading}
          />

          <StatCard
            title="System Roles"
            value={stats.roles}
            icon={Shield}
            color="purple"
            loading={loading}
          />

          <StatCard
            title="Active Sessions"
            value={stats.activeSessions}
            icon={Activity}
            color="green"
            loading={loading}
          />

          <StatCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon={Clock}
            color="yellow"
            loading={loading}
          />
        </div>

        {/* Admin panels and status */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Admin panels in 2-column section */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {can("admin", "users") && (
              <AdminPanelCard
                title="User Management"
                description="Manage system users and accounts"
                icon={Users}
                color="blue"
                linkTo="/admin/users"
                loading={loading}
              />
            )}

            {can("admin", "roles") && (
              <AdminPanelCard
                title="Role Management"
                description="Configure roles and permissions"
                icon={Shield}
                color="purple"
                linkTo="/admin/roles"
                loading={loading}
              />
            )}

            {can("admin", "settings") && (
              <AdminPanelCard
                title="System Settings"
                description="Configure system-wide settings"
                icon={Settings}
                color="indigo"
                linkTo="/admin/settings"
                loading={loading}
              />
            )}

            {can("admin", "read") && (
              <AdminPanelCard
                title="Database Management"
                description="Manage and maintain database"
                icon={Database}
                color="green"
                linkTo="/admin/database"
                loading={loading}
              />
            )}
          </div>

          {/* System status in 1-column section */}
          <div className="lg:col-span-1">
            <SystemStatus status={systemStatus} />
          </div>
        </div>

        {/* Activity log */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent System Activity
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <ActivityLog activities={activities} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
