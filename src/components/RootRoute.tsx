import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginView from "../views/LoginView";
import HomeView from "../views/HomeView";

export default function RootRoute() {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const check = async () => {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOnboarded(data.onboarded);
    };
    check();
  }, [isAuthenticated]);

  if (isLoading || (isAuthenticated && onboarded === null)) return null;
  if (!isAuthenticated) return <LoginView />;
  if (!onboarded) return <Navigate to="/onboarding" replace />;
  
  return <HomeView />;
}
