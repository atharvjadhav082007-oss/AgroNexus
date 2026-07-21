import { Users, Sprout, TrendingUp, ShieldCheck } from "lucide-react";

export default function StatsSection() {
  const stats = [
    {
      value: "50K+",
      label: "Farmers Empowered",
      icon: Users,
    },
    {
      value: "100K+",
      label: "Acres Monitored",
      icon: Sprout,
    },
    {
      value: "25%",
      label: "Higher Yield",
      icon: TrendingUp,
    },
    {
      value: "90%",
      label: "Risk Accuracy",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="bg-[#2E7D32] text-white py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_35%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto relative px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="rounded-[28px] border border-white/10 bg-white/10 p-8 shadow-2xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/15 mb-6 text-white shadow-inner">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-4xl font-extrabold tracking-tight leading-none">{stat.value}</p>
                <p className="mt-3 text-sm font-medium text-slate-100/90">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
