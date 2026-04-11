import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LoginView from "./views/LoginView";
import OnboardingView from "./views/OnboardingView";
import HomeView from "./views/HomeView";
import ProtectedRoute from "./components/ProtectedRoute";

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
          <Route path="/" element={<LoginView />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingView />} />
            <Route path="/home" element={<HomeView />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="max-w-7xl mx-auto bg-[#292929] rounded-none lg:rounded-xl">
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
