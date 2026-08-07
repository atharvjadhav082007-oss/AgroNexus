import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, CloudRain, Leaf, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../../../assets/hero-bg.jpg";

const featureTags = [
  { label: 'Risk Prediction', icon: ShieldCheck },
  { label: 'Crop Recommendation', icon: Leaf },
  { label: 'Weather Alerts', icon: CloudRain },
  { label: 'Govt. Schemes', icon: Zap },
];

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-white">
      <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#E8F4EB] blur-3xl opacity-80 -z-10" />
      <div className="absolute right-[-120px] top-16 h-72 w-72 rounded-full bg-[#D7F0D7] blur-3xl opacity-80 -z-10" />
      <div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-[#ECF9EE] blur-3xl opacity-80 -z-10" />
      <div className="absolute inset-x-0 top-0 h-[35vh] bg-gradient-to-b from-[#F0FBF1] to-transparent -z-20" />
      <div className="absolute right-0 top-20 h-56 w-56 rounded-full bg-[#FFF4D1] blur-3xl opacity-70 -z-10" />

      <div className="min-h-[85vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 xl:grid-cols-[55%_45%]">
          <div className="relative z-10 space-y-10 py-16 lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-3 rounded-full border border-[#D8F6DB] bg-[#F0FBF1] px-4 py-2 text-sm font-semibold text-[#2E7D32] shadow-sm shadow-green-100/50"
            >
              <span className="text-lg">🌾</span>
              AI-Powered Farming Solutions
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="space-y-6 max-w-3xl"
            >
              <h1 className="text-5xl sm:text-6xl md:text-[64px] font-extrabold tracking-tight text-slate-950 leading-tight">
                Smart Decisions.
                <br />
                <span className="bg-gradient-to-r from-[#2E7D32] to-[#75B964] bg-clip-text text-transparent">
                  Stronger Harvests.
                </span>
              </h1>
              <p className="text-lg md:text-xl leading-8 text-slate-600">
                KhetSeva uses AI and real-time data to predict risks, recommend the best crops, and support farmers at every step.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-3 rounded-[20px] bg-[#2E7D32] px-8 py-4 text-base font-semibold text-white shadow-xl shadow-green-200/40 transition duration-300 hover:bg-[#25672e] hover:-translate-y-0.5"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-3 rounded-[20px] border border-[#2E7D32] bg-white px-8 py-4 text-base font-semibold text-[#2E7D32] transition duration-300 hover:bg-[#ecf7ed] hover:-translate-y-0.5"
              >
                <span>Start Free Today</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {featureTags.map((tag) => {
                const Icon = tag.icon;
                return (
                  <div key={tag.label} className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#EDF7ED] text-[#2E7D32] shadow-sm">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>{tag.label}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          <div className="relative order-last xl:order-none h-[420px] sm:h-[520px] md:h-[620px] overflow-hidden">
            <div className="pointer-events-none absolute -left-16 top-16 h-96 w-96 rounded-full bg-[#E8F5E9] opacity-70 blur-3xl" />
            <img
              src={heroImage}
              alt="Indian farmer standing in lush green agricultural field"
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 18%, black 100%)",
                maskImage: "linear-gradient(to right, transparent 0%, black 18%, black 100%)",
              }}
            />
            <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-white via-white/70 to-transparent" />

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 right-6 z-10 w-52 rounded-[28px] bg-white/90 p-4 shadow-xl shadow-slate-200/50 backdrop-blur-xl"
            >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Risk Level</p>
                    <p className="mt-2 text-lg font-bold text-green-800">Low</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ECF9EE] text-[#2E7D32] shadow-sm">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="absolute top-1/2 -right-8 w-56 rounded-[28px] border border-white/80 bg-white/95 p-4 shadow-xl shadow-slate-200/50 backdrop-blur-xl"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Rainfall Forecast</p>
                  <p className="mt-2 text-lg font-bold text-slate-950">12 mm</p>
                  <p className="mt-1 text-sm text-slate-500">Tomorrow</p>
                </div>
                <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF7FF] text-[#1D6FA6] shadow-sm">
                  <CloudRain className="h-5 w-5" />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="absolute bottom-10 left-8 w-56 rounded-[28px] border border-white/80 bg-white/95 p-4 shadow-xl shadow-slate-200/50 backdrop-blur-xl"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Best Crop Match</p>
                  <p className="mt-2 text-lg font-bold text-slate-950">Soybean</p>
                  <p className="mt-1 text-sm font-semibold text-green-700">95% Match</p>
                </div>
                <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF7EC] text-[#2E7D32] shadow-sm">
                  <Leaf className="h-5 w-5" />
                </div>
              </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
