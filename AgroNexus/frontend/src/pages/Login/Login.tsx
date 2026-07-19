import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Loader2, Phone, Lock } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const API_URL = 'http://localhost:8000/api';

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Login failed');
      localStorage.setItem('token', data.access_token);
      navigate('/dashboard');
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px 14px 44px', borderRadius: 12,
    border: '1.5px solid #d1d5db', fontSize: 15, outline: 'none',
    background: '#fafafa', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faf8' }}>
      <Navbar />
      <div style={{ maxWidth: 440, margin: '0 auto', padding: '60px 20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#fff', borderRadius: 20, padding: '40px 32px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', margin: 0 }}>
              Welcome Back
            </h1>
            <p style={{ color: '#6b7280', marginTop: 8, fontSize: 14 }}>
              Log in to view your risk dashboard
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2', color: '#b91c1c', padding: '12px 16px',
              borderRadius: 10, marginBottom: 16, fontSize: 14,
            }}>{error}</div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: 14, top: 15, color: '#9ca3af' }} />
              <input style={inputStyle} placeholder="Phone Number" value={phone}
                onChange={e => setPhone(e.target.value)} />
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 14, top: 15, color: '#9ca3af' }} />
              <input style={inputStyle} type="password" placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)} />
            </div>

            <button type="submit" disabled={loading || !phone || !password}
              style={{
                padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: '#166534', color: '#fff', fontWeight: 700, fontSize: 16,
                opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8, marginTop: 4,
              }}>
              {loading ? <Loader2 size={18} /> : <LogIn size={18} />}
              <span>{loading ? 'Logging in...' : 'Log In'}</span>
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6b7280' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#166534', fontWeight: 600, textDecoration: 'none' }}>
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
