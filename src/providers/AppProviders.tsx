import type { PropsWithChildren } from "react";
import { AuthProvider } from "react-oidc-context";
import { Provider as ReduxProvider } from "react-redux";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { store } from "@store/store";

const oidcConfig = {
  authority: "http://127.0.0.1:8080/realms/my-dev-realm",
  client_id: "react-app",
  redirect_uri: "http://127.0.0.1:5173",
  response_type: "code",
  post_logout_redirect_uri: window.location.origin,
};

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AuthProvider {...oidcConfig}>
      <ReduxProvider store={store}>
        <HeroUIProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
          </ThemeProvider>
        </HeroUIProvider>
      </ReduxProvider>
    </AuthProvider>
  );
}
