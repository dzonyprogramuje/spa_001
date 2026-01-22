import { useAuth } from "react-oidc-context";
import { HeaderComponent } from "./components/HeaderComponent.tsx";
import { TasksComponent } from "./components/TasksComponent.tsx";

function App() {
  const { isLoading, error, isAuthenticated, signinRedirect } = useAuth();

  if (isLoading) {
    return <div>Ładowanie sesji...</div>;
  }

  if (error) {
    return <div>Błąd: {error.message}</div>;
  }

  if (isAuthenticated) {
    return (
      <div className="h-screen w-screen flex flex-col gap-8">
        <HeaderComponent />
        <TasksComponent />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex-col justify-center items-center">
      <h1>Aplikacja Demo React + Keycloak</h1>
      <button
        onClick={() => signinRedirect()}
        style={{
          padding: "15px 30px",
          fontSize: "16px",
          cursor: "pointer",
          background: "#646cff",
          color: "white",
          border: "none",
          borderRadius: "8px",
        }}
      >
        Zaloguj się przez Keycloak
      </button>
    </div>
  );
}

export default App;
