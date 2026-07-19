import { motion } from "framer-motion";
import { UserPlus, MapPin, BrainCircuit, Lightbulb } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Register Farm",
      description: "Quick setup of your farmer profile and farm size details.",
      icon: UserPlus,
    },
    {
      step: "02",
      title: "Connect Location",
      description: "Allow browser geolocation or enter your farm's PIN code.",
      icon: MapPin,
    },
    {
      step: "03",
      title: "AI Analyses Data",
      description: "Our backend runs ML risk scoring crossed with real-time IMD weather APIs.",
      icon: BrainCircuit,
    },
    {
      step: "04",
      title: "Get Recommendations",
      description: "Receive exact suggestions on crops, risks, and eligible subsidies.",
      icon: Lightbulb,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-green-50 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            How KhetSeva Works
          </h2>
          <p className="mt-4 text-base text-gray-500 font-medium">
            A simple 4-step workflow that translates complex data points into actionable insights for your farm.
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Horizontal Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-green-100 via-green-300 to-green-100 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Circle Node */}
                  <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-white border-2 border-green-100 group-hover:border-[#2E7D32] shadow-sm group-hover:shadow-md transition-all duration-300 mb-6 bg-gradient-to-br from-white to-green-50/20">
                    
                    {/* Number badge */}
                    <span className="absolute -top-1 -right-1 w-6.5 h-6.5 rounded-full bg-[#2E7D32] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                      {step.step}
                    </span>

                    {/* Icon */}
                    <Icon className="w-9 h-9 text-gray-600 group-hover:text-[#2E7D32] transition-colors duration-300" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2E7D32] transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-[220px]">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
