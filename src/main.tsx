import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "react-oidc-context";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { HeroUIProvider } from "@heroui/react";

const oidcConfig = {
  authority: "http://127.0.0.1:8080/realms/my-dev-realm",
  client_id: "react-app",
  redirect_uri: "http://127.0.0.1:5173",
  response_type: "code",
  post_logout_redirect_uri: window.location.origin,
  onSigninCallback: () => {
    // Czyści URL z parametrów Keycloaka po zalogowaniu
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider {...oidcConfig}>
      <Provider store={store}>
        <HeroUIProvider>
          <App />
        </HeroUIProvider>
      </Provider>
    </AuthProvider>
  </StrictMode>,
);
