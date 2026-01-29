import { useAuth } from "@hooks/useAuth";
import { Navigate, Outlet } from "react-router";
import { NavbarComponent } from "../components/NavbarComponent";

export const ProtectedRoute = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Ładowanie sesji...</div>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen w-screen flex flex-col gap-8">
      <NavbarComponent />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};
