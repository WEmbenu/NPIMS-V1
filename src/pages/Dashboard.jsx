import { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  Truck,
  AlertTriangle,
  FileText,
  Clock,
  Map,
  Activity,
  ChevronRight,
} from "lucide-react";
import usePermission from "../hooks/usePermission";
import { personnelAPI, casesAPI, resourcesAPI } from "../services/mockAPI";
import { Link } from "react-router-dom";

// Dashboard stat card component
const StatCard = ({ title, value, change, icon: Icon, color, loading }) => {
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
                <div className="animate-pulse h-6 bg-gray-200 rounded w-20 mt-1"></div>
              ) : (
                <div className="text-lg font-semibold text-gray-900">
                  {value?.toLocaleString()}
                </div>
              )}
              {!loading && change !== undefined && (
                <div
                  className={`text-sm ${
                    change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {change >= 0 ? "+" : ""}
                  {change}% from last month
                </div>
              )}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
};

// Recent activity component
const RecentActivity = ({ activities, loading }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Recent Activity
        </h3>
        <Link
          to="/activities"
          className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
        >
          View all <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      <div className="divide-y divide-gray-200">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center">
                    <div className="bg-gray-200 rounded-md h-10 w-10 mr-4 animate-pulse"></div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-200 h-4 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="bg-gray-200 h-3 rounded w-1/2 animate-pulse"></div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <div className="bg-gray-200 h-3 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))
          : activities.map((activity, index) => (
              <div key={index} className="px-4 py-4 sm:px-6">
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-md bg-${activity.color}-100 mr-4`}
                  >
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {activity.description}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

// Dashboard page
const Dashboard = () => {
  const { can } = usePermission();
  const [stats, setStats] = useState({
    personnel: { value: 0, change: 0 },
    cases: { value: 0, change: 0 },
    resources: { value: 0, change: 0 },
    alerts: { value: 0, change: 0 },
    reports: { value: 0, change: 0 },
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvals, setApprovals] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch personnel count
        const personnelResponse = await personnelAPI.getAll({ per_page: 1 });

        // Fetch cases count
        const casesResponse = await casesAPI.getAll({ per_page: 1 });

        // Fetch resources count
        const resourcesResponse = await resourcesAPI.getAll({ per_page: 1 });

        // Update stats
        setStats({
          personnel: {
            value: personnelResponse.data.total,
            change: 2.5, // Mock change percentage
          },
          cases: {
            value: casesResponse.data.total,
            change: -4.2, // Mock change percentage
          },
          resources: {
            value: resourcesResponse.data.total,
            change: 1.8, // Mock change percentage
          },
          alerts: {
            value: 12, // Mock value
            change: -8.1, // Mock change percentage
          },
          reports: {
            value: 210, // Mock value
            change: 5.3, // Mock change percentage
          },
        });

        // Set mock activities
        // Set mock activities
        setActivities([
          {
            icon: <Clock className="h-5 w-5 text-blue-600" />,
            title: "New case assigned to Officer Kabila",
            description: "Theft investigation in Central Kinshasa",
            time: "Just now",
            color: "blue",
          },
          {
            icon: <Users className="h-5 w-5 text-green-600" />,
            title: "Officer Mobutu transferred to Lubumbashi Station",
            description: "Approval pending from Provincial Commissioner",
            time: "2 hours ago",
            color: "green",
          },
          {
            icon: <Truck className="h-5 w-5 text-yellow-600" />,
            title: "Resource request approved",
            description: "Vehicle maintenance for 3 patrol cars",
            time: "5 hours ago",
            color: "yellow",
          },
          {
            icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
            title: "High priority alert",
            description: "Armed robbery suspect spotted in Goma",
            time: "Yesterday",
            color: "red",
          },
          {
            icon: <FileText className="h-5 w-5 text-indigo-600" />,
            title: "Monthly report submitted",
            description: "Crime statistics for Eastern Province",
            time: "2 days ago",
            color: "indigo",
          },
        ]);

        // Set mock pending approvals
        setApprovals([
          {
            id: 1,
            type: "Resource Request",
            title: "Resource Request #4587",
            from: "Goma Central Station",
            date: "2023-06-02",
          },
          {
            id: 2,
            type: "Personnel Transfer",
            title: "Personnel Transfer #2345",
            from: "HR Department",
            date: "2023-06-01",
          },
          {
            id: 3,
            type: "Budget Allocation",
            title: "Budget Allocation #7893",
            from: "Finance Department",
            date: "2023-06-01",
          },
          {
            id: 4,
            type: "Case Closure",
            title: "Case Closure #1278",
            from: "Investigations Division",
            date: "2023-05-31",
          },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to the National Police Information Management System.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Dashboard stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {can("personnel", "read") && (
              <StatCard
                title="Total Personnel"
                icon={Users}
                value={stats.personnel.value}
                change={stats.personnel.change}
                color="blue"
                loading={loading}
              />
            )}

            {can("cases", "read") && (
              <StatCard
                title="Active Cases"
                icon={Briefcase}
                value={stats.cases.value}
                change={stats.cases.change}
                color="green"
                loading={loading}
              />
            )}

            {can("resources", "read") && (
              <StatCard
                title="Available Resources"
                icon={Truck}
                value={stats.resources.value}
                change={stats.resources.change}
                color="yellow"
                loading={loading}
              />
            )}

            <StatCard
              title="High Priority Alerts"
              icon={AlertTriangle}
              value={stats.alerts.value}
              change={stats.alerts.change}
              color="red"
              loading={loading}
            />

            {can("reports", "read") && (
              <StatCard
                title="Reports Submitted"
                icon={FileText}
                value={stats.reports.value}
                change={stats.reports.change}
                color="indigo"
                loading={loading}
              />
            )}
          </div>

          {/* Activity feed and map */}
          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <RecentActivity activities={activities} loading={loading} />

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Incident Map
                </h3>
              </div>
              <div className="p-4 flex items-center justify-center h-80 bg-gray-100">
                <div className="text-center">
                  <Map className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Interactive map will be displayed here
                  </p>
                  <p className="text-xs text-gray-400">
                    Connects to geolocation services
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Task summary and approvals section */}
          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2 bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Task Summary
                </h3>
                <Link
                  to="/tasks"
                  className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                >
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="p-4">
                {loading ? (
                  <div className="space-y-4">
                    {Array(4)
                      .fill(0)
                      .map((_, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="bg-gray-200 h-4 rounded w-40 animate-pulse"></div>
                            <div className="bg-gray-200 h-4 rounded w-12 animate-pulse"></div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 animate-pulse"></div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">
                          Cases Assigned
                        </div>
                        <div className="text-sm text-gray-500">24 of 42</div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: "57%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">
                          Resource Utilization
                        </div>
                        <div className="text-sm text-gray-500">75%</div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">
                          Reports Completion
                        </div>
                        <div className="text-sm text-gray-500">90%</div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{ width: "90%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">
                          Station Inspection
                        </div>
                        <div className="text-sm text-gray-500">35%</div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-yellow-600 h-2.5 rounded-full"
                          style={{ width: "35%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Pending Approvals
                </h3>
                <Link
                  to="/approvals"
                  className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                >
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
                {loading ? (
                  <ul className="divide-y divide-gray-200">
                    {Array(4)
                      .fill(0)
                      .map((_, index) => (
                        <li key={index} className="px-4 py-3">
                          <div className="flex items-center justify-between mb-1">
                            <div className="bg-gray-200 h-4 rounded w-40 animate-pulse"></div>
                            <div className="flex">
                              <div className="bg-gray-200 h-6 w-16 rounded-md mr-1 animate-pulse"></div>
                              <div className="bg-gray-200 h-6 w-12 rounded-md animate-pulse"></div>
                            </div>
                          </div>
                          <div className="bg-gray-200 h-3 rounded w-32 animate-pulse"></div>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {approvals.map((approval) => (
                      <li key={approval.id} className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900">
                            {approval.title}
                          </div>
                          <div className="flex">
                            <button className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded-md mr-1">
                              Approve
                            </button>
                            <button className="text-red-600 text-xs bg-red-100 px-2 py-1 rounded-md">
                              Deny
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          From: {approval.from}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
