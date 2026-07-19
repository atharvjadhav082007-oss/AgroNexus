import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";

export default function FinancialSolutions() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FCF8]">
      <Navbar />
      <main className="flex-1 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white p-10 shadow-xl shadow-slate-100">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Financial Solutions</p>
          <h1 className="mt-4 text-4xl font-extrabold text-slate-950">Optimized Financial Guidance</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Explore the optimization agent output for loan, insurance, and financing recommendations.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
