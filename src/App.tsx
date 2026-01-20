import { useAuth } from "react-oidc-context";
import { HeaderComponent } from "./components/HeaderComponent.tsx";
import { TasksComponent } from "./components/TasksComponent.tsx";

function App() {
  const auth = useAuth();

  // 1. Stan ładowania (np. sprawdzanie ciasteczek sesji)
  if (auth.isLoading) {
    return <div>Ładowanie sesji...</div>;
  }

  // 2. Obsługa błędów
  if (auth.error) {
    return <div>Błąd: {auth.error.message}</div>;
  }

  // 3. Widok po zalogowaniu
  if (auth.isAuthenticated) {
    return (
      <div className="h-screen w-screen flex flex-col gap-8">
        <HeaderComponent />
        <TasksComponent />
      </div>
    );
  }

  // 4. Widok startowy (niezalogowany)
  return (
    <div className="h-screen w-screen flex-col justify-center items-center">
      <h1>Aplikacja Demo React + Keycloak</h1>
      <button
        onClick={() => auth.signinRedirect()}
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
