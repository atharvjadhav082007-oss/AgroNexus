import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Landmark, ExternalLink, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { useLanguage } from '../../context/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://khetseva-backend-ki7y.onrender.com/api';

export default function GovernmentSchemes() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetch(`${API_URL}/farmer/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        setSchemes(d.eligible_schemes || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8faf8' }}>
      <Loader2 size={40} style={{ color: '#166534', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    'Eligible now': {
      color: '#16a34a', bg: '#f0fdf4',
      icon: <CheckCircle size={20} style={{ color: '#16a34a' }} />,
    },
    'Not eligible': {
      color: '#dc2626', bg: '#fef2f2',
      icon: <XCircle size={20} style={{ color: '#dc2626' }} />,
    },
    'Conditionally eligible': {
      color: '#d97706', bg: '#fffbeb',
      icon: <AlertCircle size={20} style={{ color: '#d97706' }} />,
    },
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faf8' }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
          <Landmark size={22} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          {t('schemes.title')}
        </h1>
        <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14 }}>
          {t('schemes.subtitle')}
        </p>

        {schemes.length === 0 ? (
          <div style={{
            background: '#fff', borderRadius: 16, padding: 40, textAlign: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <p style={{ color: '#6b7280' }}>Complete onboarding to check scheme eligibility.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 16 }}>
            {schemes.map((scheme: any, i: number) => {
              const config = statusConfig[scheme.status] || statusConfig['Conditionally eligible'];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: '#fff', borderRadius: 16, padding: 24,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    border: `1.5px solid ${scheme.status === 'Eligible now' ? '#bbf7d0' : '#e5e7eb'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    {config.icon}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' }}>
                        {scheme.name}
                      </h3>
                      <div style={{
                        display: 'inline-block', marginTop: 6, padding: '3px 10px',
                        borderRadius: 999, fontSize: 11, fontWeight: 700,
                        background: config.bg, color: config.color,
                      }}>
                        {scheme.status}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    marginTop: 14, padding: '10px 14px', borderRadius: 10,
                    background: '#f8fafc', fontSize: 13, color: '#166534', fontWeight: 600,
                  }}>
                    💰 {scheme.benefit}
                  </div>

                  <p style={{ margin: '12px 0 0', fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
                    {scheme.reason}
                  </p>

                  {scheme.apply_url && (
                    <a href={scheme.apply_url} target="_blank" rel="noopener noreferrer" style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14,
                      padding: '8px 16px', borderRadius: 8, background: '#166534', color: '#fff',
                      fontSize: 13, fontWeight: 600, textDecoration: 'none',
                    }}>
                      Apply Now <ExternalLink size={14} />
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
