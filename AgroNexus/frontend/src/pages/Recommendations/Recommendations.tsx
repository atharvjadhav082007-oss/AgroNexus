import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, AlertTriangle, Lightbulb, Info, Loader2, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { API_URL } from '../../config';

export default function Recommendations() {
  const navigate = useNavigate();
  const cachedRecs = sessionStorage.getItem('khetseva_recs');
  const cachedDash = sessionStorage.getItem('khetseva_dashboard');
  
  const [data, setData] = useState<any>(cachedRecs ? JSON.parse(cachedRecs) : null);
  const [loading, setLoading] = useState(!cachedRecs || !cachedDash);
  const token = localStorage.getItem('token');

  const [weather, setWeather] = useState<any>(null);
  const [profile, setProfile] = useState<any>(cachedDash ? JSON.parse(cachedDash) : null);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    
    // Fetch both recommendations and profile data concurrently
    Promise.all([
      fetch(`${API_URL}/recommendations/`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_URL}/farmer/dashboard`, { headers: { Authorization: `Bearer ${token}` } }).then(r => {
        if (r.status === 401) { localStorage.removeItem('token'); sessionStorage.clear(); navigate('/login'); return null; }
        return r.json();
      })
    ]).then(([recData, dashData]) => {
      setData(recData);
      setProfile(dashData);
      sessionStorage.setItem('khetseva_recs', JSON.stringify(recData));
      if (dashData) sessionStorage.setItem('khetseva_dashboard', JSON.stringify(dashData));
      
      // Fetch live weather if we have coordinates
      const lat = dashData?.farmer?.latitude || 28.61;
      const lon = dashData?.farmer?.longitude || 77.20;
      
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=auto`)
        .then(r => r.json())
        .then(wData => setWeather(wData.current))
        .catch(console.error)
        .finally(() => setLoading(false));
        
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8faf8' }}>
      <Loader2 size={40} style={{ color: '#166534', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  const recs = data?.recommendations || [];
  const compound = data?.compound_risk;

  const priorityConfig: Record<string, { bg: string; border: string; icon: React.ReactNode; label: string }> = {
    urgent: {
      bg: '#fef2f2', border: '#fca5a5', label: 'URGENT',
      icon: <AlertTriangle size={18} style={{ color: '#dc2626' }} />,
    },
    recommended: {
      bg: '#fffbeb', border: '#fcd34d', label: 'RECOMMENDED',
      icon: <Lightbulb size={18} style={{ color: '#d97706' }} />,
    },
    informational: {
      bg: '#f0fdf4', border: '#86efac', label: 'INFO',
      icon: <Info size={18} style={{ color: '#16a34a' }} />,
    },
  };

  const categoryEmoji: Record<string, string> = {
    financial: '💰', disaster: '🌊', scheme: '🏛️', general: '📋',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faf8' }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
          <ClipboardList size={22} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          {"AI Recommendations"}
        </h1>
        <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14 }}>
          {"Personalized farming advice based on your soil, weather, and financial data."}
          {compound && ` • Compound Risk: ${compound.compound_risk}% (${compound.label})`}
        </p>

        {/* Live Weather Widget */}
        {weather && (
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            borderRadius: 16, padding: 24, marginBottom: 24,
            border: '1px solid #bbf7d0', boxShadow: '0 4px 15px rgba(22, 163, 74, 0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CloudRain size={18} /> Live Weather Report
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#15803d', fontWeight: 600 }}>
                  PIN Code: {profile?.farmer?.pin_code || 'N/A'} • Open-Meteo
                </p>
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#166534', lineHeight: 1 }}>
                {weather.temperature_2m}°C
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div style={{ background: '#fff', padding: 12, borderRadius: 12, textAlign: 'center' }}>
                <Droplets size={16} style={{ color: '#3b82f6', margin: '0 auto 4px' }} />
                <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>Humidity</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>{weather.relative_humidity_2m}%</div>
              </div>
              <div style={{ background: '#fff', padding: 12, borderRadius: 12, textAlign: 'center' }}>
                <CloudRain size={16} style={{ color: '#0ea5e9', margin: '0 auto 4px' }} />
                <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>Rainfall</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>{weather.precipitation} mm</div>
              </div>
              <div style={{ background: '#fff', padding: 12, borderRadius: 12, textAlign: 'center' }}>
                <Wind size={16} style={{ color: '#8b5cf6', margin: '0 auto 4px' }} />
                <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>Wind Speed</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>{weather.wind_speed_10m} km/h</div>
              </div>
            </div>
          </div>
        )}

        {recs.length === 0 ? (
          <div style={{
            background: '#fff', borderRadius: 16, padding: 40, textAlign: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <p style={{ color: '#6b7280' }}>No recommendations yet. Complete onboarding to get personalized advice.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {recs.map((rec: any, i: number) => {
              const config = priorityConfig[rec.priority] || priorityConfig.informational;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: config.bg, borderRadius: 14, padding: '18px 20px',
                    borderLeft: `4px solid ${config.border}`,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    {config.icon}
                    <span style={{
                      fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: 1, color: '#6b7280',
                    }}>{config.label}</span>
                    <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 'auto' }}>
                      {categoryEmoji[rec.category] || '📋'} {rec.category}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#374151' }}>
                    {rec.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
