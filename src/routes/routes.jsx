import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/auth/Login";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Personnel Module
import PersonnelList from "../pages/personnel/PersonnelList";
import PersonnelDetails from "../pages/personnel/PersonnelDetails";
import PersonnelForm from "../pages/personnel/PersonnelForm";

// Case Management Module
import CasesList from "../pages/cases/CasesList";
import CaseDetails from "../pages/cases/CaseDetails";
import CaseForm from "../pages/cases/CaseForm";

// Resource Management Module
import ResourcesList from "../pages/resources/ResourcesList";
import ResourceDetails from "../pages/resources/ResourceDetails.jsx";
import ResourceForm from "../pages/resources/ResourceForm";

// Settings and Administration
import Roles from "../pages/admin/Roles";
import UserManagement from "../pages/admin/UserManagement";
// import SystemSettings from "../pages/admin/SystemSettings.jsx/index.js";
import SystemSettings from "../pages/admin/SystemSettings.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute element={<MainLayout />} />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "personnel",
        children: [
          { index: true, element: <PersonnelList /> },
          { path: "new", element: <PersonnelForm /> },
          { path: ":id", element: <PersonnelDetails /> },
          { path: ":id/edit", element: <PersonnelForm /> },
        ],
      },
      {
        path: "cases",
        children: [
          { index: true, element: <CasesList /> },
          { path: "new", element: <CaseForm /> },
          { path: ":id", element: <CaseDetails /> },
          { path: ":id/edit", element: <CaseForm /> },
        ],
      },
      {
        path: "resources",
        children: [
          { index: true, element: <ResourcesList /> },
          { path: "new", element: <ResourceForm /> },
          { path: ":id", element: <ResourceDetails /> },
          { path: ":id/edit", element: <ResourceForm /> },
        ],
      },
      {
        path: "admin",
        children: [
          { path: "roles", element: <Roles /> },
          { path: "users", element: <UserManagement /> },
          { path: "settings", element: <SystemSettings /> },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      // Add other auth related routes (register, forgot-password, etc.) as needed
    ],
  },
]);

export default router;
