import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Leaf, LogOut, User, LayoutDashboard, CloudRain, ShieldCheck, Wallet, Sparkles, Globe } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(Boolean(token));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem('khetseva_dashboard');
    sessionStorage.removeItem('khetseva_recs');
    setIsLoggedIn(false);
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const changeLanguage = (langCode: string) => {
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    } else {
      alert("Language engine is still loading, please try again in a moment.");
    }
    setLangDropdownOpen(false);
  };

  const handleHashClick = (hash: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/" + hash);
    } else {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };



  // Nav links for logged-in farmers
  const appNavLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Disaster Score", path: "/disaster-score", icon: CloudRain },
    { name: "Govt Schemes", path: "/government-schemes", icon: ShieldCheck },
    { name: "Financials", path: "/financial-solutions", icon: Wallet },
    { name: "Recommendations", path: "/recommendations", icon: Sparkles },
  ];

  // Nav links for landing page (logged out)
  const landingNavLinks = [
    { name: "Home", path: "#home" },
    { name: "Features", path: "#features" },
    { name: "How It Works", path: "#how-it-works" },
    { name: "About Us", path: "#about" },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "backdrop-blur-xl bg-white/90 shadow-md border-b border-slate-200" : "bg-white/70 backdrop-blur-md border-b border-slate-100"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[76px] items-center justify-between gap-4">
          {/* Logo */}
          <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2E7D32] to-[#81C784] shadow-md shadow-green-200/50 group-hover:scale-105 transition-transform">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">KhetSeva</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-green-700 mt-1">AI for Smarter Farming</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {isLoggedIn ? (
              appNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-green-100/80 text-[#2E7D32]"
                        : "text-slate-600 hover:text-[#2E7D32] hover:bg-green-50/60"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-[#2E7D32]" : "text-slate-400"}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })
            ) : (
              landingNavLinks.map((link) => (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => handleHashClick(link.path)}
                  className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-[#2E7D32] transition"
                >
                  {link.name}
                </button>
              ))
            )}
          </div>

          <div className="relative ml-auto mr-4 lg:ml-0 lg:mr-0">
            <button 
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 rounded-full border border-[#2E7D32] bg-[#F0FBF1] px-4 py-2 text-sm font-bold text-[#2E7D32] shadow-sm hover:bg-[#D7F0D7] transition"
            >
              <Globe className="h-4 w-4" />
              <span>Language</span>
            </button>
            
            {langDropdownOpen && (
              <div className="notranslate absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden z-50">
                <div className="py-1 max-h-[300px] overflow-y-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#F0FBF1] hover:text-[#2E7D32] transition"
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  to="/farmer-profile"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                >
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full border border-[#2E7D32] px-5 py-2.5 text-sm font-semibold text-[#2E7D32] hover:bg-green-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-[#2E7D32] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-200/40 hover:bg-[#1F5F23] transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-green-300 hover:text-[#2E7D32] transition"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-xl border-t border-slate-200 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 py-5 space-y-2">
            {isLoggedIn ? (
              <>
                {appNavLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                        isActive ? "bg-green-100/80 text-[#2E7D32]" : "text-slate-700 hover:bg-green-50"
                      }`}
                    >
                      <Icon className="h-4 w-4 text-[#2E7D32]" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <Link
                    to="/farmer-profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <User className="h-4 w-4 text-slate-500" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {landingNavLinks.map((link) => (
                  <button
                    key={link.name}
                    type="button"
                    onClick={() => handleHashClick(link.path)}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-[#2E7D32]"
                  >
                    {link.name}
                  </button>
                ))}
                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full rounded-full border border-[#2E7D32] px-4 py-2.5 text-center text-sm font-semibold text-[#2E7D32]"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full rounded-full bg-[#2E7D32] px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Get Started
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
