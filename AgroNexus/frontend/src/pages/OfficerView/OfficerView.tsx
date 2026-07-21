import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Loader2 } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { getRiskBandColor } from '../../types';

const API_URL = 'http://localhost:8000/api';

export default function OfficerView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/government/dashboard`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8faf8' }}>
      <Loader2 size={40} style={{ color: '#166534', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  const card: React.CSSProperties = {
    background: '#fff', borderRadius: 16, padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faf8' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 24 }}>
          <Users size={22} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Officer / NGO Dashboard
        </h1>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Farmers', value: data?.total_farmers ?? 0, color: '#111827' },
            { label: 'Critical', value: data?.critical_count ?? 0, color: '#dc2626' },
            { label: 'High Risk', value: data?.high_count ?? 0, color: '#ea580c' },
            { label: 'Watch', value: data?.watch_count ?? 0, color: '#d97706' },
            { label: 'Stable', value: data?.stable_count ?? 0, color: '#16a34a' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }} style={card}>
              <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: item.color }}>{item.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Farmer Table */}
        <div style={{ ...card, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                {['Name', 'PIN Code', 'Crop', 'Land', 'Financial', 'Disaster', 'Compound', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 10px', color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data?.farmers || [])
                .sort((a: any, b: any) => (b.compound_score ?? 0) - (a.compound_score ?? 0))
                .map((f: any, i: number) => (
                <motion.tr key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 600 }}>{f.full_name}</td>
                  <td style={{ padding: '12px 10px' }}>{f.pin_code}</td>
                  <td style={{ padding: '12px 10px' }}>{f.primary_crop || '—'}</td>
                  <td style={{ padding: '12px 10px' }}>{f.land_size_acres ? `${f.land_size_acres} ac` : '—'}</td>
                  <td style={{ padding: '12px 10px' }}>{f.financial_risk ?? '—'}</td>
                  <td style={{ padding: '12px 10px' }}>{f.disaster_risk ?? '—'}</td>
                  <td style={{ padding: '12px 10px', fontWeight: 700 }}>{f.compound_score ?? '—'}%</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: 999,
                      fontSize: 11, fontWeight: 700,
                      background: getRiskBandColor(f.compound_label || '') + '18',
                      color: getRiskBandColor(f.compound_label || ''),
                    }}>{f.compound_label || '—'}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
