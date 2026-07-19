import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Leaf, ChevronDown } from "lucide-react";

const navLinks = [
  { name: "Home", path: "#home", active: true },
  { name: "Features", path: "#features" },
  { name: "How It Works", path: "#how-it-works" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "About Us", path: "#about" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (hash: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(hash.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "backdrop-blur-xl bg-white/85 shadow-sm border-b border-slate-200" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[90px] items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-[#2E7D32] to-[#81C784] shadow-lg shadow-green-200/40">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-950 tracking-tight">KhetSeva</p>
              <p className="text-sm font-medium uppercase tracking-[0.35em] text-slate-500">AI for Smarter Farming</p>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-8">
            {navLinks.map((link) =>
              link.path.startsWith("#") ? (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => handleLinkClick(link.path)}
                  className={`inline-flex items-center gap-1 text-sm font-semibold transition ${link.active ? "text-[#2E7D32]" : "text-slate-600 hover:text-[#2E7D32]"}`}
                >
                  <span>{link.name}</span>
                  {link.dropdown && <ChevronDown className="h-3.5 w-3.5" />}
                  {link.active && <span className="block h-[2px] w-full bg-[#2E7D32] mt-1 rounded-full" />}
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 transition hover:text-[#2E7D32]"
                >
                  <span>{link.name}</span>
                </Link>
              ),
            )}
          </div>

          <div className="hidden xl:flex items-center gap-4">
            <Link
              to="/login"
              className="rounded-full border border-[#2E7D32] px-6 py-3 text-sm font-semibold text-[#2E7D32] hover:bg-green-50 transition-all duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-[#2E7D32] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-200/40 hover:bg-[#1F5F23] transition-all duration-200"
            >
              Get Started
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="xl:hidden inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-green-200 hover:text-[#2E7D32] transition"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid gap-4">
              {navLinks.map((link) =>
              link.path.startsWith("#") ? (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => {
                    handleLinkClick(link.path);
                  }}
                  className="w-full text-left text-base font-semibold text-slate-700 hover:text-[#2E7D32] transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    {link.name}
                    {link.dropdown && <ChevronDown className="h-4 w-4" />}
                  </span>
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left text-base font-semibold text-slate-700 hover:text-[#2E7D32] transition-colors"
                >
                  <span>{link.name}</span>
                </Link>
              ),
            )}
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full rounded-full border border-[#2E7D32] px-5 py-3 text-center text-sm font-semibold text-[#2E7D32] hover:bg-green-50 transition-all duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full rounded-full bg-[#2E7D32] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#1F5F23] transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
