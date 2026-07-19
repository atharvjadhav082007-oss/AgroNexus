import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
  AlertTriangle, Shield, TrendingUp, CloudRain, Wallet, RefreshCw, Loader2,
  ChevronRight, LogOut
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import type { DashboardData } from '../../types';
import { getRiskBandColor, getRiskBandBg } from '../../types';

const API_URL = 'http://localhost:8000/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recomputing, setRecomputing] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchDashboard = async () => {
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
  };

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

  useEffect(() => { fetchDashboard(); }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8faf8' }}>
      <Loader2 size={40} style={{ color: '#166534', animation: 'spin 1s linear infinite' }} />
    </div>
  );

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

  const risk = data.latest_risk;
  const compound = risk?.compound_risk ?? 0;
  const label = risk?.compound_label ?? 'Unknown';
  const bandColor = getRiskBandColor(label);
  const isCritical = label === 'Critical';

  // Prepare forecast chart data
  const forecastChart = data.forecast_data?.dates?.map((date: string, i: number) => ({
    date: date.slice(5),  // MM-DD
    rain: data.forecast_data?.precipitation_mm?.[i] ?? 0,
    maxT: data.forecast_data?.temp_max?.[i] ?? 0,
    minT: data.forecast_data?.temp_min?.[i] ?? 0,
  })) ?? [];

  // Risk history for trend
  const trendData = [...(data.risk_history || [])].reverse().map(r => ({
    date: new Date(r.computed_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    financial: r.financial_risk,
    disaster: r.disaster_risk,
    compound: r.compound_risk,
  }));

  const cardStyle: React.CSSProperties = {
    background: '#fff', borderRadius: 16, padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faf8' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: 0 }}>
              Namaste, {data.farmer.full_name} 🙏
            </h1>
            <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: 14 }}>
              PIN: {data.farmer.pin_code} • {data.farmer.latitude?.toFixed(2)}°N, {data.farmer.longitude?.toFixed(2)}°E
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleRecompute} disabled={recomputing} style={{
              padding: '10px 18px', borderRadius: 10, border: '1.5px solid #d1d5db',
              background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <RefreshCw size={14} className={recomputing ? 'animate-spin' : ''} /> Refresh Risk
            </button>
            <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} style={{
              padding: '10px 18px', borderRadius: 10, border: '1.5px solid #fecaca',
              background: '#fff', cursor: 'pointer', color: '#dc2626', fontWeight: 600,
              fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Critical Alert Banner */}
        {isCritical && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: '#fff',
              padding: '18px 24px', borderRadius: 14, marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 14,
            }}
          >
            <AlertTriangle size={28} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>⚠️ POSSIBLE CRISIS WITHIN 15 DAYS</div>
              <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>
                Your compound vulnerability is {compound}%. Financial fragility and disaster exposure are both elevated. Immediate action recommended.
              </div>
            </div>
          </motion.div>
        )}

        {/* Risk Overview Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          {/* Compound Risk */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ ...cardStyle, border: `2px solid ${bandColor}`, background: getRiskBandBg(label) }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1 }}>Compound Risk</div>
            <div style={{ fontSize: 42, fontWeight: 900, color: bandColor, margin: '8px 0 4px' }}>{compound}%</div>
            <div style={{
              display: 'inline-block', padding: '4px 12px', borderRadius: 999,
              background: bandColor, color: '#fff', fontWeight: 700, fontSize: 12,
            }}>{label}</div>
          </motion.div>

          {/* Financial Risk */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Wallet size={18} style={{ color: '#d97706' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Financial Risk</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#111827' }}>{risk?.financial_risk ?? '—'}<span style={{ fontSize: 16, color: '#9ca3af' }}>/100</span></div>
          </motion.div>

          {/* Disaster Risk */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <CloudRain size={18} style={{ color: '#2563eb' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Disaster Risk</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#111827' }}>{risk?.disaster_risk ?? '—'}<span style={{ fontSize: 16, color: '#9ca3af' }}>/100</span></div>
          </motion.div>

          {/* Farm Info */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={cardStyle}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>Farm</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>{data.farm_details?.crops || '—'}</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
              {data.farm_details?.land_size_acres} acres • {data.farm_details?.ownership_type} • {data.farm_details?.irrigation_source}
            </div>
          </motion.div>
        </div>

        {/* XAI Explanation */}
        {risk?.xai_explanation && (
          <div style={{ ...cardStyle, marginBottom: 24, borderLeft: `4px solid ${bandColor}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Shield size={18} style={{ color: '#166534' }} />
              <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>Why is my risk {label}?</span>
            </div>
            <p style={{ margin: 0, color: '#374151', fontSize: 14, lineHeight: 1.6 }}>{risk.xai_explanation}</p>
          </div>
        )}

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20, marginBottom: 24 }}>
          {/* 15-day Rainfall Chart */}
          {forecastChart.length > 0 && (
            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#111827' }}>
                🌧️ 15-Day Rainfall Forecast (mm)
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={forecastChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="rain" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Risk Trend Chart */}
          {trendData.length > 1 && (
            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#111827' }}>
                <TrendingUp size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Risk Score Trend
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="compound" stroke="#dc2626" strokeWidth={2.5} dot={{ r: 4 }} name="Compound" />
                  <Line type="monotone" dataKey="financial" stroke="#d97706" strokeWidth={1.5} dot={{ r: 3 }} name="Financial" />
                  <Line type="monotone" dataKey="disaster" stroke="#2563eb" strokeWidth={1.5} dot={{ r: 3 }} name="Disaster" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Quick Recommendations */}
        {data.recommendations.length > 0 && (
          <div style={{ ...cardStyle, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111827' }}>📋 Top Recommendations</h3>
              <button onClick={() => navigate('/recommendations')} style={{
                background: 'none', border: 'none', color: '#166534', cursor: 'pointer',
                fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4,
              }}>View All <ChevronRight size={14} /></button>
            </div>
            {data.recommendations.filter(r => r.priority === 'urgent').slice(0, 3).map((rec, i) => (
              <div key={i} style={{
                padding: '12px 16px', borderRadius: 10, marginBottom: 8,
                background: rec.priority === 'urgent' ? '#fef2f2' : '#f0fdf4',
                borderLeft: `3px solid ${rec.priority === 'urgent' ? '#dc2626' : '#16a34a'}`,
                fontSize: 13, lineHeight: 1.5, color: '#374151',
              }}>
                {rec.text}
              </div>
            ))}
          </div>
        )}

        {/* Nav Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {[
            { label: 'Farmer Profile', path: '/farmer-profile', icon: '👤' },
            { label: 'Disaster Score', path: '/disaster-score', icon: '🌊' },
            { label: 'Recommendations', path: '/recommendations', icon: '📋' },
            { label: 'Govt Schemes', path: '/government-schemes', icon: '🏛️' },
            { label: 'Financial Solutions', path: '/financial-solutions', icon: '💹' },
          ].map(item => (
            <button key={item.path} onClick={() => navigate(item.path)} style={{
              ...cardStyle, cursor: 'pointer', border: '1.5px solid #e5e7eb',
              display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600,
              fontSize: 14, color: '#111827', transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              {item.label}
              <ChevronRight size={16} style={{ marginLeft: 'auto', color: '#9ca3af' }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
