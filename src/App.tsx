import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import OnboardingView from "./views/OnboardingView";
import ProfileView from "./views/ProfileView";
import ProtectedRoute from "./components/ProtectedRoute";
import OnboardingGuard from "./components/OnboardingGuard";
import RootRoute from "./components/RootRoute";
import { UserProvider } from "./context/UserContext";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <Routes location={location}>
          <Route path="/" element={<RootRoute />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<OnboardingGuard />}>
              <Route path="/onboarding" element={<OnboardingView />} />
            </Route>
            <Route path="/profile" element={<ProfileView />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div className="max-w-7xl mx-auto bg-[#292929] rounded-none lg:rounded-xl">
          <AnimatedRoutes />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
