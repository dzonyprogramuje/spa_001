import { createBrowserRouter, Navigate } from "react-router";
import { LoginPage } from "@pages/LoginPage";
import { ProfilePage } from "@pages/ProfilePage";
import { TasksPage } from "@pages/TasksPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "tasks",
        element: <TasksPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        index: true,
        element: <Navigate to="/tasks" replace />,
      },
    ],
  },
]);
