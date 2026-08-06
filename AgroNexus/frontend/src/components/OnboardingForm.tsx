import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Sprout, Wallet, ArrowRight, ArrowLeft, Check, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://khetseva-backend-ki7y.onrender.com/api';

const extractErrorMessage = (data: any): string => {
  if (!data) return 'An unexpected error occurred';
  if (typeof data.detail === 'string') {
    return data.detail;
  }
  if (Array.isArray(data.detail)) {
    return data.detail.map((err: any) => {
      const field = err.loc ? err.loc[err.loc.length - 1] : '';
      const msg = err.msg || 'Invalid value';
      return field ? `${field}: ${msg}` : msg;
    }).join(', ');
  }
  if (data.message) {
    return data.message;
  }
  return 'An unexpected error occurred';
};

export default function OnboardingForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  // Step 1: Identity
  const [s1, setS1] = useState({
    fullName: '', phoneNumber: '', password: '', pinCode: '',
    latitude: null as number | null, longitude: null as number | null,
  });
  const [geoStatus, setGeoStatus] = useState<'idle' | 'fetching' | 'success' | 'error'>('idle');

  // Step 2: Farm
  const [s2, setS2] = useState({
    landSizeAcres: '', ownershipType: 'owned', crops: 'Rice (Paddy)',
    cropSeason: 'Kharif', irrigationSource: 'rainfed', soilType: 'alluvial',
    experienceYears: '',
  });

  // Step 3: Financial
  const [s3, setS3] = useState({
    loanAmount: '0', loanSource: 'none', hasInsurance: false,
    insuranceScheme: '', incomeBand: '1-3L', pastCropLoss: false, dependents: '2',
  });

  const handleGetLocation = () => {
    if (!navigator.geolocation) { setGeoStatus('error'); return; }
    setGeoStatus('fetching');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setS1(p => ({ ...p, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
        setGeoStatus('success');
      },
      () => setGeoStatus('error'),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  // Step 1: Register
  const handleStep1 = async () => {
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: s1.fullName.trim(),
          phone_number: s1.phoneNumber.replace(/\s+/g, ''),
          password: s1.password,
          pin_code: s1.pinCode.replace(/\s+/g, ''),
          latitude: s1.latitude,
          longitude: s1.longitude,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(extractErrorMessage(data));
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      setStep(2);
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  // Step 2: Farm details
  const handleStep2 = async () => {
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/farmer/onboarding/2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          land_size_acres: parseFloat(s2.landSizeAcres) || 1.0,
          ownership_type: s2.ownershipType, crops: s2.crops,
          crop_season: s2.cropSeason, irrigation_source: s2.irrigationSource,
          soil_type: s2.soilType, experience_years: parseInt(s2.experienceYears) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(extractErrorMessage(data));
      setStep(3);
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  // Step 3: Financial + Run agents
  const handleStep3 = async () => {
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/farmer/onboarding/3`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          loan_amount: parseFloat(s3.loanAmount) || 0,
          loan_source: s3.loanSource, has_insurance: s3.hasInsurance,
          insurance_scheme: s3.hasInsurance ? s3.insuranceScheme : null,
          income_band: s3.incomeBand, past_crop_loss: s3.pastCropLoss,
          dependents: parseInt(s3.dependents) || 1,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(extractErrorMessage(data));
      navigate('/dashboard');
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  const stepIcons = [
    <MapPin size={20} />, <Sprout size={20} />, <Wallet size={20} />
  ];
  const stepTitles = ['Identity & Location', 'Farm Details', 'Financial Background'];

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '1.5px solid #d1d5db', fontSize: '15px', outline: 'none',
    transition: 'border-color 0.2s', background: '#fafafa',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '6px', fontWeight: 600,
    fontSize: '13px', color: '#374151',
  };
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' };

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '20px' }}>
      {/* Step Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 999,
            background: step === i ? '#166534' : step > i ? '#bbf7d0' : '#f3f4f6',
            color: step === i ? '#fff' : step > i ? '#166534' : '#9ca3af',
            fontWeight: 600, fontSize: 13, transition: 'all 0.3s',
          }}>
            {step > i ? <Check size={16} /> : stepIcons[i - 1]}
            <span style={{ display: window.innerWidth > 500 ? 'inline' : 'none' }}>{stepTitles[i - 1]}</span>
          </div>
        ))}
      </div>

      {error && (
        <div style={{
          background: '#fef2f2', color: '#b91c1c', padding: '12px 16px',
          borderRadius: 10, marginBottom: 16, fontSize: 14,
        }}>{error}</div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          {/* ── STEP 1: Identity ── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{ margin: 0, fontSize: 22, color: '#111827' }}>👤 Identity & Location</h2>
              <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Basic information to create your account</p>

              <div>
                <label style={labelStyle}>Full Name</label>
                <input style={inputStyle} placeholder="Enter your full name" value={s1.fullName}
                  onChange={e => setS1(p => ({ ...p, fullName: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input style={inputStyle} placeholder="10-digit mobile number" value={s1.phoneNumber}
                  onChange={e => setS1(p => ({ ...p, phoneNumber: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>PIN Code</label>
                <input style={inputStyle} placeholder="6-digit PIN code" maxLength={6} value={s1.pinCode}
                  onChange={e => setS1(p => ({ ...p, pinCode: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input style={inputStyle} type="password" placeholder="Create a password" value={s1.password}
                  onChange={e => setS1(p => ({ ...p, password: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>GPS Location</label>
                <button onClick={handleGetLocation} style={{
                  padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: geoStatus === 'success' ? '#dcfce7' : '#f0fdf4',
                  color: '#166534', fontWeight: 600, fontSize: 14,
                }}>
                  <MapPin size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  {geoStatus === 'fetching' ? 'Detecting...' :
                   geoStatus === 'success' ? `📍 ${s1.latitude?.toFixed(4)}, ${s1.longitude?.toFixed(4)}` :
                   'Detect My Location'}
                </button>
              </div>

              <button onClick={handleStep1} disabled={loading || !s1.fullName || !s1.phoneNumber || !s1.password || !s1.pinCode}
                style={{
                  padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: '#166534', color: '#fff', fontWeight: 700, fontSize: 16,
                  opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8,
                }}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Continue</span><ArrowRight size={18} /></>}
              </button>
            </div>
          )}

          {/* ── STEP 2: Farm Details ── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{ margin: 0, fontSize: 22, color: '#111827' }}>🌾 Farm & Agriculture</h2>
              <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Tell us about your farming operation</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Land Size (acres)</label>
                  <input style={inputStyle} type="number" step="0.5" placeholder="e.g. 2.5" value={s2.landSizeAcres}
                    onChange={e => setS2(p => ({ ...p, landSizeAcres: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Ownership</label>
                  <select style={selectStyle} value={s2.ownershipType}
                    onChange={e => setS2(p => ({ ...p, ownershipType: e.target.value }))}>
                    <option value="owned">Owned</option>
                    <option value="leased">Leased</option>
                    <option value="sharecropper">Sharecropper</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Primary Crop</label>
                <select style={selectStyle} value={s2.crops}
                  onChange={e => setS2(p => ({ ...p, crops: e.target.value }))}>
                  {['Rice (Paddy)', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Pulses', 'Vegetables', 'Fruits'].map(c =>
                    <option key={c} value={c}>{c}</option>
                  )}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Season</label>
                  <select style={selectStyle} value={s2.cropSeason}
                    onChange={e => setS2(p => ({ ...p, cropSeason: e.target.value }))}>
                    <option value="Kharif">Kharif</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Irrigation</label>
                  <select style={selectStyle} value={s2.irrigationSource}
                    onChange={e => setS2(p => ({ ...p, irrigationSource: e.target.value }))}>
                    <option value="rainfed">Rainfed</option>
                    <option value="canal">Canal</option>
                    <option value="borewell">Borewell</option>
                    <option value="drip">Drip</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Soil Type</label>
                  <select style={selectStyle} value={s2.soilType}
                    onChange={e => setS2(p => ({ ...p, soilType: e.target.value }))}>
                    {['alluvial', 'black', 'red', 'laterite', 'sandy'].map(s =>
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Years Farming</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 10" value={s2.experienceYears}
                    onChange={e => setS2(p => ({ ...p, experienceYears: e.target.value }))} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(1)} style={{
                  flex: 1, padding: '14px', borderRadius: 12, border: '2px solid #d1d5db',
                  background: '#fff', cursor: 'pointer', fontWeight: 600, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button onClick={handleStep2} disabled={loading || !s2.landSizeAcres}
                  style={{
                    flex: 2, padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: '#166534', color: '#fff', fontWeight: 700, fontSize: 16,
                    opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 8,
                  }}>
                  {loading ? <Loader2 size={18} /> : <><span>Continue</span><ArrowRight size={18} /></>}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Financial ── */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{ margin: 0, fontSize: 22, color: '#111827' }}>💰 Financial Background</h2>
              <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>This data stays private — used only for risk analysis</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Loan Amount (₹)</label>
                  <input style={inputStyle} type="number" placeholder="0" value={s3.loanAmount}
                    onChange={e => setS3(p => ({ ...p, loanAmount: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Loan Source</label>
                  <select style={selectStyle} value={s3.loanSource}
                    onChange={e => setS3(p => ({ ...p, loanSource: e.target.value }))}>
                    <option value="none">No Loan</option>
                    <option value="bank">Bank</option>
                    <option value="kcc">KCC</option>
                    <option value="moneylender">Moneylender</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Income Band (Annual)</label>
                <select style={selectStyle} value={s3.incomeBand}
                  onChange={e => setS3(p => ({ ...p, incomeBand: e.target.value }))}>
                  <option value="<1L">Below ₹1 Lakh</option>
                  <option value="1-3L">₹1 - 3 Lakh</option>
                  <option value="3-5L">₹3 - 5 Lakh</option>
                  <option value="5L+">Above ₹5 Lakh</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Dependents</label>
                <input style={inputStyle} type="number" min="0" value={s3.dependents}
                  onChange={e => setS3(p => ({ ...p, dependents: e.target.value }))} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={s3.hasInsurance}
                    onChange={e => setS3(p => ({ ...p, hasInsurance: e.target.checked }))}
                    style={{ width: 18, height: 18, accentColor: '#166534' }} />
                  <span style={{ fontWeight: 500, fontSize: 14 }}>I have crop insurance</span>
                </label>
                {s3.hasInsurance && (
                  <select style={{ ...selectStyle, marginLeft: 28 }} value={s3.insuranceScheme}
                    onChange={e => setS3(p => ({ ...p, insuranceScheme: e.target.value }))}>
                    <option value="">Select scheme</option>
                    <option value="PMFBY">PMFBY</option>
                    <option value="private">Private Insurance</option>
                    <option value="other">Other</option>
                  </select>
                )}

                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={s3.pastCropLoss}
                    onChange={e => setS3(p => ({ ...p, pastCropLoss: e.target.checked }))}
                    style={{ width: 18, height: 18, accentColor: '#166534' }} />
                  <span style={{ fontWeight: 500, fontSize: 14 }}>Crop loss in last 2 seasons</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(2)} style={{
                  flex: 1, padding: '14px', borderRadius: 12, border: '2px solid #d1d5db',
                  background: '#fff', cursor: 'pointer', fontWeight: 600, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button onClick={handleStep3} disabled={loading}
                  style={{
                    flex: 2, padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: '#166534', color: '#fff', fontWeight: 700, fontSize: 16,
                    opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 8,
                  }}>
                  {loading ? (
                    <><Loader2 size={18} /><span>Analyzing Risk...</span></>
                  ) : (
                    <><Check size={18} /><span>Complete & Analyze</span></>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
