import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginView from "./views/LoginView";
import OnboardingView from "./views/OnboardingView";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <div className="max-w-7xl mx-auto bg-[#292929] rounded-none lg:rounded-xl">
        <Routes>
          <Route path="/" element={<LoginView />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingView />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
