import { createBrowserRouter, Navigate } from "react-router";
import { LoginPage } from "./LoginPage";
import { TasksComponent } from "./TasksComponent";
import { ProfileComponent } from "./ProfileComponent.tsx";
import { ProtectedRoute } from "./ProtectedRoute.tsx";

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
        element: <TasksComponent />,
      },
      {
        path: "profile",
        element: <ProfileComponent />,
      },
      {
        index: true,
        element: <Navigate to="/tasks" replace />,
      },
    ],
  },
]);
