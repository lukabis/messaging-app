import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function OnboardingGuard() {
  const { onboarded } = useUser();
  if (onboarded === null) return null;
  if (onboarded === true) return <Navigate to="/" replace />;
  return <Outlet />;
}
