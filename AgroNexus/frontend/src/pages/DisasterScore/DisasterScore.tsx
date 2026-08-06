import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  ReferenceLine
} from 'recharts';
import { CloudRain, Thermometer, Droplets, AlertTriangle, Loader2 } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { useLanguage } from '../../context/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function DisasterScore() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetch(`${API_URL}/risk/disaster`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
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

  const signals = data.signals || {};
  const forecast = data.forecast || {};

  const rainChart = forecast.dates?.map((d: string, i: number) => ({
    date: d.slice(5),
    rain: forecast.precipitation_mm?.[i] ?? 0,
  })) || [];

  const tempChart = forecast.dates?.map((d: string, i: number) => ({
    date: d.slice(5),
    max: forecast.temp_max?.[i] ?? 0,
    min: forecast.temp_min?.[i] ?? 0,
  })) || [];

  const card: React.CSSProperties = {
    background: '#fff', borderRadius: 16, padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  };

  const signalBar = (label: string, value: number, color: string, icon: React.ReactNode) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 14 }}>
          {icon} {label}
        </span>
        <span style={{ fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: 10, borderRadius: 999, background: '#f3f4f6', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 999, background: color,
          width: `${Math.min(value, 100)}%`, transition: 'width 0.8s ease',
        }} />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8faf8' }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
          {t('disaster.title')}
        </h1>
        <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14 }}>
          {t('disaster.subtitle')} • {data.is_mock ? '⚠️ Mock data (offline)' : '✅ Live Open-Meteo data'}
        </p>

        {/* Overall Score + Signals */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
          <div style={{
            ...card, borderLeft: `4px solid ${data.risk_score >= 65 ? '#dc2626' : data.risk_score >= 40 ? '#d97706' : '#16a34a'}`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }}>
              {t('disaster.score')}
            </div>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#111827' }}>{data.risk_score}<span style={{ fontSize: 20 }}>/100</span></div>
            <div style={{
              display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontWeight: 700, fontSize: 12,
              background: data.risk_level === 'High' ? '#fef2f2' : data.risk_level === 'Medium' ? '#fffbeb' : '#f0fdf4',
              color: data.risk_level === 'High' ? '#dc2626' : data.risk_level === 'Medium' ? '#d97706' : '#16a34a',
            }}>{t(data.risk_level === 'High' ? 'band.highRisk' : data.risk_level === 'Medium' ? 'band.watch' : 'band.stable')}</div>
            <div style={{ marginTop: 8, fontSize: 13, color: '#6b7280' }}>{t('disaster.hazard')}: {data.hazard_type}</div>
          </div>

          <div style={card}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 }}>{t('disaster.signals')}</h3>
            {signalBar(t('disaster.flood'), signals.flood_risk || 0, '#3b82f6', <CloudRain size={16} color="#3b82f6" />)}
            {signalBar(t('disaster.drought'), signals.drought_risk || 0, '#eab308', <AlertTriangle size={16} color="#eab308" />)}
            {signalBar(t('disaster.heatwave'), signals.heatwave_risk || 0, '#ef4444', <Thermometer size={16} color="#ef4444" />)}
          </div>
        </div>

        {/* Rainfall Forecast Chart */}
        {rainChart.length > 0 && (
          <div style={{ ...card, marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>🌧️ 16-Day Precipitation Forecast</h3>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
              Forecast total: {signals.forecast_total_mm}mm vs seasonal normal: {signals.seasonal_normal_mm}mm
              (ratio: {signals.rainfall_ratio})
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={rainChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <ReferenceLine y={50} stroke="#dc2626" strokeDasharray="5 5" label="Flood threshold" />
                <Bar dataKey="rain" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Rain (mm)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Temperature Chart */}
        {tempChart.length > 0 && (
          <div style={{ ...card, marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>🌡️ Temperature Forecast (°C)</h3>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
              Crop heat threshold: {signals.crop_heat_threshold}°C • Max consecutive hot days: {signals.max_consecutive_hot_days}
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={tempChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <ReferenceLine y={signals.crop_heat_threshold || 36} stroke="#dc2626" strokeDasharray="5 5" label="Critical" />
                <Line type="monotone" dataKey="max" stroke="#dc2626" strokeWidth={2} name="Max Temp" />
                <Line type="monotone" dataKey="min" stroke="#3b82f6" strokeWidth={2} name="Min Temp" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Thought Process */}
        {data.thought_process && (
          <div style={{ ...card, borderLeft: '4px solid #2563eb' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700 }}>
              <AlertTriangle size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              Disaster Assessment
            </h3>
            <p style={{ margin: 0, color: '#374151', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {data.thought_process}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
