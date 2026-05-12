import { createContext, useContext } from "react";

interface UserContextValue {
  onboarded: boolean | null;
  setOnboarded: (value: boolean) => void;
}

export const UserContext = createContext<UserContextValue>({ onboarded: null, setOnboarded: () => {} });

export const useUser = () => useContext(UserContext);
