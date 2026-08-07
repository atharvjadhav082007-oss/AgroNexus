import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import FarmerProfile from "./pages/FarmerProfile/FarmerProfile";
import DisasterScore from "./pages/DisasterScore/DisasterScore";
import Recommendations from "./pages/Recommendations/Recommendations";
import GovernmentSchemes from "./pages/GovernmentSchemes/GovernmentSchemes";
import FinancialSolutions from "./pages/FinancialSolutions/FinancialSolutions";
import OfficerView from "./pages/OfficerView/OfficerView";
import { RiskForm } from "./features/farmer-risk/RiskForm";

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/farmer-profile" element={<PageWrapper><FarmerProfile /></PageWrapper>} />
        <Route path="/disaster-score" element={<PageWrapper><DisasterScore /></PageWrapper>} />
        <Route path="/recommendations" element={<PageWrapper><Recommendations /></PageWrapper>} />
        <Route path="/government-schemes" element={<PageWrapper><GovernmentSchemes /></PageWrapper>} />
        <Route path="/financial-solutions" element={<PageWrapper><FinancialSolutions /></PageWrapper>} />
        <Route path="/officer-view" element={<PageWrapper><OfficerView /></PageWrapper>} />
        <Route path="/test-risk" element={<PageWrapper><RiskForm /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
