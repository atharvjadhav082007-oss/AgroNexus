import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, AlertTriangle, Lightbulb, Info, Loader2 } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';

const API_URL = 'http://localhost:8000/api';

export default function Recommendations() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetch(`${API_URL}/recommendations/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
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
          Recommendations
        </h1>
        <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14 }}>
          Personalized actions based on your risk profile
          {compound && ` • Compound Risk: ${compound.compound_risk}% (${compound.label})`}
        </p>

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
