import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { useAuth } from "react-oidc-context";
import { ThemeSwitcherComponent } from "./ThemeSwitcherComponent.tsx";
import { LogOut } from "lucide-react";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const NavbarComponent = () => {
  const { user, removeUser, signoutRedirect } = useAuth();

  return (
    <Navbar shouldHideOnScroll>
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive>
          <Link href="#">Tasks</Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcherComponent />
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            onPress={async () => {
              await removeUser();
              await signoutRedirect({
                id_token_hint: user?.id_token,
                post_logout_redirect_uri: window.location.origin,
              });
              sessionStorage.clear();
            }}
            color="primary"
            href="#"
            variant="flat"
            endContent={<LogOut size={16} />}
          >
            Sign Out
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
