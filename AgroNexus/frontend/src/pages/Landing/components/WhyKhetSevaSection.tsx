import { motion } from "framer-motion";
import { Check, ShieldAlert, Cpu, BarChart3 } from "lucide-react";

export default function WhyKhetSevaSection() {
  const checkmarks = [
    {
      title: "Predict disasters before they happen",
      description: "Get early flood or drought warning indicators directly for your farm location using advanced meteorological pipelines.",
    },
    {
      title: "Increase crop yield",
      description: "Unlock precision farming insights, optimal crop profiles, and fertilizing advice tailored to your exact soil conditions.",
    },
    {
      title: "Reduce financial losses",
      description: "Predict crop diseases early and hedge against unexpected climate variables using our proprietary risk multipliers.",
    },
    {
      title: "Improve decision making",
      description: "Replace agricultural guesswork with data-driven AI models that evaluate moisture, history, and current climate forecasts.",
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual AI monitor mock (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center order-last lg:order-first mt-12 lg:mt-0">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[#2E7D32]/5 rounded-[32px] transform -rotate-2 -z-10" />
            
            {/* Visual SaaS box */}
            <div className="w-full max-w-[380px] bg-white border border-green-100 rounded-[28px] p-6.5 shadow-xl relative text-left">
              {/* Box Top */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4.5 mb-5">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-[#2E7D32]" />
                  </div>
                  <span className="text-xs font-bold text-gray-800">Satellite AI Feed</span>
                </div>
                <span className="text-[9px] bg-green-100 text-[#2E7D32] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                  Live
                </span>
              </div>

              {/* Data Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50/70 border border-gray-100 rounded-xl hover:border-green-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-7.5 h-7.5 rounded-full bg-blue-50 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">NDVI Health</span>
                      <span className="block text-xs font-bold text-gray-900">0.82 (Excellent)</span>
                    </div>
                  </div>
                  <Check className="w-4 h-4 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50/70 border border-gray-100 rounded-xl hover:border-green-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-7.5 h-7.5 rounded-full bg-amber-50 flex items-center justify-center">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Disease Risk</span>
                      <span className="block text-xs font-bold text-gray-900">12% (Minimal)</span>
                    </div>
                  </div>
                  <Check className="w-4 h-4 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50/70 border border-gray-100 rounded-xl hover:border-green-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-7.5 h-7.5 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                      <Cpu className="w-4 h-4 text-[#2E7D32]" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Soil Moisture</span>
                      <span className="block text-xs font-bold text-gray-900">Optimized</span>
                    </div>
                  </div>
                  <Check className="w-4 h-4 text-green-600" />
                </div>
              </div>

              {/* Graphical overlay in visual */}
              <div className="mt-5 p-3.5 bg-gradient-to-tr from-green-50 to-green-100/30 rounded-2xl border border-green-100">
                <span className="block text-[9px] font-bold text-green-700 uppercase tracking-widest mb-1.5">AI Prediction Engine</span>
                <span className="text-sm font-extrabold text-gray-800 leading-tight block">
                  Yield Projection: +18%
                </span>
                <span className="text-[10px] text-gray-500 block mt-0.5">Based on historical & current parameters.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Text & Value Propositions (7 cols) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-widest block">
                Why Choose Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Empowering Indian Farmers with Smart Agricultural Intelligence
              </h2>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                KhetSeva bridges the gap between scientific weather research, financial safety, and direct, on-field applications.
              </p>
            </div>

            {/* Checkmarks List */}
            <div className="space-y-5">
              {checkmarks.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start space-x-3.5"
                >
                  <div className="w-5.5 h-5.5 rounded-full bg-green-50 border border-green-200/50 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Check className="w-3.5 h-3.5 text-[#2E7D32] stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 leading-tight mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
