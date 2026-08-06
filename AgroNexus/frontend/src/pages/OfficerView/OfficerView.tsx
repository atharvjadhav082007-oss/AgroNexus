import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Loader2, Lock, ShieldCheck,
  TrendingDown, LogOut, Sliders, Search, Filter,
  Sparkles, CheckCircle2, AlertTriangle
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { getRiskBandColor, getRiskBandBg } from '../../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function OfficerView() {
  const [officerKey, setOfficerKey] = useState<string | null>(localStorage.getItem('officer_key'));
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Auth inputs
  const [keyInput, setKeyInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Optimizer inputs & outputs
  const [budget, setBudget] = useState('500000');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optResults, setOptResults] = useState<any>(null);
  const [optError, setOptError] = useState('');
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [cropFilter, setCropFilter] = useState('all');

  const fetchDashboard = async (key: string) => {
    try {
      const response = await fetch(`${API_URL}/government/dashboard`, {
        headers: { 'X-Officer-Key': key }
      });
      if (!response.ok) {
        throw new Error('Access denied. Please check your credentials.');
      }
      const result = await response.json();
      setData(result);
      setOfficerKey(key);
      localStorage.setItem('officer_key', key);
      setAuthError('');
    } catch (err: any) {
      localStorage.removeItem('officer_key');
      setOfficerKey(null);
      setAuthError(err.message || 'Invalid officer access key');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (officerKey) {
      fetchDashboard(officerKey);
    } else {
      setLoading(false);
    }
  }, [officerKey]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) {
      setAuthError('Key cannot be empty');
      return;
    }
    setIsVerifying(true);
    setLoading(true);
    await fetchDashboard(keyInput.trim());
    setIsVerifying(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('officer_key');
    setOfficerKey(null);
    setData(null);
    setOptResults(null);
  };

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) {
      setOptError('Please enter a valid positive budget amount');
      return;
    }
    setIsOptimizing(true);
    setOptError('');
    try {
      const response = await fetch(`${API_URL}/government/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Officer-Key': officerKey || ''
        },
        body: JSON.stringify({ budget: Number(budget) })
      });
      if (!response.ok) {
        throw new Error('Failed to run optimization solver.');
      }
      const resData = await response.json();
      setOptResults(resData);
    } catch (err: any) {
      setOptError(err.message || 'Optimization error');
    } finally {
      setIsOptimizing(false);
    }
  };

  // Get list of unique crops for filters
  const cropsList = data?.farmers
    ? Array.from(new Set(data.farmers.map((f: any) => f.primary_crop).filter(Boolean)))
    : [];

  // Filtered farmers
  const filteredFarmers = data?.farmers
    ? data.farmers.filter((f: any) => {
        const matchesSearch = f.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              f.pin_code.includes(searchQuery);
        const matchesRisk = riskFilter === 'all' || f.compound_label === riskFilter;
        const matchesCrop = cropFilter === 'all' || f.primary_crop === cropFilter;
        return matchesSearch && matchesRisk && matchesCrop;
      })
    : [];

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FCF8]">
        <div className="text-center">
          <Loader2 size={48} className="text-[#2E7D32] animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Authenticating Session...</p>
        </div>
      </div>
    );
  }

  // --- LOGIN SCREEN ---
  if (!officerKey) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FCF8]">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md glass-panel rounded-3xl p-8 shadow-xl"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white mx-auto mb-6 shadow-md shadow-orange-200/50">
              <Lock className="h-7 w-7" />
            </div>
            
            <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-2">Officer Dashboard Access</h2>
            <p className="text-slate-500 text-sm text-center mb-6">
              Enter your secure Government / NGO authentication key to view critical risk scores and run the resource optimization engine.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Access Key</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="e.g. khetseva-officer-2026"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition text-slate-800"
                  />
                </div>
                {authError && (
                  <motion.p 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="text-red-500 text-xs font-medium mt-2 flex items-center gap-1"
                  >
                    <AlertTriangle className="h-3 w-3" /> {authError}
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full rounded-xl bg-gradient-to-r from-[#2E7D32] to-[#43A047] py-3 text-sm font-bold text-white shadow-lg shadow-green-100/50 hover:from-[#1F5F23] hover:to-[#2E7D32] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" /> Verify Credentials
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="font-semibold text-slate-500">Demo Mode Info:</span> Use the default key <code className="bg-slate-200/80 px-1.5 py-0.5 rounded font-mono text-slate-700">khetseva-officer-2026</code> to proceed.
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD SCREEN ---
  return (
    <div className="min-h-screen bg-[#F8FCF8] flex flex-col">
      <Navbar />

      {/* Officer Header */}
      <div className="bg-white/80 border-b border-slate-200/80 backdrop-blur-md sticky top-[90px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#2E7D32]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Officer / NGO Administration Panel</h1>
              <p className="text-xs text-slate-500 font-medium">Monitoring crop loss risks and allocating disaster relief budgets</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Session: Authorized
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow space-y-8 w-full">
        {/* Summary Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Farmers', value: data?.total_farmers ?? 0, color: 'text-slate-900', bg: 'bg-white border-slate-200/60' },
            { label: 'Critical Risk', value: data?.critical_count ?? 0, color: 'text-red-600', bg: 'bg-red-50/50 border-red-200/60' },
            { label: 'High Risk', value: data?.high_count ?? 0, color: 'text-orange-600', bg: 'bg-orange-50/50 border-orange-200/60' },
            { label: 'Watch List', value: data?.watch_count ?? 0, color: 'text-amber-600', bg: 'bg-amber-50/50 border-amber-200/60' },
            { label: 'Stable Status', value: data?.stable_count ?? 0, color: 'text-green-600', bg: 'bg-green-50/50 border-green-200/60' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-5 rounded-2xl border ${item.bg} shadow-sm`}
            >
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{item.label}</div>
              <div className={`text-3xl font-extrabold ${item.color}`}>{item.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Two-Column Optimizer and Directory Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* OPTIMIZER COLUMN */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-[#2E7D32]" />
                  Relief Solver
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  OR-Tools CP-SAT
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Run the constraints optimization model to allocate a disaster mitigation budget to registered farmers. It balances compound risk severity against financial loans to maximize the overall risk reduced.
              </p>

              <form onSubmit={handleOptimize} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Total Mitigation Budget (₹)</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold text-sm">₹</span>
                    </div>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="e.g. 500000"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] text-sm font-semibold text-slate-800"
                    />
                  </div>
                  {optError && <p className="text-red-500 text-xs mt-1.5 font-medium">{optError}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isOptimizing}
                  className="w-full py-2.5 rounded-xl text-white font-bold text-sm bg-[#2E7D32] hover:bg-[#1F5F23] shadow-md shadow-green-100/50 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {isOptimizing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Solving Constraints...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Run Relief Optimizer
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* OPTIMIZATION RESULTS SUMMARY */}
            <AnimatePresence mode="wait">
              {optResults && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-md space-y-6"
                >
                  <h4 className="text-md font-bold flex items-center justify-between text-white border-b border-slate-800 pb-3">
                    <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Optimal Solution</span>
                    <button 
                      onClick={() => setOptResults(null)} 
                      className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Spent</div>
                      <div className="text-xl font-black text-emerald-400">₹{optResults.total_spent.toLocaleString()}</div>
                      <div className="text-[9px] text-slate-500 mt-1">out of ₹{optResults.total_budget.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Vulnerability Mitigated</div>
                      <div className="text-xl font-black text-amber-400">-{optResults.total_mitigated_score.toFixed(1)} pts</div>
                      <div className="text-[9px] text-slate-500 mt-1">across {optResults.allocations?.length ?? 0} farmers</div>
                    </div>
                  </div>

                  {/* Budget Allocation Breakdown bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">Budget Utilization Rate</span>
                      <span className="text-slate-200">{((optResults.total_spent / optResults.total_budget) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${Math.min(100, (optResults.total_spent / optResults.total_budget) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Allocations Sub-list */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-400">Selected Disbursements</div>
                    <div className="max-h-[180px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                      {optResults.allocations.map((alloc: any, i: number) => (
                        <div key={i} className="flex justify-between items-center text-xs py-2 border-b border-slate-800/60 last:border-b-0">
                          <div>
                            <div className="font-semibold text-slate-200">{alloc.farmer_name}</div>
                            <div className="text-[10px] text-slate-400">{alloc.intervention}</div>
                          </div>
                          <div className="text-right font-mono font-bold text-emerald-400">
                            ₹{alloc.cost.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Solver Rationale */}
                  <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800/60 text-xs space-y-2 leading-relaxed">
                    <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Solver Agent Rationale
                    </div>
                    <p className="text-slate-400 text-[11px] font-mono leading-tight whitespace-pre-line">
                      {optResults.thought_process}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FARMER RISK DIRECTORY TABLE */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-slate-700" />
                Farmer Risk Directory
              </h3>

              {/* Filters Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {/* Search query */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Name/PIN..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] text-xs font-medium text-slate-800"
                  />
                </div>

                {/* Risk Filter */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Filter className="h-4 w-4" />
                  </span>
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] text-xs font-semibold text-slate-600 bg-white"
                  >
                    <option value="all">All Risk Classes</option>
                    <option value="Critical">Critical</option>
                    <option value="High Risk">High Risk</option>
                    <option value="Watch">Watch List</option>
                    <option value="Stable">Stable</option>
                  </select>
                </div>

                {/* Crop Filter */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Filter className="h-4 w-4" />
                  </span>
                  <select
                    value={cropFilter}
                    onChange={(e) => setCropFilter(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] text-xs font-semibold text-slate-600 bg-white"
                  >
                    <option value="all">All Crop Types</option>
                    {cropsList.map((crop, idx) => (
                      <option key={idx} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full border-collapse text-left text-xs text-slate-500">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3">Farmer Name</th>
                      <th className="px-4 py-3">PIN Code</th>
                      <th className="px-4 py-3">Crop</th>
                      <th className="px-4 py-3">Land Size</th>
                      <th className="px-4 py-3 text-center">Financial Risk</th>
                      <th className="px-4 py-3 text-center">Disaster Risk</th>
                      <th className="px-4 py-3 text-center">Compound Score</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredFarmers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                          No farmers found matching the current search filters.
                        </td>
                      </tr>
                    ) : (
                      filteredFarmers.map((f: any) => (
                        <tr key={f.id} className="hover:bg-slate-50/50 transition">
                          <td className="px-4 py-3 font-semibold text-slate-800">{f.full_name}</td>
                          <td className="px-4 py-3 font-mono">{f.pin_code}</td>
                          <td className="px-4 py-3">{f.primary_crop || '—'}</td>
                          <td className="px-4 py-3">{f.land_size_acres ? `${f.land_size_acres} ac` : '—'}</td>
                          <td className="px-4 py-3 text-center font-bold text-slate-700">{f.financial_risk ?? '—'}</td>
                          <td className="px-4 py-3 text-center font-bold text-slate-700">{f.disaster_risk ?? '—'}</td>
                          <td className="px-4 py-3 text-center font-bold text-slate-900">{f.compound_score ?? '—'}%</td>
                          <td className="px-4 py-3 text-right">
                            <span 
                              className="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold"
                              style={{
                                background: getRiskBgLocal(f.compound_label || ''),
                                color: getRiskBandColor(f.compound_label || '')
                              }}
                            >
                              {f.compound_label || '—'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Local helper in case type import acts up
function getRiskBgLocal(label: string): string {
  switch (label) {
    case 'Critical': return 'rgba(220,38,38,0.08)';
    case 'High Risk': return 'rgba(234,88,12,0.08)';
    case 'Watch': return 'rgba(217,119,6,0.08)';
    case 'Stable': return 'rgba(22,163,74,0.08)';
    default: return 'rgba(107,114,128,0.08)';
  }
}
