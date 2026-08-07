import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';
import { CloudRain, Thermometer, Droplets, AlertTriangle, Loader2, Wind } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { API_URL } from '../../config';

export default function DisasterScore() {
  const navigate = useNavigate();
  const cachedData = sessionStorage.getItem('khetseva_dashboard');
  const [data, setData] = useState<any>(cachedData ? JSON.parse(cachedData) : null);
  const [loading, setLoading] = useState(!cachedData);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    // Fetch dashboard data which contains latest_risk with new disaster breakdown
    fetch(`${API_URL}/farmer/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (r.status === 401) { localStorage.removeItem('token'); sessionStorage.clear(); navigate('/login'); return null; }
        return r.json();
      })
      .then(d => { 
        if (d) {
          sessionStorage.setItem('khetseva_dashboard', JSON.stringify(d));
          setData(d); 
        }
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8faf8' }}>
      <Loader2 size={40} style={{ color: '#166534', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  if (!data) return (
    <div style={{ minHeight: '100vh', background: '#f8faf8' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Complete onboarding first.</div>
    </div>
  );

  // Extract new model data from latest risk
  const risk = data.latest_risk;
  const disasterScore = risk?.disaster_risk ?? 0;

  // Parse disaster_factors_json which now contains new 4-hazard breakdown
  let breakdown: any = { flood: 0, drought: 0, storm: 0, frost_or_heat: 0, dominant_hazard: 'unknown' };
  try {
    if (risk?.disaster_factors_json) {
      breakdown = JSON.parse(risk.disaster_factors_json);
    }
  } catch {}

  const dominantHazard = breakdown.dominant_hazard || 'unknown';

  const card: React.CSSProperties = {
    background: '#fff', borderRadius: 16, padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  };

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

  const getScoreLabel = (score: number) => {
    if (score < 25) return 'Low Risk';
    if (score < 50) return 'Moderate Risk';
    if (score < 75) return 'High Risk';
    return 'Severe Risk';
  };

  const hazardBar = (label: string, value: number, color: string, icon: React.ReactNode) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 14 }}>
          {icon} {label}
        </span>
        <span style={{ fontWeight: 700, color }}>{typeof value === 'number' ? value.toFixed(1) : 0}</span>
      </div>
      <div style={{ height: 10, borderRadius: 999, background: '#f3f4f6', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 999, background: color,
          width: `${Math.min(value || 0, 100)}%`, transition: 'width 0.8s ease',
        }} />
      </div>
    </div>
  );

  // Build breakdown chart data
  const breakdownChart = [
    { name: 'Flood', value: breakdown.flood ?? 0, fill: '#3b82f6' },
    { name: 'Drought', value: breakdown.drought ?? 0, fill: '#eab308' },
    { name: 'Storm', value: breakdown.storm ?? 0, fill: '#8b5cf6' },
    { name: 'Frost/Heat', value: breakdown.frost_or_heat ?? 0, fill: '#ef4444' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8faf8' }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
          {"Disaster Risk Analysis"}
        </h1>
        <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14 }}>
          Real-time weather hazard analysis powered by Open-Meteo API • ✅ Live Data
        </p>

        {/* Overall Score + Hazard Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
          <div style={{
            ...card, borderLeft: `4px solid ${getScoreColor(disasterScore)}`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }}>
              Disaster Risk Score
            </div>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#111827' }}>
              {typeof disasterScore === 'number' ? disasterScore.toFixed(1) : 0}
              <span style={{ fontSize: 20 }}>/100</span>
            </div>
            <div style={{
              display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontWeight: 700, fontSize: 12,
              background: getScoreBg(disasterScore),
              color: getScoreColor(disasterScore),
            }}>{getScoreLabel(disasterScore)}</div>
            <div style={{ marginTop: 8, fontSize: 13, color: '#6b7280' }}>
              Dominant Hazard: <strong style={{ textTransform: 'capitalize' }}>{dominantHazard.replace('_', ' ')}</strong>
            </div>
            <div style={{ marginTop: 4, fontSize: 11, color: '#9ca3af' }}>
              Formula: 65% × max(hazard) + 35% × avg(all hazards)
            </div>
          </div>

          <div style={card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Weather Hazard Breakdown</h3>
            {hazardBar('Flood Risk', breakdown.flood ?? 0, '#3b82f6', <CloudRain size={16} color="#3b82f6" />)}
            {hazardBar('Drought Risk', breakdown.drought ?? 0, '#eab308', <Droplets size={16} color="#eab308" />)}
            {hazardBar('Storm Risk', breakdown.storm ?? 0, '#8b5cf6', <Wind size={16} color="#8b5cf6" />)}
            {hazardBar('Frost / Heat Risk', breakdown.frost_or_heat ?? 0, '#ef4444', <Thermometer size={16} color="#ef4444" />)}
          </div>
        </div>

        {/* Hazard Comparison Bar Chart */}
        <div style={{ ...card, marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>🌡️ Hazard Sub-Score Comparison</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={breakdownChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: any) => [Number(value).toFixed(1), 'Score']} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} name="Score">
                {breakdownChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Explainer */}
        <div style={{ ...card, borderLeft: '4px solid #2563eb' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700 }}>
            <AlertTriangle size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            How This Score Is Calculated
          </h3>
          <p style={{ margin: 0, color: '#374151', fontSize: 14, lineHeight: 1.7 }}>
            Your disaster risk score is computed from a <strong>3-day hourly weather forecast</strong> fetched live from the 
            Open-Meteo API for your registered PIN code location. Four independent hazard sub-scores are calculated:
          </p>
          <ul style={{ margin: '12px 0 0', paddingLeft: 20, color: '#374151', fontSize: 13, lineHeight: 2 }}>
            <li><strong style={{ color: '#3b82f6' }}>Flood</strong> — Based on cumulative rainfall, shower intensity, and soil moisture saturation</li>
            <li><strong style={{ color: '#eab308' }}>Drought</strong> — Based on evapotranspiration (ET0), vapour pressure deficit, and soil dryness</li>
            <li><strong style={{ color: '#8b5cf6' }}>Storm</strong> — Based on maximum wind gusts and severe weather codes (thunderstorms, heavy rain)</li>
            <li><strong style={{ color: '#ef4444' }}>Frost/Heat</strong> — Based on temperature drops below 5°C (frost) or apparent temperature above 35°C (heat stress)</li>
          </ul>
          <p style={{ margin: '12px 0 0', color: '#374151', fontSize: 14, lineHeight: 1.7 }}>
            The overall score = <strong>65% × highest hazard + 35% × average of all four</strong>. 
            The dominant hazard for your area is currently <strong style={{ textTransform: 'capitalize' }}>{dominantHazard.replace('_', ' ')}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
