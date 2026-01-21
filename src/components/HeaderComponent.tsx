import { useAuth } from "react-oidc-context";

export const HeaderComponent = () => {
  const { user, removeUser, signoutRedirect } = useAuth();

  return (
    <header className="flex w-full justify-between items-center p-8 bg-gray-900 text-white">
      <div>
        <h1 className="font-bold text-2xl">
          Welcome, {user?.profile.name}
          <span className="text-3xl"> 👋 </span>
        </h1>
        <span className="text-green-300">{user?.profile.email}</span>
      </div>
      <button
        className="text-white bg-red-600 px-12 py-2 hover:cursor-pointer hover:bg-red-700 rounded-md"
        onClick={async () => {
          await removeUser();
          await signoutRedirect({
            id_token_hint: user?.id_token,
            post_logout_redirect_uri: window.location.origin,
          });
          sessionStorage.clear();
        }}
      >
        Logout
      </button>
    </header>
  );
};
