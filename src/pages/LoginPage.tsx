import { Button, Card, CardBody } from "@heroui/react";
import { useAuth } from "@hooks/useAuth";
import { Navigate } from "react-router";

export const LoginPage = () => {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full" shadow="sm">
        <CardBody className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="text-default-500">
            Please sign in with your Keycloak account to continue.
          </p>
          <Button
            color="primary"
            onPress={() => auth.signinRedirect?.()}
            isDisabled={auth.isLoading}
          >
            {auth.isLoading ? "Redirecting..." : "Sign in with Keycloak"}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};
