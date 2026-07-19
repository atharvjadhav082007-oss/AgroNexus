import { motion } from "framer-motion";
import { ShieldCheck, MapPin, CloudRain, Bell, BookOpen } from "lucide-react";

const features = [
  {
    title: "Risk Analysis",
    description: "Predict weather, financial and crop risks before they impact yield.",
    icon: ShieldCheck,
    accent: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Crop Planner",
    description: "Plan the right crops with smart suggestions based on soil and season.",
    icon: MapPin,
    accent: "bg-green-50 text-[#2E7D32]",
  },
  {
    title: "Weather Insights",
    description: "Hourly and weekly weather forecasts to time your farming activities.",
    icon: CloudRain,
    accent: "bg-sky-50 text-sky-700",
  },
  {
    title: "Smart Alerts",
    description: "Get instant notifications for pests, drought, and changing field conditions.",
    icon: Bell,
    accent: "bg-yellow-50 text-amber-700",
  },
  {
    title: "Government Schemes",
    description: "Find the best subsidies and grants available for your farm profile.",
    icon: BookOpen,
    accent: "bg-lime-50 text-lime-700",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative overflow-hidden bg-[#F8FCF8] py-24">
      <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-[#E8F4EB] blur-3xl" />
      <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-[#D7F0D7] blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950"
          >
            Everything You Need, All in One Place
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-5 text-base sm:text-lg leading-8 text-slate-600"
          >
            Powerful tools and insights to help you plan, protect, and grow better.
          </motion.p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                whileHover={{ scale: 1.03 }}
                className="group rounded-[24px] border border-white/90 bg-white shadow-xl shadow-slate-100/80 p-8 transition-all duration-300"
              >
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-3xl ${feature.accent} mb-6 shadow-sm`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-950 mb-3">{feature.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
