import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Wallet, Coins, Percent, 
  ArrowRight, ShieldCheck, CheckCircle2, Calculator, 
  PiggyBank, FileText
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { API_URL } from '../../config';

export default function FinancialSolutions() {
  const navigate = useNavigate();
  const cachedData = sessionStorage.getItem('khetseva_dashboard');
  const [profile, setProfile] = useState<any>(cachedData ? JSON.parse(cachedData) : null);
  const [loading, setLoading] = useState(!cachedData);
  const [applyModal, setApplyModal] = useState<string | null>(null);
  
  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(100000);
  const [tenureYears, setTenureYears] = useState(3);
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfileAndRisk = async () => {
      try {
        const res = await fetch(`${API_URL}/farmer/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const d = await res.json();
          sessionStorage.setItem('khetseva_dashboard', JSON.stringify(d));
          setProfile(d);
        }
      } catch (e) {
        console.error("Error fetching financial profile", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndRisk();
  }, [token]);

  // Extract new risk scores
  const latestRisk = profile?.latest_risk;
  const financialRisk = latestRisk?.financial_risk ?? 0;
  const disasterRisk = latestRisk?.disaster_risk ?? 0;
  const compoundRisk = latestRisk?.compound_risk ?? 0;
  const compoundLabel = latestRisk?.compound_label ?? 'Unknown';

  const getScoreColor = (score: number) => {
    if (score < 25) return '#16a34a';
    if (score < 50) return '#d97706';
    if (score < 75) return '#ea580c';
    return '#dc2626';
  };

  const getScoreBg = (score: number) => {
    if (score < 25) return '#f0fdf4';
    if (score < 50) return '#fffbeb';
    if (score < 75) return '#fff7ed';
    return '#fef2f2';
  };

  // Dynamic Interest Rate based on Financial Risk (lower risk = better rate)
  const getInterestRate = () => {
    if (financialRisk < 25) return 4.0; // Prime rate (KCC subsidized)
    if (financialRisk < 50) return 6.5; 
    if (financialRisk < 75) return 8.5;
    return 11.0; // Sub-prime or microfinance rate
  };

  const interestRate = getInterestRate();

  // EMI Calculation: P * r * (1+r)^n / ((1+r)^n - 1)
  const calculateEMI = (p: number, r: number, tYears: number) => {
    const monthlyRate = r / 12 / 100;
    const months = tYears * 12;
    if (monthlyRate === 0) return p / months;
    return (p * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  };

  const emi = calculateEMI(loanAmount, interestRate, tenureYears);
  const totalRepayment = emi * tenureYears * 12;
  const totalInterest = totalRepayment - loanAmount;

  // Custom styling helper
  const cardStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: '24px',
    padding: '28px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    border: '1px solid #f1f5f9',
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8faf8' }}>
        <div style={{ textAlign: 'center', margin: '0 auto' }}>
          <Loader2 size={40} className="animate-spin" style={{ color: '#166534', margin: '0 auto 16px' }} />
          <p style={{ color: '#4b5563', fontWeight: 600 }}>Loading custom offers...</p>
        </div>
      </div>
    );
  }

  // --- MOCK OFFERS ---
  const offers = [
    {
      id: 'kcc',
      title: 'Kisan Credit Card (KCC) Crop Loan',
      type: 'Government Subsidized',
      maxAmount: '₹3,00,000',
      rate: '4.0% p.a.',
      tenure: '1 Year (Renewable)',
      description: 'Subsidized credit line for crops, seeds, fertilizer, and short term working capital.',
      features: ['No collateral up to ₹1.6 Lakh', 'Dynamic interest rate matching', 'Flexible repayment on harvest'],
      badge: 'Highly Subsidized'
    },
    {
      id: 'equip',
      title: 'Agri-Equipment & Tractor Financing',
      type: 'Secured Equipment Loan',
      maxAmount: '₹7,50,000',
      rate: '6.5% - 8.5% p.a.',
      tenure: '3 - 7 Years',
      description: 'Financing for purchases of new tractors, harvesters, drip systems, or solar tube wells.',
      features: ['Quick 48h approval', 'Flexible seasonal EMI matching', 'Up to 90% funding value'],
      badge: 'Best Value'
    },
    {
      id: 'micro',
      title: 'Joint Liability Group (JLG) Loan',
      type: 'Microfinance for Smallholders',
      maxAmount: '₹50,000',
      rate: '9.0% p.a.',
      tenure: '1 - 2 Years',
      description: 'Ideal collateral-free loans for small sharecroppers, tenant farmers, and oral lessees.',
      features: ['Group-guaranteed collateral', 'Zero processing fees', 'Helps build your credit profile'],
      badge: 'Collateral-free'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8faf8', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div style={{ maxWidth: 1080, width: '100%', margin: '0 auto', padding: '40px 20px', flexGrow: 1 }}>
        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
            {"Financial Solutions"}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
            {"Risk-adjusted loan offers, insurance, and personalized financial advice."}
          </p>
        </div>

        {!token ? (
          /* Locked State if not logged in */
          <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 40px', maxWidth: 600, margin: '40px auto' }}>
            <Wallet size={48} style={{ color: '#166534', margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1f2937', marginBottom: 12 }}>Check Your Eligible Loan Offers</h2>
            <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 15, lineHeight: '1.5' }}>
              Log in with your phone number and password to view personalized, risk-adjusted credit limits, interest subventions, and apply directly.
            </p>
            <button onClick={() => navigate('/login')} style={{
              background: '#166534', color: '#fff', padding: '12px 32px', borderRadius: '12px',
              border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'inline-flex',
              alignItems: 'center', gap: 8, transition: 'background 0.2s'
            }}>
              <span>Log In to Account</span>
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            
            {/* Grid 1: Credit Score Dial + Profile Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
              
              {/* Financial Risk Score Gauge */}
              <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>
                  Financial Risk Score
                </span>
                
                {/* SVG Dial Meter */}
                <div style={{ position: 'relative', width: 200, height: 110, marginBottom: 16 }}>
                  <svg width="200" height="110" style={{ transform: 'rotate(0deg)' }}>
                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e2e8f0" strokeWidth="16" strokeLinecap="round"/>
                    {/* Active dynamic colored stroke */}
                    <path 
                      d="M 20 100 A 80 80 0 0 1 180 100" 
                      fill="none" 
                      stroke={getScoreColor(financialRisk)} 
                      strokeWidth="16" 
                      strokeLinecap="round"
                      strokeDasharray="251"
                      strokeDashoffset={251 - (financialRisk / 100) * 251}
                      style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: 36, fontWeight: 900, color: '#111827' }}>{financialRisk.toFixed(1)}</span>
                    <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>out of 100</span>
                  </div>
                </div>

                <div style={{ 
                  background: getScoreBg(financialRisk), color: getScoreColor(financialRisk), padding: '6px 16px', 
                  borderRadius: 999, fontWeight: 700, fontSize: 14, display: 'inline-flex', 
                  alignItems: 'center', gap: 6, marginBottom: 8
                }}>
                  <ShieldCheck size={16} />
                  <span>{financialRisk < 25 ? 'Low' : financialRisk < 50 ? 'Moderate' : financialRisk < 75 ? 'High' : 'Critical'} Risk</span>
                </div>
                
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0, maxWidth: 280, lineHeight: 1.4 }}>
                  Powered by ML Financial Risk Assessment model based on your income, debt, and crop loss history.
                </p>
              </div>

              {/* NEW: Risk Scores Panel */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Wallet size={20} style={{ color: '#d97706' }} />
                  <span>ML Risk Assessment</span>
                </h3>

                {/* Financial Risk */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ color: '#6b7280', fontSize: 13, fontWeight: 600 }}>Financial Risk (ML Model)</span>
                    <span style={{ fontWeight: 800, fontSize: 18, color: getScoreColor(financialRisk) }}>{financialRisk}<span style={{ fontSize: 12, color: '#9ca3af' }}>/100</span></span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: '#f3f4f6', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, #fbbf24, ${getScoreColor(financialRisk)})`, width: `${Math.min(financialRisk, 100)}%`, transition: 'width 1s ease' }} />
                  </div>
                </div>

                {/* Disaster Risk */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ color: '#6b7280', fontSize: 13, fontWeight: 600 }}>Disaster Risk (Weather)</span>
                    <span style={{ fontWeight: 800, fontSize: 18, color: getScoreColor(disasterRisk) }}>{disasterRisk}<span style={{ fontSize: 12, color: '#9ca3af' }}>/100</span></span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: '#f3f4f6', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, #60a5fa, ${getScoreColor(disasterRisk)})`, width: `${Math.min(disasterRisk, 100)}%`, transition: 'width 1s ease' }} />
                  </div>
                </div>

                {/* Compound Risk */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ color: '#6b7280', fontSize: 13, fontWeight: 600 }}>Compound Risk</span>
                    <span style={{ fontWeight: 800, fontSize: 18, color: getScoreColor(compoundRisk) }}>{compoundRisk}<span style={{ fontSize: 12, color: '#9ca3af' }}>/100</span></span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: '#f3f4f6', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${getScoreColor(compoundRisk)}, #dc2626)`, width: `${Math.min(compoundRisk, 100)}%`, transition: 'width 1s ease' }} />
                  </div>
                </div>

                <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 12, background: getScoreColor(compoundRisk) + '10', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: getScoreColor(compoundRisk) }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: getScoreColor(compoundRisk) }}>Status: {compoundLabel}</span>
                </div>
              </div>

              {/* Profile Details Panel */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PiggyBank size={20} style={{ color: '#166534' }} />
                  <span>Financial Profile Context</span>
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
                    <span style={{ color: '#6b7280', fontSize: 14 }}>Annual Income Band</span>
                    <span style={{ fontWeight: 700, color: '#1f2937' }}>₹{profile?.financial_details?.income_band || '1-3L'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
                    <span style={{ color: '#6b7280', fontSize: 14 }}>Existing Active Debt</span>
                    <span style={{ fontWeight: 700, color: '#1f2937' }}>₹{(profile?.financial_details?.loan_amount || 0).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
                    <span style={{ color: '#6b7280', fontSize: 14 }}>Crop Loss (Last 2 seasons)</span>
                    <span style={{ fontWeight: 700, color: profile?.financial_details?.past_crop_loss ? '#dc2626' : '#16a34a' }}>
                      {profile?.financial_details?.past_crop_loss ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 4 }}>
                    <span style={{ color: '#6b7280', fontSize: 14 }}>Enrolled in Insurance (PMFBY)</span>
                    <span style={{ fontWeight: 700, color: '#1f2937', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {profile?.financial_details?.has_insurance ? (
                        <><CheckCircle2 size={16} style={{ color: '#16a34a' }} /> Yes</>
                      ) : 'No'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Section: Eligible Loan Offers */}
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Coins size={22} style={{ color: '#166534' }} />
                <span>Pre-Approved Offers for {profile?.farmer?.full_name}</span>
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 32 }}>
                {offers.map((o) => (
                  <div key={o.id} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>
                    
                    {/* Badge */}
                    <div style={{
                      position: 'absolute', top: 12, right: 12, background: '#f0fdf4',
                      color: '#166534', padding: '4px 10px', borderRadius: 999, fontSize: 11,
                      fontWeight: 700, border: '1px solid #dcfce7'
                    }}>
                      {o.badge}
                    </div>

                    <div style={{ flexGrow: 1 }}>
                      <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{o.type}</span>
                      <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '4px 0 16px', paddingRight: 60, lineHeight: 1.3 }}>{o.title}</h3>
                      
                      {/* Financial Figures Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: '#fafafa', padding: 12, borderRadius: 12, marginBottom: 16 }}>
                        <div>
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>Max Limit</div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: '#1f2937' }}>{o.maxAmount}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>Interest Rate</div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: '#166534' }}>{o.id === 'kcc' ? `${interestRate.toFixed(1)}% p.a.` : o.rate}</div>
                        </div>
                      </div>

                      <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5, marginBottom: 16 }}>{o.description}</p>
                      
                      {/* Features */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                        {o.features.map((f, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#4b5563' }}>
                            <CheckCircle2 size={14} style={{ color: '#16a34a', flexShrink: 0 }} />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => setApplyModal(o.title)}
                      style={{
                        width: '100%', background: '#166534', color: '#fff', border: 'none',
                        padding: '12px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer',
                        fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: 6, transition: 'background 0.2s'
                      }}
                    >
                      <span>Apply For Loan</span>
                      <ArrowRight size={16} />
                    </button>

                  </div>
                ))}
              </div>
            </div>

            {/* Interactive EMI Calculator */}
            <div style={{ ...cardStyle, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
              
              {/* Inputs */}
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Calculator size={20} style={{ color: '#166534' }} />
                  <span>Interactive Loan EMI Calculator</span>
                </h3>
                
                {/* Amount Slider */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, color: '#4b5563', fontWeight: 600 }}>Loan Amount</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#166534' }}>₹{loanAmount.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="10000" 
                    max="500000" 
                    step="5000" 
                    value={loanAmount} 
                    onChange={e => setLoanAmount(Number(e.target.value))} 
                    style={{ width: '100%', accentColor: '#166534', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                    <span>₹10,000</span>
                    <span>₹5,00,000</span>
                  </div>
                </div>

                {/* Tenure Slider */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, color: '#4b5563', fontWeight: 600 }}>Tenure (Repayment Period)</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#166534' }}>{tenureYears} {tenureYears === 1 ? 'Year' : 'Years'}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    step="1" 
                    value={tenureYears} 
                    onChange={e => setTenureYears(Number(e.target.value))} 
                    style={{ width: '100%', accentColor: '#166534', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                    <span>1 Year</span>
                    <span>5 Years</span>
                  </div>
                </div>
              </div>

              {/* Outputs Summary */}
              <div style={{ background: '#fcfdfc', border: '1.5px dashed #bbf7d0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Percent size={14} />
                  <span>Calculated Risk-Adjusted Terms</span>
                </span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#4b5563', fontSize: 13 }}>Interest Rate Applied</span>
                    <span style={{ fontWeight: 700, color: '#166534' }}>{interestRate.toFixed(1)}% p.a.</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#4b5563', fontSize: 13 }}>Total Interest Payable</span>
                    <span style={{ fontWeight: 700, color: '#1f2937' }}>₹{Math.round(totalInterest).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#4b5563', fontSize: 13 }}>Total Repayment Amount</span>
                    <span style={{ fontWeight: 700, color: '#1f2937' }}>₹{Math.round(totalRepayment).toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16, textAlign: 'center' }}>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>Estimated Monthly Installment (EMI)</span>
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#166534', margin: '4px 0' }}>
                    ₹{Math.round(emi).toLocaleString()}<span style={{ fontSize: 14, fontWeight: 600, color: '#6b7280' }}>/mo</span>
                  </div>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>*Calculated seasonally based on crop cycle</span>
                </div>
              </div>

            </div>

            {/* PMFBY Crop Insurance Information */}
            <div style={{ 
              ...cardStyle, 
              background: 'linear-gradient(to right, #1e3a1f, #0f2a10)', 
              color: '#fff', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 24 
            }}>
              <div style={{ flexGrow: 1 }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12, border: '1px solid rgba(255,255,255,0.15)' }}>
                  <FileText size={12} />
                  <span>Pradhan Mantri Fasal Bima Yojana (PMFBY)</span>
                </div>
                
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>Protect Your Farm Against Natural Disasters</h3>
                <p style={{ color: '#a7f3d0', fontSize: 14, margin: 0, lineHeight: 1.5, maxWidth: 640 }}>
                  Get crop insurance to secure your finances. Premium is subsidized by the government—only pay 1.5% for Rabi, 2% for Kharif, and 5% for commercial crops. Safeguard against drought, flood, pests, and local storms.
                </p>
              </div>

              <button 
                onClick={() => setApplyModal('PMFBY Crop Insurance')}
                style={{
                  background: '#34d399', color: '#064e3b', border: 'none', padding: '14px 28px',
                  borderRadius: '12px', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 8, alignSelf: 'center',
                  flexShrink: 0, boxShadow: '0 4px 14px rgba(52,211,153,0.3)', transition: 'transform 0.2s'
                }}
              >
                <span>Enroll in PMFBY</span>
                <ArrowRight size={16} />
              </button>
            </div>

          </div>
        )}
      </div>

      <Footer />

      {/* Success Application Modal */}
      <AnimatePresence>
        {applyModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: 20
          }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: '#fff', borderRadius: 24, padding: 32,
                maxWidth: 480, width: '100%', textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: 32, background: '#dcfce7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#16a34a', margin: '0 auto 20px'
              }}>
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>Application Submitted!</h3>
              <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.5, margin: '0 0 24px' }}>
                Your request to enroll in the <strong>{applyModal}</strong> has been received successfully. Our agri-finance desk is analyzing your coordinates and will reach you within 24 hours.
              </p>

              <button 
                onClick={() => setApplyModal(null)}
                style={{
                  width: '100%', background: '#166534', color: '#fff', border: 'none',
                  padding: '12px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer',
                  fontSize: 14
                }}
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
