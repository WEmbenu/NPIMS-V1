import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  FileText,
  AlertTriangle,
  Truck,
  BarChart2,
  RefreshCw,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import usePermissionStore from "../store/permissionStore";
import { mockAPI } from "../services/mockAPI";

const Dashboard = () => {
  const { user } = useAuthStore();
  const { hasPermission } = usePermissionStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch this data from your API
        const dashboardData = await mockAPI.getDashboardData();
        setStats(dashboardData.stats);
        setRecentActivity(dashboardData.recentActivity || []);
        setPendingApprovals(dashboardData.pendingApprovals || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Formatting helpers
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Handle refresh
  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Refresh data
      const dashboardData = await mockAPI.getDashboardData();
      setStats(dashboardData.stats);
      setRecentActivity(dashboardData.recentActivity || []);
      setPendingApprovals(dashboardData.pendingApprovals || []);
    } catch (error) {
      console.error("Error refreshing dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 px-3 py-1 bg-white text-primary-600 border border-primary-300 rounded-md hover:bg-primary-50"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stats cards */}
        {hasPermission("personnel:read") && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>{" "}
                {/* Fixed missing closing tag */}
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Officers
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats?.activeOfficers || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  to="/personnel"
                  className="font-medium text-primary-600 hover:text-primary-900"
                >
                  View all
                </Link>
              </div>
            </div>
          </div>
        )}

        {hasPermission("cases:read") && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Open Cases
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats?.openCases || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  to="/cases"
                  className="font-medium text-yellow-600 hover:text-yellow-900"
                >
                  View all
                </Link>
              </div>
            </div>
          </div>
        )}

        {hasPermission("incidents:read") && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Urgent Incidents
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats?.urgentIncidents || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  to="/incidents"
                  className="font-medium text-red-600 hover:text-red-900"
                >
                  View all
                </Link>
              </div>
            </div>
          </div>
        )}

        {hasPermission("resources:read") && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Available Vehicles
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats?.availableVehicles || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  to="/resources"
                  className="font-medium text-green-600 hover:text-green-900"
                >
                  View all
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <Link
            to="/reports/activity"
            className="text-sm text-primary-600 hover:text-primary-900"
          >
            View all
          </Link>
        </div>
        <div className="bg-gray-50 border-t border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <li key={index}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-primary-600 truncate">
                        {activity.title}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {activity.timestamp
                            ? new Date(activity.timestamp).toLocaleString()
                            : "Unknown date"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-6 text-center text-sm text-gray-500">
                No recent activity to display
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Pending Approvals */}
      {hasPermission("approvals:read") && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Pending Approvals
            </h2>
            <Link
              to="/approvals"
              className="text-sm text-primary-600 hover:text-primary-900"
            >
              View all
            </Link>
          </div>
          <div className="bg-gray-50 border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {pendingApprovals.length > 0 ? (
                pendingApprovals.map((approval, index) => (
                  <li
                    key={index}
                    className="px-4 py-4 sm:px-6 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {approval.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {approval.requestedBy}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                        Approve
                      </button>
                      <button className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm">
                        Deny
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-6 text-center text-sm text-gray-500">
                  No pending approvals
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Analytics Preview (Only shown to users with analytics permission) */}
      {hasPermission("analytics:read") && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Analytics Overview
            </h2>
            <Link
              to="/analytics"
              className="text-sm text-primary-600 hover:text-primary-900"
            >
              Full Analytics
            </Link>
          </div>
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-center">
              <BarChart2 className="h-40 w-40 text-gray-300" />
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                Click 'Full Analytics' to view detailed reports and
                visualizations
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
