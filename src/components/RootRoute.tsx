import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../context/UserContext";
import LoginView from "../views/LoginView";
import HomeView from "../views/HomeView";

export default function RootRoute() {
  const { isAuthenticated, isLoading } = useAuth0();
  const { onboarded } = useUser();

  if (isLoading || (isAuthenticated && onboarded === null))
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#292929]">
        <span className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  if (!isAuthenticated) return <LoginView />;
  if (!onboarded) return <Navigate to="/onboarding" replace />;

  return <HomeView />;
}
