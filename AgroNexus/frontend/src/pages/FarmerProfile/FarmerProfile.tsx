import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { User, MapPin, Sprout, Wallet, TrendingUp, Loader2 } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import PinLocation from '../../components/PinLocation';

import { API_URL } from '../../config';

export default function FarmerProfile() {
  const navigate = useNavigate();
  const cachedData = sessionStorage.getItem('khetseva_dashboard');
  let parsedCache = null;
  if (cachedData) {
    try { parsedCache = JSON.parse(cachedData); } catch (e) { console.error('Cache parse error', e); }
  }
  
  const [profile, setProfile] = useState<any>(parsedCache);
  const [history, setHistory] = useState<any[]>(parsedCache?.risk_history || []);
  const [loading, setLoading] = useState(!parsedCache);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetch(`${API_URL}/farmer/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (r.status === 401) { localStorage.removeItem('token'); sessionStorage.clear(); navigate('/login'); return null; }
        return r.json();
      })
      .then(d => {
        if (!d) return;
        setProfile(d);
        setHistory(d.risk_history || []);
        sessionStorage.setItem('khetseva_dashboard', JSON.stringify(d));
        setLoading(false);
      }).catch(() => setLoading(false));
  }, [token, navigate]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8faf8' }}>
      <Loader2 size={40} style={{ color: '#166534', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  const farmer = profile?.farmer;
  const farm = profile?.farm_details;
  const fin = profile?.financial_details;

  const trendData = [...history].reverse().map((r: any) => ({
    date: new Date(r.computed_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    compound: r.compound_risk,
    financial: r.financial_risk,
    disaster: r.disaster_risk,
  }));

  const card: React.CSSProperties = {
    background: '#fff', borderRadius: 16, padding: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 20,
  };
  const row: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', padding: '10px 0',
    borderBottom: '1px solid #f3f4f6', fontSize: 14,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faf8' }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 24 }}>
          <User size={22} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Farmer Profile
        </h1>

        {/* Identity */}
        <div style={card}>
          <h3 style={{ margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8, color: '#111827' }}>
            <MapPin size={18} style={{ color: '#166534' }} /> Identity & Location
          </h3>
          <div style={row}><span style={{ color: '#6b7280' }}>Name</span><span style={{ fontWeight: 600 }}>{farmer?.full_name}</span></div>
          <div style={row}><span style={{ color: '#6b7280' }}>Phone</span><span style={{ fontWeight: 600 }}>{farmer?.phone_number}</span></div>
          <div style={row}><span style={{ color: '#6b7280' }}>PIN Code</span><span style={{ fontWeight: 600 }}><PinLocation pin={farmer?.pin_code} /></span></div>
          <div style={row}><span style={{ color: '#6b7280' }}>Coordinates</span><span style={{ fontWeight: 600 }}>{farmer?.latitude?.toFixed(4)}°N, {farmer?.longitude?.toFixed(4)}°E</span></div>
        </div>

        {/* Farm Details */}
        {farm && (
          <div style={card}>
            <h3 style={{ margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8, color: '#111827' }}>
              <Sprout size={18} style={{ color: '#166534' }} /> Farm Details
            </h3>
            <div style={row}><span style={{ color: '#6b7280' }}>Land Size</span><span style={{ fontWeight: 600 }}>{farm.land_size_acres} acres</span></div>
            <div style={row}><span style={{ color: '#6b7280' }}>Ownership</span><span style={{ fontWeight: 600 }}>{farm.ownership_type}</span></div>
            <div style={row}><span style={{ color: '#6b7280' }}>Crops</span><span style={{ fontWeight: 600 }}>{farm.crops}</span></div>
            <div style={row}><span style={{ color: '#6b7280' }}>Season</span><span style={{ fontWeight: 600 }}>{farm.crop_season}</span></div>
            <div style={row}><span style={{ color: '#6b7280' }}>Irrigation</span><span style={{ fontWeight: 600 }}>{farm.irrigation_source}</span></div>
            <div style={row}><span style={{ color: '#6b7280' }}>Soil</span><span style={{ fontWeight: 600 }}>{farm.soil_type}</span></div>
            <div style={{ ...row, borderBottom: 'none' }}><span style={{ color: '#6b7280' }}>Experience</span><span style={{ fontWeight: 600 }}>{farm.experience_years} years</span></div>
          </div>
        )}

        {/* Financial */}
        {fin && (
          <div style={card}>
            <h3 style={{ margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8, color: '#111827' }}>
              <Wallet size={18} style={{ color: '#d97706' }} /> Financial Background
            </h3>
            <div style={row}><span style={{ color: '#6b7280' }}>Loan Amount</span><span style={{ fontWeight: 600 }}>₹{fin.loan_amount?.toLocaleString()}</span></div>
            <div style={row}><span style={{ color: '#6b7280' }}>Loan Source</span><span style={{ fontWeight: 600 }}>{fin.loan_source}</span></div>
            <div style={row}><span style={{ color: '#6b7280' }}>Insurance</span><span style={{ fontWeight: 600 }}>{fin.has_insurance ? `Yes (${fin.insurance_scheme})` : 'No'}</span></div>
            <div style={row}><span style={{ color: '#6b7280' }}>Income Band</span><span style={{ fontWeight: 600 }}>{fin.income_band}</span></div>
            <div style={row}><span style={{ color: '#6b7280' }}>Crop Loss (2 seasons)</span><span style={{ fontWeight: 600 }}>{fin.past_crop_loss ? 'Yes' : 'No'}</span></div>
            <div style={{ ...row, borderBottom: 'none' }}><span style={{ color: '#6b7280' }}>Dependents</span><span style={{ fontWeight: 600 }}>{fin.dependents}</span></div>
          </div>
        )}

        {/* Risk Trend */}
        {trendData.length > 0 && (
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8, color: '#111827' }}>
              <TrendingUp size={18} style={{ color: '#166534' }} /> Risk Score History
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="compound" stroke="#dc2626" strokeWidth={2.5} name="Compound" />
                <Line type="monotone" dataKey="financial" stroke="#d97706" strokeWidth={1.5} name="Financial" />
                <Line type="monotone" dataKey="disaster" stroke="#2563eb" strokeWidth={1.5} name="Disaster" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
