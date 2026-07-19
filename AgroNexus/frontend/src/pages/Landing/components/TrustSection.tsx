import { motion } from "framer-motion";

const partners = [
  { name: "ICAR", color: "text-slate-900", accent: "bg-slate-100" },
  { name: "Digital India", color: "text-slate-900", accent: "bg-slate-100" },
  { name: "NASSCOM Foundation", color: "text-slate-900", accent: "bg-slate-100" },
  { name: "MeitY", color: "text-slate-900", accent: "bg-slate-100" },
  { name: "DRDO", color: "text-slate-900", accent: "bg-slate-100" },
];

export default function TrustSection() {
  return (
    <section className="py-24 bg-[#F8FCF8] overflow-hidden">
      <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-[#E8F4EB] blur-3xl" />
      <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-[#D7F0D7] blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500"
          >
            Trusted by Farmers. Backed by Innovation.
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950"
          >
            Trusted by Farmers. Backed by Innovation.
          </motion.h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="group rounded-[24px] border border-slate-200/70 bg-white/90 p-6 text-center shadow-lg shadow-slate-100/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl ${partner.accent}`}>
                <span className="text-xl font-bold text-slate-700">{partner.name.charAt(0)}</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 group-hover:text-[#2E7D32] transition-colors">
                {partner.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
