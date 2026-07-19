import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

export default function CTASection() {
  return (
    <section id="contact" className="py-20 bg-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-green-50 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-tr from-[#2E7D32] to-[#1F5F23] rounded-[32px] py-16 px-6 sm:px-12 lg:px-20 text-center overflow-hidden shadow-2xl">
          
          {/* Background overlay leaf shapes */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="absolute top-8 left-10 w-24 h-24 text-white transform -rotate-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 8C8 10 9 20 9 20s9-10 8-12z" />
            </svg>
            <svg className="absolute bottom-8 right-10 w-32 h-32 text-white transform rotate-45" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 8C8 10 9 20 9 20s9-10 8-12z" />
            </svg>
          </div>

          <div className="relative max-w-3xl mx-auto space-y-8">
            <span className="text-xs font-bold text-green-200 uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full inline-block">
              Start Protecting Your Crop Today
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Make Farming Smarter?
            </h2>

            <p className="text-sm sm:text-base text-green-100 max-w-xl mx-auto leading-relaxed font-medium">
              Join thousands of Indian farmers using AI risk models, real-time alerts, and automated crop analytics to secure high yields.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-green-50 text-[#2E7D32] px-8 py-4 rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>Start Free Today</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 border border-white/30 hover:border-white/50 bg-white/10 hover:bg-white/15 text-white px-8 py-4 rounded-full font-bold transition-all duration-200 hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Book Demo</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
