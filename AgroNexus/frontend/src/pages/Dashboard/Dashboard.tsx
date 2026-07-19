import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
} from "recharts";
import {
  Home,
  CloudRain,
  Leaf,
  AlertTriangle,
  BarChart3,
  ClipboardList,
  Bell,
  MessageSquare,
  Settings,
  Sparkles,
  Search,
  Globe,
  SunMedium,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Download,
  FileText,
} from "lucide-react";
import Footer from "../../components/Footer/Footer";

const sidebarItems = [
  { label: "Dashboard", icon: Home, active: true },
  { label: "Weather AI", icon: CloudRain, badge: "AI" },
  { label: "Crop Recommendation AI", icon: Leaf, badge: "AI" },
  { label: "Risk Prediction AI", icon: AlertTriangle, badge: "AI" },
  { label: "Analytics", icon: BarChart3 },
  { label: "Government Schemes", icon: ClipboardList },
  { label: "Notifications", icon: Bell },
  { label: "AI Assistant", icon: MessageSquare },
  { label: "Settings", icon: Settings },
];

const overviewCards = [
  {
    title: "Compound Risk",
    value: "24/100",
    status: "Safe",
    icon: ShieldCheck,
    accent: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Recommended Crop",
    value: "Soybean",
    subtitle: "96% Compatibility",
    icon: Leaf,
    accent: "bg-lime-50 text-lime-700",
  },
  {
    title: "Today's Weather",
    value: "28°C",
    subtitle: "Cloudy · Humidity 68%",
    icon: CloudRain,
    accent: "bg-sky-50 text-sky-700",
  },
  {
    title: "Rain Forecast",
    value: "12 mm",
    subtitle: "Tomorrow",
    icon: SunMedium,
    accent: "bg-blue-50 text-blue-700",
  },
  {
    title: "Government Benefits",
    value: "Eligible",
    subtitle: "₹24,500 Subsidy",
    icon: ClipboardList,
    accent: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "AI Confidence",
    value: "95%",
    subtitle: "Prediction Accuracy",
    icon: Sparkles,
    accent: "bg-emerald-50 text-emerald-700",
  },
];

const riskItems = [
  { label: "Financial Risk", value: 18, color: "bg-emerald-500" },
  { label: "Climate Risk", value: 22, color: "bg-lime-500" },
  { label: "Disease Risk", value: 12, color: "bg-cyan-500" },
  { label: "Flood Risk", value: 8, color: "bg-blue-500" },
  { label: "Pest Risk", value: 9, color: "bg-amber-500" },
];

const weatherData = [
  { day: "Mon", rainfall: 5, temp: 29, humidity: 68, wind: 11 },
  { day: "Tue", rainfall: 8, temp: 30, humidity: 65, wind: 10 },
  { day: "Wed", rainfall: 32, temp: 26, humidity: 72, wind: 13 },
  { day: "Thu", rainfall: 12, temp: 27, humidity: 70, wind: 9 },
  { day: "Fri", rainfall: 6, temp: 28, humidity: 69, wind: 12 },
  { day: "Sat", rainfall: 2, temp: 31, humidity: 63, wind: 14 },
  { day: "Sun", rainfall: 15, temp: 26, humidity: 74, wind: 8 },
];

const activities = [
  { time: "08:12", title: "Weather updated", description: "Rain probability increased to 45%." },
  { time: "09:05", title: "AI generated recommendation", description: "Soybean spray schedule updated." },
  { time: "10:20", title: "Subsidy application submitted", description: "₹24,500 fertilizer support applied." },
  { time: "12:00", title: "Rain alert received", description: "Heavy rainfall expected tomorrow." },
  { time: "14:30", title: "Soil report uploaded", description: "pH and nutrient summary received." },
];

const notifications = [
  { text: "Heavy rainfall expected tomorrow.", unread: true },
  { text: "Government subsidy approved.", unread: true },
  { text: "Soil report available.", unread: false },
  { text: "Market price increased.", unread: false },
  { text: "Pest alert in your district.", unread: true },
];

const quickActions = [
  "Book Soil Test",
  "View Market Prices",
  "Talk to AI Assistant",
  "Apply for Subsidy",
  "Download Reports",
  "Weather Forecast",
];

const schemes = [
  { name: "Pradhan Mantri Fasal Bima Yojana", eligibility: "Eligible", lastDate: "30 Jun 2025" },
  { name: "Kisan Credit Card", eligibility: "Eligible", lastDate: "Open" },
  { name: "PM-KISAN", eligibility: "Eligible", lastDate: "31 Dec 2025" },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F3F7F0] text-slate-900">
      <div className="flex">
        <aside className={`sticky top-0 left-0 z-30 h-screen overflow-hidden border-r border-slate-200/70 bg-white transition-all duration-300 ${sidebarOpen ? "w-80" : "w-20"}`}>
          <div className="flex h-full flex-col px-4 py-6">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-[#2E7D32] to-[#81C784] text-white shadow-lg shadow-green-200/40">
                <span className="text-xl font-black">K</span>
              </div>
              {sidebarOpen && (
                <div>
                  <p className="text-lg font-semibold text-slate-950">KhetSeva</p>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Farmer OS</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:bg-slate-50"
              >
                {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </div>

            <nav className="mt-10 flex-1 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const active = item.active;
                return (
                  <button
                    key={item.label}
                    type="button"
                    className={`group flex w-full items-center gap-3 rounded-3xl px-3 py-3 text-left transition ${
                      active ? "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 shadow-sm" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700"}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    {sidebarOpen && (
                      <div className="flex flex-1 items-center justify-between">
                        <span className={`text-sm font-semibold ${active ? "text-emerald-700" : "text-slate-700"}`}>{item.label}</span>
                        {item.badge && (
                          <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-[#F3F7F0]/95 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
              <div className="space-y-1">
                <div className="text-sm text-slate-500">Dashboard / Farmer Portal</div>
                <h1 className="text-2xl font-semibold text-slate-950">Farmer Dashboard</h1>
              </div>

              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between xl:gap-4 w-full">
                <div className="relative w-full xl:max-w-xl">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Search crops, weather, schemes..."
                    className="w-full rounded-full border border-slate-200 bg-white px-12 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3">
                  <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm transition hover:bg-slate-100">
                    <Bell className="h-5 w-5" />
                  </button>
                  <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm transition hover:bg-slate-100">
                    <MessageSquare className="h-5 w-5" />
                  </button>
                  <button className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100">
                    <Globe className="h-4 w-4" />
                    EN
                  </button>
                  <button className="inline-flex h-11 items-center gap-3 rounded-2xl bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                      <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80" alt="Farmer" className="h-full w-full object-cover" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-semibold text-slate-950">Ramesh Ji</p>
                      <p className="text-xs text-slate-500">Farmer</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="rounded-[28px] border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-100">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">Good Morning 👋</p>
                    <h2 className="mt-3 text-3xl font-semibold text-slate-950">Namaste, Ramesh Ji</h2>
                    <p className="mt-2 text-sm text-slate-500">Welcome back to your farm intelligence hub for Rampur village.</p>
                  </div>
                  <div className="rounded-[24px] bg-emerald-50 px-5 py-4 text-right text-slate-900 shadow-sm">
                    <p className="text-sm text-slate-500">Current Date</p>
                    <p className="mt-2 text-2xl font-bold">{time.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
                    <p className="mt-1 text-sm text-slate-600">{time.toLocaleTimeString("en-IN")}</p>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {[
                    { label: "Village", value: "Rampur" },
                    { label: "District", value: "Rohtak" },
                    { label: "State", value: "Haryana" },
                    { label: "Farm Area", value: "4 Acres" },
                    { label: "Current Crop", value: "Soybean" },
                    { label: "Season", value: "Kharif" },
                    { label: "Member Since", value: "2024" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[20px] border border-slate-200/80 bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{item.label}</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }} className="space-y-6">
                <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-100">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">Farmer Profile</p>
                      <h2 className="mt-3 text-2xl font-semibold text-slate-950">Ramesh Ji</h2>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
                      <FileText className="h-4 w-4" />
                      Edit Profile
                    </button>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "Village", value: "Rampur" },
                      { label: "District", value: "Rohtak" },
                      { label: "Phone", value: "+91 98765 43210" },
                      { label: "Farm Size", value: "4 Acres" },
                      { label: "Crop", value: "Soybean" },
                      { label: "Farmer ID", value: "KS-2024-0412" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-[20px] border border-slate-200/70 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{item.label}</p>
                        <p className="mt-2 text-lg font-semibold text-slate-950">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-100">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">Notifications</p>
                      <h2 className="mt-3 text-2xl font-semibold text-slate-950">Latest Alerts</h2>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">3 unread</span>
                  </div>
                  <div className="mt-6 space-y-4">
                    {notifications.map((item) => (
                      <div key={item.text} className="flex items-center gap-3 rounded-[22px] border border-slate-200/70 bg-slate-50 px-4 py-3">
                        <span className={`h-3 w-3 rounded-full ${item.unread ? "bg-emerald-500" : "bg-slate-300"}`} />
                        <p className="text-sm text-slate-700">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {overviewCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <motion.div
                        key={card.title}
                        whileHover={{ y: -6 }}
                        className="rounded-[24px] border border-slate-200/70 bg-white p-6 shadow-xl shadow-slate-100 transition"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">{card.title}</p>
                            <p className="mt-3 text-3xl font-semibold text-slate-950">{card.value}</p>
                          </div>
                          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl ${card.accent}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                        </div>
                        {card.subtitle && <p className="mt-4 text-sm text-slate-600">{card.subtitle}</p>}
                        {card.status && <p className="mt-4 text-sm font-semibold text-emerald-700">Status: {card.status}</p>}
                      </motion.div>
                    );
                  })}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-xl shadow-slate-100"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">Weather Forecast</p>
                        <h2 className="mt-3 text-2xl font-semibold text-slate-950">7-day rainfall and temperature</h2>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                        <CloudRain className="h-4 w-4" /> 12 mm tomorrow
                      </div>
                    </div>
                    <div className="mt-6 grid gap-6 xl:grid-cols-3">
                      <div className="rounded-[24px] bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Today&apos;s Summary</p>
                        <p className="mt-3 text-xl font-semibold text-slate-950">Light clouds, warm</p>
                      </div>
                      <div className="rounded-[24px] bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">UV Index</p>
                        <p className="mt-3 text-xl font-semibold text-slate-950">Moderate</p>
                      </div>
                      <div className="rounded-[24px] bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Sunrise</p>
                        <p className="mt-3 text-xl font-semibold text-slate-950">05:42 AM</p>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                      <div className="rounded-[24px] bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Sunset</p>
                        <p className="mt-3 text-xl font-semibold text-slate-950">06:55 PM</p>
                      </div>
                      <div className="rounded-[24px] bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Visibility</p>
                        <p className="mt-3 text-xl font-semibold text-slate-950">10 km</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.05 }}
                    className="rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-xl shadow-slate-100"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">Crop Recommendation AI</p>
                        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Best crop & yield estimate</h2>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">AI</span>
                    </div>
                    <div className="mt-6 space-y-4">
                      {[
                        { label: "Best Crop", value: "Soybean" },
                        { label: "Confidence", value: "95%" },
                        { label: "Expected Yield", value: "4.8 Tons" },
                        { label: "Market Demand", value: "High" },
                        { label: "Profit Estimate", value: "₹62,000" },
                        { label: "Soil Compatibility", value: "Excellent" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between rounded-[20px] border border-slate-200/70 bg-slate-50 px-4 py-4">
                          <p className="text-sm text-slate-500">{item.label}</p>
                          <p className="text-base font-semibold text-slate-950">{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <button className="rounded-full bg-[#2E7D32] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/40 transition hover:bg-[#25672e]">
                        View Full Report
                      </button>
                      <button className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100">
                        <Download className="mr-2 inline-block h-4 w-4" /> Download PDF
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.08 }}
                  className="rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-xl shadow-slate-100"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">Risk Prediction AI</p>
                      <h2 className="mt-3 text-2xl font-semibold text-slate-950">Risk meter</h2>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">Low</span>
                  </div>
                  <div className="mt-6 rounded-[24px] bg-slate-50 p-6">
                    <p className="text-sm text-slate-500">Overall risk</p>
                    <div className="mt-3 flex items-end gap-3">
                      <div className="flex-1">
                        <div className="h-3 rounded-full bg-slate-200">
                          <div className="h-3 rounded-full bg-emerald-500" style={{ width: "24%" }} />
                        </div>
                        <p className="mt-3 text-sm font-semibold text-slate-950">Low</p>
                      </div>
                      <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 shadow-sm">
                        24/100
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-4">
                    {riskItems.map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                          <span>{item.label}</span>
                          <span>{item.value}%</span>
                        </div>
                        <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
                          <div className={`${item.color} h-3 rounded-full`} style={{ width: `${item.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-[24px] bg-slate-50 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">AI Suggestions</p>
                    <ul className="mt-4 space-y-3 text-sm text-slate-700">
                      <li>• Irrigate tomorrow morning</li>
                      <li>• Apply nitrogen fertilizer next week</li>
                      <li>• Rain expected within 24 hours</li>
                      <li>• Pest risk currently low</li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.12 }} className="rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-xl shadow-slate-100">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">Recent Activities</p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-950">Activity timeline</h2>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">Live</span>
                </div>
                <div className="mt-6 space-y-4">
                  {activities.map((item) => (
                    <div key={`${item.time}-${item.title}`} className="grid gap-2 rounded-[24px] border border-slate-200/70 bg-slate-50 p-4 sm:grid-cols-[80px_1fr]">
                      <div>
                        <p className="text-sm font-semibold text-emerald-700">{item.time}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-950">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.14 }} className="space-y-6">
                <div className="rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-xl shadow-slate-100">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">Quick Actions</p>
                      <h2 className="mt-3 text-2xl font-semibold text-slate-950">Take action fast</h2>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {quickActions.map((action) => (
                      <button key={action} className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-emerald-50">
                        {action}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-xl shadow-slate-100">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">Government Schemes</p>
                      <h2 className="mt-3 text-2xl font-semibold text-slate-950">Active opportunities</h2>
                    </div>
                  </div>
                  <div className="mt-6 space-y-4">
                    {schemes.map((scheme) => (
                      <div key={scheme.name} className="rounded-[24px] border border-slate-200/70 bg-slate-50 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-950">{scheme.name}</p>
                            <p className="mt-2 text-sm text-slate-600">Eligibility: {scheme.eligibility}</p>
                          </div>
                          <div className="text-right text-sm text-slate-500">{scheme.lastDate}</div>
                        </div>
                        <button className="mt-4 rounded-full bg-[#2E7D32] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#25672e]">Apply</button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
