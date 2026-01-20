import { useAuth } from "react-oidc-context";

export const HeaderComponent = () => {
  const { user, removeUser } = useAuth();

  return (
    <header className="flex w-full justify-between items-center p-8 bg-gray-900 text-white">
      <h1>
        Welcome {user?.profile.name}👋{" "}
        <span className="text-green-300">{user?.profile.email}</span>
      </h1>
      <button
        className="text-white bg-red-600 px-12 py-2 hover:cursor-pointer hover:bg-red-700 rounded-md"
        onClick={() => removeUser()}
      >
        Logout
      </button>
    </header>
  );
};
