import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LayoutDashboard, CloudSun, AlertTriangle, Leaf, ShieldCheck, Landmark, Users } from "lucide-react";

export default function DashboardPreviewSection() {
  const [activeTab, setActiveTab] = useState<"farmer" | "govt">("farmer");

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
                      <h3 className="text-lg font-bold text-gray-900">Namaste, Ramesh Ji</h3>
                      <p className="text-xs text-gray-500">Farm: Sector 4-B • District: Rohtak, Haryana</p>
                    </div>

                    {/* KPI 1: Risk Card */}
                    <div className="sm:col-span-4 bg-white border border-gray-150 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Compound Risk</span>
                        <ShieldCheck className="w-5 h-5 text-green-700 bg-green-50 p-1 rounded-full" />
                      </div>
                      <div className="mt-4">
                        <span className="text-3xl font-extrabold text-gray-900">24</span>
                        <span className="text-xs text-gray-400 font-semibold"> / 100</span>
                      </div>
                      <span className="inline-block mt-3 text-[10px] bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-md w-fit">
                        Safe (Low Risk)
                      </span>
                    </div>

                    {/* KPI 2: Crop Planner */}
                    <div className="sm:col-span-4 bg-white border border-gray-150 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Recommended Crop</span>
                        <Leaf className="w-5 h-5 text-emerald-700 bg-emerald-50 p-1 rounded-full" />
                      </div>
                      <div className="mt-4">
                        <span className="text-xl font-extrabold text-gray-900 block leading-tight">Soybean</span>
                        <span className="text-[10px] text-green-600 font-bold">96% Soil Compatibility</span>
                      </div>
                      <span className="inline-block mt-3 text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md w-fit">
                        Optimal Crop
                      </span>
                    </div>

                    {/* KPI 3: Weather */}
                    <div className="sm:col-span-4 bg-white border border-gray-150 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Weather Alert</span>
                        <CloudSun className="w-5 h-5 text-blue-600 bg-blue-50 p-1 rounded-full" />
                      </div>
                      <div className="mt-4">
                        <span className="text-lg font-extrabold text-gray-900 block leading-tight">12 mm Rainfall</span>
                        <span className="text-[10px] text-gray-500 block mt-0.5">Forecasted for Tomorrow</span>
                      </div>
                      <span className="inline-block mt-3 text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-md w-fit">
                        Imminent Rain
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
                        <div className="flex gap-2.5 text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                          <p className="leading-tight font-medium">Rain tomorrow: Ensure drainage systems in Sector 4 are clear.</p>
                        </div>
                        <div className="flex gap-2.5 text-green-800 bg-green-50 p-2.5 rounded-xl border border-green-100">
                          <ShieldCheck className="w-4 h-4 shrink-0 text-green-700 mt-0.5" />
                          <p className="leading-tight font-medium">You qualify for a Crop Insurance Premium Subsidy (₹4,500).</p>
                        </div>
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
                        <span className="text-3xl font-extrabold text-gray-900">54,382</span>
                      </div>
                      <span className="inline-block mt-3 text-[10px] text-green-600 font-bold">
                        +12% this month
                      </span>
                    </div>

                    {/* KPI 2 */}
                    <div className="sm:col-span-4 bg-white border border-gray-150 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Critical Risk Alerts</span>
                        <AlertTriangle className="w-5 h-5 text-rose-500 bg-rose-50 p-1 rounded-full" />
                      </div>
                      <div className="mt-4">
                        <span className="text-3xl font-extrabold text-rose-600 font-display">842</span>
                        <span className="text-xs text-gray-400 font-semibold"> Farmers</span>
                      </div>
                      <span className="inline-block mt-3 text-[10px] bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded-md w-fit">
                        Drought Imminent
                      </span>
                    </div>

                    {/* KPI 3 */}
                    <div className="sm:col-span-4 bg-white border border-gray-150 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Relief Funds Disbursed</span>
                        <Landmark className="w-5 h-5 text-blue-600 bg-blue-50 p-1 rounded-full" />
                      </div>
                      <div className="mt-4">
                        <span className="text-2xl font-extrabold text-gray-900 font-display">₹4.2 Crore</span>
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
