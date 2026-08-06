import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, DollarSign, TrendingDown } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { useLanguage } from '../../context/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function FinancialSolutions() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState('500000');
  const token = localStorage.getItem('token');

  const runOptimization = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/government/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget: parseFloat(budget) || 500000 }),
      });
      const d = await res.json();
      setData(d);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const card: React.CSSProperties = {
    background: '#fff', borderRadius: 16, padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faf8' }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
          {t('fin.title')}
        </h1>
        <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14 }}>
          {t('fin.subtitle')}
        </p>

        <div style={{ ...card, marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>Set Relief Budget</h3>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input type="number" value={budget} onChange={e => setBudget(e.target.value)} style={{
              flex: 1, padding: '12px 16px', borderRadius: 10, border: '1.5px solid #d1d5db',
              fontSize: 15, outline: 'none',
            }} />
            <button onClick={runOptimization} disabled={loading} style={{
              padding: '12px 24px', borderRadius: 10, border: 'none', background: '#166534',
              color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {loading ? <Loader2 size={16} /> : <TrendingDown size={16} />}
              {loading ? 'Optimizing...' : 'Run Optimization'}
            </button>
          </div>
        </div>

        {data && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              <div style={card}>
                <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Budget</div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>₹{data.total_budget?.toLocaleString()}</div>
              </div>
              <div style={card}>
                <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Spent</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#166534' }}>₹{data.total_spent?.toLocaleString()}</div>
              </div>
              <div style={card}>
                <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Risk Reduced</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#2563eb' }}>{data.total_mitigated_score} pts</div>
              </div>
            </div>

            {data.allocations?.length > 0 && (
              <div style={card}>
                <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Allocations</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ textAlign: 'left', padding: '10px 8px', color: '#6b7280' }}>Farmer</th>
                      <th style={{ textAlign: 'left', padding: '10px 8px', color: '#6b7280' }}>Intervention</th>
                      <th style={{ textAlign: 'right', padding: '10px 8px', color: '#6b7280' }}>Cost</th>
                      <th style={{ textAlign: 'right', padding: '10px 8px', color: '#6b7280' }}>Risk ↓</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.allocations.map((a: any, i: number) => (
                      <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                        style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '10px 8px', fontWeight: 600 }}>{a.farmer_name}</td>
                        <td style={{ padding: '10px 8px' }}>{a.intervention}</td>
                        <td style={{ padding: '10px 8px', textAlign: 'right' }}>₹{a.cost?.toLocaleString()}</td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>-{a.risk_mitigated}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
