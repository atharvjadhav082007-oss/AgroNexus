import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/farmer-profile" element={<FarmerProfile />} />
        <Route path="/disaster-score" element={<DisasterScore />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/government-schemes" element={<GovernmentSchemes />} />
        <Route path="/financial-solutions" element={<FinancialSolutions />} />
        <Route path="/officer-view" element={<OfficerView />} />
      </Routes>
    </Router>
  );
}

export default App;
