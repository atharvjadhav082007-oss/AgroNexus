import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LayoutDashboard, CloudSun, AlertTriangle, Leaf, ShieldCheck, Landmark, Users } from "lucide-react";

import { API_URL } from "../../../config";

export default function DashboardPreviewSection() {
  const [activeTab, setActiveTab] = useState<"farmer" | "govt">("farmer");
  const [stats, setStats] = useState({ total_farmers: 54382, critical_alerts: 842, relief_funds_disbursed: 42000000 });
  const [scenarioIndex, setScenarioIndex] = useState(0);

  const [scenarios, setScenarios] = useState<any[]>([]);
  const [optimizations, setOptimizations] = useState<any[]>([]);

  const mockScenarios = [
    {
      name: "Ramesh Ji",
      location: "Farm: Sector 4-B • District: Rohtak, Haryana",
      riskScore: 24,
      riskLabel: "Safe (Low Risk)",
      riskColor: "green",
      crop: "Soybean",
      cropCompat: "96%",
      cropColor: "emerald",
      weather: "12 mm Rainfall",
      weatherDesc: "Forecasted for Tomorrow",
      weatherAlert: "Imminent Rain",
      weatherColor: "blue",
      insights: [
        { text: "Rain tomorrow: Ensure drainage systems in Sector 4 are clear.", color: "amber", icon: "AlertTriangle" },
        { text: "You qualify for a Crop Insurance Premium Subsidy (₹4,500).", color: "green", icon: "ShieldCheck" }
      ]
    },
    {
      name: "Hargopal Singh",
      location: "Farm: Field 12 • District: Bhatinda, Punjab",
      riskScore: 88,
      riskLabel: "Critical Risk",
      riskColor: "rose",
      crop: "Wheat",
      cropCompat: "62%",
      cropColor: "amber",
      weather: "0 mm Rainfall",
      weatherDesc: "Forecasted for next 14 days",
      weatherAlert: "Severe Drought",
      weatherColor: "rose",
      insights: [
        { text: "Critical Drought: Apply for emergency water allocation.", color: "rose", icon: "AlertTriangle" },
        { text: "Seed Subsidy available for drought-resistant crops.", color: "green", icon: "ShieldCheck" }
      ]
    },
    {
      name: "Ananth Gowda",
      location: "Farm: Plot C • District: Mandya, Karnataka",
      riskScore: 54,
      riskLabel: "Watch",
      riskColor: "amber",
      crop: "Sugarcane",
      cropCompat: "84%",
      cropColor: "emerald",
      weather: "85 mm Rainfall",
      weatherDesc: "Heavy rain over 3 days",
      weatherAlert: "Flood Warning",
      weatherColor: "blue",
      insights: [
        { text: "Flood risk elevated: Postpone pesticide application.", color: "amber", icon: "AlertTriangle" }
      ]
    }
  ];

  useEffect(() => {
    // Fetch live stats
    fetch(`${API_URL}/stats/landing`)
      .then(res => res.json())
      .then(data => {
        if (data.total_farmers !== undefined) {
          setStats({
            total_farmers: data.total_farmers,
            critical_alerts: data.critical_alerts,
            relief_funds_disbursed: data.relief_funds_disbursed,
          });
          
          if (data.scenarios && data.scenarios.length > 0) {
            setScenarios(data.scenarios);
          } else {
            setScenarios(mockScenarios);
          }

          if (data.optimizations && data.optimizations.length > 0) {
            setOptimizations(data.optimizations);
          }
        }
      })
      .catch(err => {
        console.error("Failed to fetch stats", err);
        setScenarios(mockScenarios);
      });

    // Rotate scenarios
    const interval = setInterval(() => {
      setScenarioIndex((prev) => (prev + 1) % scenarios.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const displayScenarios = scenarios.length > 0 ? scenarios : mockScenarios;
  const currentScenario = displayScenarios[scenarioIndex % displayScenarios.length];

  const chartData = [
    { name: "Mon", rainfall: 5 },
    { name: "Tue", rainfall: 8 },
    { name: "Wed", rainfall: 32 },
    { name: "Thu", rainfall: 12 },
    { name: "Fri", rainfall: 6 },
    { name: "Sat", rainfall: 2 },
    { name: "Sun", rainfall: 15 },
  ];

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-green-100/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-12 flex flex-col items-center justify-center gap-3">
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-[#2E7D32] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-200/40 transition duration-200 hover:bg-[#25672e]"
            >
              View Dashboard
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:bg-gray-50"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Dashboard Mockup Frame */}
        <motion.div
          layout
          className="bg-white border border-gray-200/80 rounded-[24px] shadow-2xl overflow-hidden max-w-5xl mx-auto"
        >
          {/* Mockup Header Toolbar */}
          <div className="bg-gray-950 px-6 py-3.5 flex items-center justify-between border-b border-gray-900">
            <div className="flex space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <div className="bg-gray-900/60 px-4 py-1.5 rounded-lg border border-gray-800 text-[11px] text-gray-400 font-mono tracking-tight select-none">
              app.khetseva.gov.in/portal/{activeTab === "farmer" ? "farmer/dashboard" : "admin/analytics"}
            </div>
            <div className="w-12" /> {/* Spacer */}
          </div>

          {/* Mockup Interior Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[550px] bg-gray-50/50">
            
            {/* Sidebar Mockup */}
            <div className="md:col-span-3 bg-white border-r border-gray-150 p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-[#2E7D32]">
                  <LayoutDashboard className="w-5 h-5 shrink-0" />
                  <span className="font-extrabold text-sm tracking-wide">AgroNexus</span>
                </div>
                <div className="space-y-1.5 pt-4 text-left">
                  <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider pl-3 mb-2">Navigation</span>
                  <div className="flex items-center space-x-3 bg-green-50 text-[#2E7D32] px-3.5 py-2.5 rounded-xl font-semibold text-xs cursor-pointer">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-500 hover:text-gray-900 px-3.5 py-2.5 rounded-xl font-semibold text-xs cursor-pointer hover:bg-gray-50 transition-colors">
                    <CloudSun className="w-4 h-4" />
                    <span>Weather Report</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-500 hover:text-gray-900 px-3.5 py-2.5 rounded-xl font-semibold text-xs cursor-pointer hover:bg-gray-50 transition-colors">
                    <Leaf className="w-4 h-4" />
                    <span>Crop Insights</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-500 hover:text-gray-900 px-3.5 py-2.5 rounded-xl font-semibold text-xs cursor-pointer hover:bg-gray-50 transition-colors">
                    <Landmark className="w-4 h-4" />
                    <span>Subsidies</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400 pl-3">
                Version 1.0.0 (Stable)
              </div>
            </div>

            {/* Dashboard Content Panel */}
            <div className="md:col-span-9 p-6 sm:p-8 space-y-6 text-left overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === "farmer" ? (
                  <motion.div
                    key="farmer-preview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-6"
                  >
                    {/* Welcome Header */}
                    <div className="sm:col-span-12">
                      <h3 className="text-lg font-bold text-gray-900">Namaste, {currentScenario.name.split(" ")[0]} Ji</h3>
                      <p className="text-xs text-gray-500">{currentScenario.location}</p>
                    </div>

                    {/* KPI 1: Risk Card */}
                    <div className="sm:col-span-4 bg-white border border-gray-150 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Compound Risk</span>
                        <ShieldCheck className={`w-5 h-5 text-${currentScenario.riskColor}-700 bg-${currentScenario.riskColor}-50 p-1 rounded-full`} />
                      </div>
                      <div className="mt-4">
                        <span className="text-3xl font-extrabold text-gray-900">{currentScenario.riskScore}</span>
                        <span className="text-xs text-gray-400 font-semibold"> / 100</span>
                      </div>
                      <span className={`inline-block mt-3 text-[10px] bg-${currentScenario.riskColor}-50 text-${currentScenario.riskColor}-700 font-bold px-2 py-0.5 rounded-md w-fit`}>
                        {currentScenario.riskLabel}
                      </span>
                    </div>

                    {/* KPI 2: Crop Planner */}
                    <div className="sm:col-span-4 bg-white border border-gray-150 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Recommended Crop</span>
                        <Leaf className={`w-5 h-5 text-${currentScenario.cropColor}-700 bg-${currentScenario.cropColor}-50 p-1 rounded-full`} />
                      </div>
                      <div className="mt-4">
                        <span className="text-xl font-extrabold text-gray-900 block leading-tight">{currentScenario.crop}</span>
                        <span className={`text-[10px] text-${currentScenario.cropColor}-600 font-bold`}>{currentScenario.cropCompat} Soil Compatibility</span>
                      </div>
                      <span className={`inline-block mt-3 text-[10px] bg-${currentScenario.cropColor}-50 text-${currentScenario.cropColor}-700 font-bold px-2 py-0.5 rounded-md w-fit`}>
                        Optimal Crop
                      </span>
                    </div>

                    {/* KPI 3: Weather */}
                    <div className="sm:col-span-4 bg-white border border-gray-150 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Weather Alert</span>
                        <CloudSun className={`w-5 h-5 text-${currentScenario.weatherColor}-600 bg-${currentScenario.weatherColor}-50 p-1 rounded-full`} />
                      </div>
                      <div className="mt-4">
                        <span className="text-lg font-extrabold text-gray-900 block leading-tight">{currentScenario.weather}</span>
                        <span className="text-[10px] text-gray-500 block mt-0.5">{currentScenario.weatherDesc}</span>
                      </div>
                      <span className={`inline-block mt-3 text-[10px] bg-${currentScenario.weatherColor}-50 text-${currentScenario.weatherColor}-600 font-bold px-2 py-0.5 rounded-md w-fit`}>
                        {currentScenario.weatherAlert}
                      </span>
                    </div>

                    {/* Chart widget (8 cols) */}
                    <div className="sm:col-span-8 bg-white border border-gray-150 p-5 rounded-2xl shadow-sm">
                      <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-4">7-Day Rainfall Forecast (mm)</span>
                      <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRainfall" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                            <YAxis stroke="#94a3b8" fontSize={9} />
                            <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8, borderColor: "#e2e8f0" }} />
                            <Area type="monotone" dataKey="rainfall" stroke="#2E7D32" strokeWidth={2} fillOpacity={1} fill="url(#colorRainfall)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Alerts and schemes panel (4 cols) */}
                    <div className="sm:col-span-4 bg-white border border-gray-150 p-5 rounded-2xl shadow-sm space-y-4">
                      <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">AI Advisor Insights</span>
                      <div className="space-y-3 text-xs">
                        {currentScenario.insights.map((insight: any, idx: number) => (
                          <div key={idx} className={`flex gap-2.5 text-${insight.color}-800 bg-${insight.color}-50 p-2.5 rounded-xl border border-${insight.color}-100`}>
                            {insight.icon === "AlertTriangle" ? (
                              <AlertTriangle className={`w-4 h-4 shrink-0 text-${insight.color}-600 mt-0.5`} />
                            ) : (
                              <ShieldCheck className={`w-4 h-4 shrink-0 text-${insight.color}-700 mt-0.5`} />
                            )}
                            <p className="leading-tight font-medium">{insight.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="govt-preview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-6"
                  >
                    {/* Welcome Header */}
                    <div className="sm:col-span-12">
                      <h3 className="text-lg font-bold text-gray-900">Ministry of Agriculture Dashboard</h3>
                      <p className="text-xs text-gray-500">Administrative Level: National Overview</p>
                    </div>

                    {/* KPI 1 */}
                    <div className="sm:col-span-4 bg-white border border-gray-150 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Registered Farmers</span>
                        <Users className="w-5 h-5 text-[#2E7D32] bg-green-50 p-1 rounded-full" />
                      </div>
                      <div className="mt-4">
                        <span className="text-3xl font-extrabold text-gray-900">{stats.total_farmers.toLocaleString()}</span>
                      </div>
                      <span className="inline-block mt-3 text-[10px] text-green-600 font-bold">
                        Live Data
                      </span>
                    </div>

                    {/* KPI 2 */}
                    <div className="sm:col-span-4 bg-white border border-gray-150 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Critical Risk Alerts</span>
                        <AlertTriangle className="w-5 h-5 text-rose-500 bg-rose-50 p-1 rounded-full" />
                      </div>
                      <div className="mt-4">
                        <span className="text-3xl font-extrabold text-rose-600 font-display">{stats.critical_alerts.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 font-semibold"> Farmers</span>
                      </div>
                      <span className="inline-block mt-3 text-[10px] bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded-md w-fit">
                        Live Tracking
                      </span>
                    </div>

                    {/* KPI 3 */}
                    <div className="sm:col-span-4 bg-white border border-gray-150 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Relief Funds Needed</span>
                        <Landmark className="w-5 h-5 text-blue-600 bg-blue-50 p-1 rounded-full" />
                      </div>
                      <div className="mt-4">
                        <span className="text-2xl font-extrabold text-gray-900 font-display">₹{(stats.relief_funds_disbursed / 100000).toFixed(1)} Lakh</span>
                      </div>
                      <span className="inline-block mt-3 text-[10px] text-blue-600 font-bold">
                        Optimized allocation
                      </span>
                    </div>

                    {/* Relief Allocation Optimizer Panel */}
                    <div className="sm:col-span-12 bg-white border border-gray-150 p-5.5 rounded-2xl shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                          <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Resource Allocation Optimizer</span>
                          <span className="block text-xs text-gray-400 mt-1">CP-SAT solver active: Optimized for ₹1 Crore Relief Budget</span>
                        </div>
                        <button className="bg-[#2E7D32] hover:bg-[#1F5F23] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all duration-200">
                          Recalculate Allocation
                        </button>
                      </div>

                      {/* Mock list of optimizations */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="border-b border-gray-150 text-gray-400 font-bold">
                              <th className="py-2.5">Farmer Name</th>
                              <th className="py-2.5">Region</th>
                              <th className="py-2.5 text-center">Risk Score</th>
                              <th className="py-2.5">Recommended Intervention</th>
                              <th className="py-2.5 text-right">Fund Allocation</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                            {optimizations.length > 0 ? (
                              optimizations.map((opt: any, idx: number) => (
                                <tr key={idx}>
                                  <td className="py-3">{opt.farmer_name}</td>
                                  <td>{opt.region}</td>
                                  <td className="text-center"><span className={`px-2 py-0.5 bg-${opt.bg_class} text-${opt.text_class} rounded font-bold`}>{opt.risk_score_str}</span></td>
                                  <td>{opt.intervention}</td>
                                  <td className="text-right font-bold">{opt.allocation}</td>
                                </tr>
                              ))
                            ) : (
                              <>
                                <tr>
                                  <td className="py-3">Hargopal Singh</td>
                                  <td>Punjab, Bhatinda</td>
                                  <td className="text-center"><span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded font-bold">88/100</span></td>
                                  <td>Seed Subsidy & Water Kit</td>
                                  <td className="text-right font-bold">₹15,000</td>
                                </tr>
                                <tr>
                                  <td className="py-3">Ramesh Yadav</td>
                                  <td>Haryana, Rohtak</td>
                                  <td className="text-center"><span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded font-bold">64/100</span></td>
                                  <td>Debt Moratorium Relief</td>
                                  <td className="text-right font-bold">₹22,000</td>
                                </tr>
                                <tr>
                                  <td className="py-3">Ananth Gowda</td>
                                  <td>Karnataka, Mandya</td>
                                  <td className="text-center"><span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded font-bold">92/100</span></td>
                                  <td>Emergency Water Intervene</td>
                                  <td className="text-right font-bold">₹25,000</td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
