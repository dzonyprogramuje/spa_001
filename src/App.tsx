import { useAuth } from "react-oidc-context";

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
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <h1>Witaj, {auth.user?.profile.preferred_username}! 👋</h1>
        <p>
          Twój adres IP to 127.0.0.1, a Ty jesteś zalogowany przez Keycloak.
        </p>

        <div style={{ padding: "10px", borderRadius: "8px" }}>
          <h3>Twoje dane z tokena:</h3>
          <pre>{JSON.stringify(auth.user?.profile, null, 2)}</pre>
        </div>

        <button
          onClick={() => auth.removeUser()}
          style={{ marginTop: "20px", padding: "10px", cursor: "pointer" }}
        >
          Wyloguj się
        </button>
      </div>
    );
  }

  // 4. Widok startowy (niezalogowany)
  return (
    <div
      style={{ padding: "20px", textAlign: "center", fontFamily: "sans-serif" }}
    >
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
