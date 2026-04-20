import { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface UserContextValue {
  onboarded: boolean | null;
  setOnboarded: (value: boolean) => void;
}

const UserContext = createContext<UserContextValue>({ onboarded: null, setOnboarded: () => {} });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchUser = async () => {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOnboarded(data.onboarded);
    };
    fetchUser();
  }, [isAuthenticated]);

  return <UserContext.Provider value={{ onboarded, setOnboarded }}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
