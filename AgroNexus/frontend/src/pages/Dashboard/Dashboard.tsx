import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
  AlertTriangle, Shield, TrendingUp, CloudRain, Wallet, RefreshCw, Loader2,
  ChevronRight, LogOut, ChevronDown, Droplets, Thermometer, Sun, Moon, Sunset,
  Zap, User, CloudLightning, Sprout
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import AIChatbot from '../../components/AIChatbot/AIChatbot';
import { useLanguage } from '../../context/LanguageContext';
import type { DashboardData, RiskFactor, DisasterSignals } from '../../types';
import { getRiskBandColor } from '../../types';

const API_URL = 'http://localhost:8000/api';

// ─────────────────────────────────────────────
// Animated Number Counter
// ─────────────────────────────────────────────
function AnimatedCounter({ value, duration = 1.2, suffix = '' }: { value: number; duration?: number; suffix?: string }) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
    });
    const unsub = rounded.on('change', (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [value, duration, motionVal, rounded]);

  return <span className="stat-value">{display}{suffix}</span>;
}

// ─────────────────────────────────────────────
// SVG Risk Gauge
// ─────────────────────────────────────────────
function RiskGauge({ value, label, color }: { value: number; label: string; color: string }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const isCritical = label === 'Critical';

  return (
    <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto' }}>
      <svg
        width="160" height="160" viewBox="0 0 120 120"
        className={isCritical ? 'risk-gauge-critical' : ''}
      >
        {/* Background track */}
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Animated fill */}
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="risk-gauge-circle"
          transform="rotate(-90 60 60)"
          style={{
            filter: isCritical ? `drop-shadow(0 0 8px ${color})` : 'none',
          }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontSize: 36, fontWeight: 900, color, lineHeight: 1 }}>
          <AnimatedCounter value={value} suffix="%" />
        </div>
        <div style={{
          marginTop: 6, padding: '3px 12px', borderRadius: 999,
          background: color, color: '#fff', fontWeight: 700, fontSize: 11,
          letterSpacing: 0.5,
        }}>{label}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Time-Aware Greeting
// ─────────────────────────────────────────────
function getTimeGreeting(): { text: string; icon: React.ReactNode; gradient: string } {
  const hour = new Date().getHours();
  if (hour < 12) return {
    text: 'Good Morning',
    icon: <Sun size={22} style={{ color: '#fbbf24' }} />,
    gradient: 'linear-gradient(135deg, #fef3c7, #fde68a, #fcd34d)',
  };
  if (hour < 17) return {
    text: 'Good Afternoon',
    icon: <Sunset size={22} style={{ color: '#f97316' }} />,
    gradient: 'linear-gradient(135deg, #fed7aa, #fdba74, #fb923c)',
  };
  return {
    text: 'Good Evening',
    icon: <Moon size={22} style={{ color: '#818cf8' }} />,
    gradient: 'linear-gradient(135deg, #c7d2fe, #a5b4fc, #818cf8)',
  };
}

// ─────────────────────────────────────────────
// Relative Time Display
// ─────────────────────────────────────────────
function RelativeTime({ dateStr }: { dateStr: string }) {
  const [text, setText] = useState('');

  useEffect(() => {
    const update = () => {
      const diff = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) setText('just now');
      else if (mins < 60) setText(`${mins}m ago`);
      else if (mins < 1440) setText(`${Math.floor(mins / 60)}h ago`);
      else setText(`${Math.floor(mins / 1440)}d ago`);
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, [dateStr]);

  return <span>{text}</span>;
}

// ─────────────────────────────────────────────
// Risk Factor Breakdown Panel
// ─────────────────────────────────────────────
function FactorBreakdown({ title, icon, factors, color }: {
  title: string; icon: React.ReactNode;
  factors: RiskFactor[]; color: string;
}) {
  const [open, setOpen] = useState(false);
  const maxPoints = Math.max(...factors.map(f => Math.abs(f.points)), 25);

  return (
    <div className="glass-card" style={{ borderLeft: `3px solid ${color}`, padding: '16px 20px' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', width: '100%',
          display: 'flex', alignItems: 'center', gap: 10, padding: 0,
          fontFamily: 'inherit',
        }}
      >
        {icon}
        <span style={{ fontWeight: 700, fontSize: 14, color: '#111827', flex: 1, textAlign: 'left' }}>
          {title}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={18} style={{ color: '#9ca3af' }} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {factors.map((f, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: '#4b5563', fontWeight: 500 }}>{f.factor}</span>
                    <span style={{ color, fontWeight: 700 }}>{f.points > 0 ? '+' : ''}{f.points} pts</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: 'rgba(0,0,0,0.05)' }}>
                    <div
                      className="factor-bar-fill"
                      style={{
                        height: '100%', borderRadius: 99, background: color,
                        width: `${(Math.abs(f.points) / maxPoints) * 100}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// Custom Recharts Tooltip
// ─────────────────────────────────────────────
function GlassTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
      borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.5)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)', fontSize: 12,
    }}>
      <div style={{ fontWeight: 700, color: '#111827', marginBottom: 6 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ color: '#6b7280' }}>{p.name}:</span>
          <span style={{ fontWeight: 600, color: '#111827' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recomputing, setRecomputing] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchDashboard = useCallback(async () => {
    if (!token) { navigate('/login'); return; }
    try {
      const res = await fetch(`${API_URL}/farmer/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { localStorage.removeItem('token'); navigate('/login'); return; }
      const d = await res.json();
      if (!res.ok) throw new Error(d.detail || 'Failed to load');
      setData(d);
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  }, [token, navigate]);

  const handleRecompute = async () => {
    setRecomputing(true);
    try {
      await fetch(`${API_URL}/farmer/recompute`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` },
      });
      await fetchDashboard();
    } catch (e: any) { setError(e.message); }
    setRecomputing(false);
  };

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // ── Loading State ──
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8faf8' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
      >
        <Loader2 size={44} style={{ color: '#166534', animation: 'spin 1s linear infinite' }} />
        <span style={{ color: '#6b7280', fontSize: 14, fontWeight: 500 }}>Loading your dashboard...</span>
      </motion.div>
    </div>
  );

  // ── No Data State ──
  if (!data) return (
    <div style={{ minHeight: '100vh', background: '#f8faf8' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: 60 }}>
        <p style={{ color: '#6b7280' }}>{error || 'No data. Complete onboarding first.'}</p>
        <button onClick={() => navigate('/register')} style={{
          marginTop: 16, padding: '12px 24px', borderRadius: 12, border: 'none',
          background: '#166534', color: '#fff', cursor: 'pointer', fontWeight: 600,
        }}>Complete Registration</button>
      </div>
    </div>
  );

  // ── Derived Data ──
  const risk = data.latest_risk;
  const compound = risk?.compound_risk ?? 0;
  const label = risk?.compound_label ?? 'Unknown';
  const bandColor = getRiskBandColor(label);
  const isCritical = label === 'Critical';
  const greeting = getTimeGreeting();

  // Translated band label
  const translatedLabel = label === 'Critical' ? t('band.critical')
    : label === 'High Risk' ? t('band.highRisk')
    : label === 'Watch' ? t('band.watch')
    : t('band.stable');

  // Parse risk factors
  let financialFactors: RiskFactor[] = [];
  let disasterSignals: DisasterSignals | null = null;
  try {
    if (risk?.financial_factors_json) financialFactors = JSON.parse(risk.financial_factors_json);
  } catch {}
  try {
    if (risk?.disaster_factors_json) disasterSignals = JSON.parse(risk.disaster_factors_json);
  } catch {}

  // Forecast chart data
  const forecastChart = data.forecast_data?.dates?.map((date: string, i: number) => ({
    date: date.slice(5),
    rain: data.forecast_data?.precipitation_mm?.[i] ?? 0,
    maxT: data.forecast_data?.temp_max?.[i] ?? 0,
    minT: data.forecast_data?.temp_min?.[i] ?? 0,
  })) ?? [];

  // Risk history for trend
  const trendData = [...(data.risk_history || [])].reverse().map(r => ({
    date: new Date(r.computed_at).toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN', { day: '2-digit', month: 'short' }),
    financial: r.financial_risk,
    disaster: r.disaster_risk,
    compound: r.compound_risk,
  }));

  // Urgent recs for ticker
  const urgentRecs = data.recommendations.filter(r => r.priority === 'urgent');

  // Nav items with mini-stats
  const navItems = [
    {
      label: 'Farmer Profile', path: '/farmer-profile', icon: '👤',
      stat: data.farm_details?.crops || '—', statLabel: 'Crops',
      gradient: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
    },
    {
      label: 'Disaster Score', path: '/disaster-score', icon: '🌊',
      stat: `${risk?.disaster_risk ?? '—'}`, statLabel: 'Score',
      gradient: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    },
    {
      label: 'Recommendations', path: '/recommendations', icon: '📋',
      stat: `${urgentRecs.length} urgent`, statLabel: 'Actions',
      gradient: urgentRecs.length > 0 ? 'linear-gradient(135deg, #fef2f2, #fecaca)' : 'linear-gradient(135deg, #f0fdf4, #bbf7d0)',
    },
    {
      label: 'Govt Schemes', path: '/government-schemes', icon: '🏛️',
      stat: `${data.eligible_schemes?.filter(s => s.status === 'Eligible now').length || 0}`, statLabel: 'Eligible',
      gradient: 'linear-gradient(135deg, #f0fdf4, #bbf7d0)',
    },
    {
      label: 'Financial Solutions', path: '/financial-solutions', icon: '💹',
      stat: `₹${(data.financial_details?.loan_amount || 0).toLocaleString()}`, statLabel: 'Loan',
      gradient: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
    },
  ];

  // Stagger animation variants
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0f7f0 0%, #f8faf8 30%, #f8faf8 100%)' }}>
      <Navbar />

      <motion.div
        initial="hidden" animate="show" variants={stagger}
        style={{ maxWidth: 1140, margin: '0 auto', padding: '24px 20px' }}
      >

        {/* ═══ Time-Aware Greeting Banner ═══ */}
        <motion.div variants={fadeUp}
          className="time-banner"
          style={{
            background: greeting.gradient,
            borderRadius: 20, padding: '22px 28px', marginBottom: 24,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {greeting.icon}
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: 0 }}>
                {greeting.text}, {data.farmer.full_name} 🙏
              </h1>
              <p style={{ color: '#4b5563', margin: '4px 0 0', fontSize: 13 }}>
                PIN: {data.farmer.pin_code} • {data.farmer.latitude?.toFixed(2)}°N, {data.farmer.longitude?.toFixed(2)}°E
                {risk?.computed_at && (
                  <> • Updated <RelativeTime dateStr={risk.computed_at} /></>
                )}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleRecompute} disabled={recomputing} style={{
              padding: '10px 18px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.1)',
              background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', cursor: 'pointer',
              fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}>
              <RefreshCw size={14} style={recomputing ? { animation: 'spin 1s linear infinite' } : {}} /> {t('dash.refreshRisk')}
            </button>
            <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} style={{
              padding: '10px 18px', borderRadius: 12, border: '1.5px solid rgba(220,38,38,0.2)',
              background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', cursor: 'pointer',
              color: '#dc2626', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}>
              <LogOut size={14} /> {t('nav.logout')}
            </button>
          </div>
        </motion.div>

        {/* ═══ Critical Alert Banner ═══ */}
        <AnimatePresence>
          {isCritical && (
            <motion.div
              initial={{ opacity: 0, y: -20, scaleY: 0.8 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -20, scaleY: 0.8 }}
              style={{
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: '#fff',
                padding: '18px 24px', borderRadius: 16, marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: '0 8px 32px rgba(220,38,38,0.25)',
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <AlertTriangle size={28} />
              </motion.div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{t('dash.possibleCrisis')}</div>
                <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>
                  Your compound vulnerability is {compound}%. Financial fragility and disaster exposure are both elevated. Immediate action recommended.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ Urgent Ticker ═══ */}
        {urgentRecs.length > 0 && (
          <motion.div variants={fadeUp}
            style={{
              background: 'rgba(254,242,242,0.7)', backdropFilter: 'blur(8px)',
              borderRadius: 12, padding: '10px 16px', marginBottom: 20,
              overflow: 'hidden', border: '1px solid rgba(252,165,165,0.3)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            <Zap size={16} style={{ color: '#dc2626', flexShrink: 0 }} />
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div className="ticker-track">
                {urgentRecs.map((r, i) => (
                  <span key={i} style={{ fontSize: 12, color: '#991b1b', fontWeight: 600, marginRight: 48 }}>
                    ⚠️ {r.text}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ Risk Overview Row ═══ */}
        <motion.div variants={fadeUp}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}
        >
          {/* Compound Risk Gauge */}
          <div className="glass-card" style={{
            border: `2px solid ${bandColor}20`,
            background: `linear-gradient(135deg, rgba(255,255,255,0.8), ${bandColor}08)`,
            gridRow: 'span 1',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1.5, textAlign: 'center', marginBottom: 8 }}>
              {t('dash.compoundRisk')}
            </div>
            <RiskGauge value={compound} label={translatedLabel} color={bandColor} />
          </div>

          {/* Financial Risk */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Wallet size={18} style={{ color: '#d97706' }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1 }}>
                {t('dash.financialRisk')}
              </span>
            </div>
            <div style={{ fontSize: 38, fontWeight: 900, color: '#111827', lineHeight: 1 }}>
              <AnimatedCounter value={risk?.financial_risk ?? 0} />
              <span style={{ fontSize: 16, color: '#9ca3af', fontWeight: 600 }}>/100</span>
            </div>
            <div style={{
              marginTop: 10, height: 6, borderRadius: 99, background: 'rgba(0,0,0,0.06)',
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${risk?.financial_risk ?? 0}%` }}
                transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #fbbf24, #d97706)' }}
              />
            </div>
          </div>

          {/* Disaster Risk */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CloudRain size={18} style={{ color: '#2563eb' }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1 }}>
                {t('dash.disasterRisk')}
              </span>
            </div>
            <div style={{ fontSize: 38, fontWeight: 900, color: '#111827', lineHeight: 1 }}>
              <AnimatedCounter value={risk?.disaster_risk ?? 0} />
              <span style={{ fontSize: 16, color: '#9ca3af', fontWeight: 600 }}>/100</span>
            </div>
            <div style={{
              marginTop: 10, height: 6, borderRadius: 99, background: 'rgba(0,0,0,0.06)',
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${risk?.disaster_risk ?? 0}%` }}
                transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
                style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #60a5fa, #2563eb)' }}
              />
            </div>
          </div>

          {/* Farm Info */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sprout size={18} style={{ color: '#166534' }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1 }}>
                {t('dash.farm')}
              </span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{data.farm_details?.crops || '—'}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6, lineHeight: 1.6 }}>
              {data.farm_details?.land_size_acres} {t('dash.acres')} • {data.farm_details?.ownership_type}
              <br />{data.farm_details?.irrigation_source}
            </div>
          </div>
        </motion.div>

        {/* ═══ XAI Explanation ═══ */}
        {risk?.xai_explanation && (
          <motion.div variants={fadeUp}
            className="glass-card" style={{ marginBottom: 24, borderLeft: `4px solid ${bandColor}` }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Shield size={18} style={{ color: '#166534' }} />
              <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>Why is my risk {label}?</span>
            </div>
            <p style={{ margin: 0, color: '#374151', fontSize: 14, lineHeight: 1.7 }}>{risk.xai_explanation}</p>
          </motion.div>
        )}

        {/* ═══ Risk Factor Breakdowns ═══ */}
        {(financialFactors.length > 0 || disasterSignals) && (
          <motion.div variants={fadeUp}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 16, marginBottom: 24 }}
          >
            {financialFactors.length > 0 && (
              <FactorBreakdown
                title="Financial Risk Factors"
                icon={<Wallet size={18} style={{ color: '#d97706' }} />}
                factors={financialFactors}
                color="#d97706"
              />
            )}
            {disasterSignals && (
              <FactorBreakdown
                title="Disaster Signals"
                icon={<CloudLightning size={18} style={{ color: '#2563eb' }} />}
                factors={[
                  { factor: 'Drought Signal', points: Math.round(disasterSignals.drought_signal * 100) / 100 },
                  { factor: 'Flood Signal', points: Math.round(disasterSignals.flood_signal * 100) / 100 },
                  { factor: 'Heat Signal', points: Math.round(disasterSignals.heat_signal * 100) / 100 },
                  { factor: `Rainfall Ratio (${disasterSignals.rainfall_ratio}x)`, points: Math.round(disasterSignals.forecast_total_mm) },
                  { factor: `Hot Days (${disasterSignals.max_consecutive_hot_days}d)`, points: disasterSignals.max_consecutive_hot_days },
                ]}
                color="#2563eb"
              />
            )}
          </motion.div>
        )}

        {/* ═══ Charts Row ═══ */}
        <motion.div variants={fadeUp}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20, marginBottom: 24 }}
        >
          {/* 15-day Rainfall Chart */}
          {forecastChart.length > 0 && (
            <div className="glass-card">
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Droplets size={18} style={{ color: '#3b82f6' }} /> 15-Day Rainfall Forecast (mm)
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={forecastChart}>
                  <defs>
                    <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} />
                  <Tooltip content={<GlassTooltip />} />
                  <Bar dataKey="rain" fill="url(#rainGrad)" radius={[6, 6, 0, 0]} name="Rainfall (mm)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Risk Trend Chart — Upgraded to AreaChart */}
          {trendData.length > 1 && (
            <div className="glass-card">
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={18} style={{ color: '#166534' }} /> Risk Score Trend
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="compoundGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#dc2626" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="finGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d97706" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#d97706" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="disGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} />
                  <Tooltip content={<GlassTooltip />} />
                  <Area type="monotone" dataKey="compound" stroke="#dc2626" strokeWidth={2.5} fill="url(#compoundGrad)" dot={{ r: 4, fill: '#dc2626' }} name="Compound" />
                  <Area type="monotone" dataKey="financial" stroke="#d97706" strokeWidth={1.5} fill="url(#finGrad)" dot={{ r: 3, fill: '#d97706' }} name="Financial" />
                  <Area type="monotone" dataKey="disaster" stroke="#2563eb" strokeWidth={1.5} fill="url(#disGrad)" dot={{ r: 3, fill: '#2563eb' }} name="Disaster" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* ═══ Quick Recommendations ═══ */}
        {data.recommendations.length > 0 && (
          <motion.div variants={fadeUp} className="glass-card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111827' }}>📋 Top Recommendations</h3>
              <button onClick={() => navigate('/recommendations')} style={{
                background: 'none', border: 'none', color: '#166534', cursor: 'pointer',
                fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: 'inherit',
              }}>View All <ChevronRight size={14} /></button>
            </div>
            {data.recommendations.filter(r => r.priority === 'urgent').slice(0, 3).map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: '12px 16px', borderRadius: 12, marginBottom: 8,
                  background: rec.priority === 'urgent'
                    ? 'linear-gradient(135deg, rgba(254,242,242,0.8), rgba(254,226,226,0.6))'
                    : 'linear-gradient(135deg, rgba(240,253,244,0.8), rgba(220,252,231,0.6))',
                  borderLeft: `3px solid ${rec.priority === 'urgent' ? '#dc2626' : '#16a34a'}`,
                  fontSize: 13, lineHeight: 1.6, color: '#374151',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {rec.text}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ═══ Dynamic Nav Cards ═══ */}
        <motion.div variants={fadeUp}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}
        >
          {navItems.map((item, i) => (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="glass-card nav-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              style={{
                cursor: 'pointer', border: '1px solid rgba(0,0,0,0.06)',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10,
                textAlign: 'left', fontFamily: 'inherit', padding: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span className="nav-icon" style={{ fontSize: 28, display: 'block' }}>{item.icon}</span>
                <ChevronRight size={16} style={{ color: '#9ca3af' }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{item.label}</div>
              <div style={{
                padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                background: item.gradient, color: '#374151',
              }}>
                {item.stat} <span style={{ color: '#6b7280', fontWeight: 400 }}>• {item.statLabel}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      <AIChatbot />
    </div>
  );
}
