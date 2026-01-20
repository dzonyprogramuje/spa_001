import { useAuth } from "react-oidc-context";

export const HeaderComponent = () => {
  const { user } = useAuth();

  return (
    <header className="flex w-full justify-between items-center p-8 bg-gray-900 text-white">
      <h1>
        Welcome {user?.profile.name}👋{" "}
        <span className="text-green-300">{user?.profile.email}</span>
      </h1>
      <button className="bg-red-600 px-12 py-2 rounded-xs">Logout</button>
    </header>
  );
};
