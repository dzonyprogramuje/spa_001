// Thin wrapper over react-oidc-context to keep a single import location.
// Easy to mock in tests by vi.mock("../hooks/useAuth").
import { useAuth as useOidcAuth } from "react-oidc-context";

export const useAuth = () => useOidcAuth();
