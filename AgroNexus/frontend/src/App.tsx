import { useState, useEffect, useCallback } from 'react';
import OnboardingForm from './components/OnboardingForm';
import type {
  DashboardData,
  EligibleScheme,
  GovernmentDashboard,
  OptimizationResult,
  FarmerOverviewItem,
} from './types';

const API_URL = 'http://localhost:8000/api';

// ─────────────────────────────────────────────
// Utility Helpers
// ─────────────────────────────────────────────

function getRiskColors(level?: string) {
  switch (level) {
    case 'High':
    case 'Critical':
      return {
        bg: 'rgba(239,68,68,0.08)',
        border: '#fca5a5',
        badge: 'linear-gradient(135deg,#ef4444,#dc2626)',
        text: '#dc2626',
        glow: 'rgba(239,68,68,0.2)',
      };
    case 'Medium':
    case 'Warning':
      return {
        bg: 'rgba(245,158,11,0.08)',
        border: '#fcd34d',
        badge: 'linear-gradient(135deg,#f59e0b,#d97706)',
        text: '#d97706',
        glow: 'rgba(245,158,11,0.2)',
      };
    default:
      return {
        bg: 'rgba(16,185,129,0.08)',
        border: '#6ee7b7',
        badge: 'linear-gradient(135deg,#10b981,#059669)',
        text: '#059669',
        glow: 'rgba(16,185,129,0.2)',
      };
  }
}

function RiskBadge({ level }: { level?: string }) {
  const c = getRiskColors(level);
  return (
    <span
      style={{
        background: c.badge,
        color: '#fff',
        padding: '3px 12px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
      }}
    >
      {level ?? 'N/A'}
    </span>
  );
}

function AiBadge({ powered }: { powered: boolean }) {
  return (
    <span
      style={{
        background: powered
          ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
          : 'linear-gradient(135deg,#64748b,#475569)',
        color: '#fff',
        padding: '2px 10px',
        borderRadius: 20,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.06em',
      }}
    >
      {powered ? '🤖 AI POWERED' : '⚙️ RULE ENGINE'}
    </span>
  );
}

// Animated thinking dots
function ThinkingDots() {
  return (
    <span className="thinking-dots">
      <span>.</span><span>.</span><span>.</span>
    </span>
  );
}

// ─────────────────────────────────────────────
// Agent Card Component
// ─────────────────────────────────────────────

interface AgentCardProps {
  agentNumber: number;
  agentName: string;
  icon: string;
  riskLevel?: string;
  riskScore?: number;
  isAiPowered?: boolean;
  reasoning?: string;
  children?: React.ReactNode;
  delay?: number;
}

function AgentCard({
  agentNumber,
  agentName,
  icon,
  riskLevel,
  riskScore,
  isAiPowered,
  reasoning,
  children,
  delay = 0,
}: AgentCardProps) {
  const c = getRiskColors(riskLevel);
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="agent-card"
      style={{
        background: '#ffffff08',
        border: `1px solid ${c.border}40`,
        borderRadius: 20,
        padding: 24,
        boxShadow: `0 0 30px ${c.glow}`,
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Agent Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${c.glow}, ${c.border}30)`,
              border: `1px solid ${c.border}60`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 2 }}>
              AGENT {agentNumber}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{agentName}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <AiBadge powered={!!isAiPowered} />
          {riskLevel && <RiskBadge level={riskLevel} />}
          {riskScore !== undefined && (
            <span style={{ fontSize: 11, color: c.text, fontWeight: 700 }}>
              Score: {riskScore}%
            </span>
          )}
        </div>
      </div>

      {/* Custom content slot */}
      {children && <div style={{ marginBottom: 16 }}>{children}</div>}

      {/* AI Reasoning Section */}
      {reasoning && (
        <div
          style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              width: '100%',
              padding: '10px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            <span>💬 {isAiPowered ? 'AI Agent Reasoning' : 'Rule Engine Analysis'}</span>
            <span style={{ transition: 'transform 0.3s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
          </button>
          {expanded && (
            <div
              style={{
                padding: '0 16px 16px',
                color: '#cbd5e1',
                fontSize: 13,
                lineHeight: 1.7,
                borderTop: '1px solid #1e293b',
                paddingTop: 12,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {reasoning}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Scheme Card Component
// ─────────────────────────────────────────────

function SchemeCard({ scheme }: { scheme: EligibleScheme }) {
  const typeColors: Record<string, string> = {
    'Direct Cash Benefit': '#10b981',
    'Crop Insurance': '#3b82f6',
    'Debt Relief & Moratorium': '#f59e0b',
    'Technology Subsidy': '#8b5cf6',
    'Advisory & Input Subsidy': '#06b6d4',
  };
  const color = typeColors[scheme.type] || '#64748b';

  return (
    <div
      style={{
        background: '#0f172a',
        border: `1px solid ${color}30`,
        borderRadius: 14,
        padding: '14px 16px',
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{scheme.name}</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color,
            background: `${color}18`,
            padding: '2px 8px',
            borderRadius: 10,
            whiteSpace: 'nowrap' as const,
            marginLeft: 8,
          }}
        >
          {scheme.value}
        </span>
      </div>
      <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>{scheme.description}</div>
      <div style={{ fontSize: 10, color, marginTop: 6, fontWeight: 600 }}>{scheme.type}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Circular Gauge Component
// ─────────────────────────────────────────────

function CircularGauge({ value, size = 120, label }: { value: number; size?: number; label: string }) {
  const c = getRiskColors(value > 70 ? 'High' : value > 40 ? 'Medium' : 'Low');
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * value) / 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#1e293b" strokeWidth={10} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={c.text}
          strokeWidth={10}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s ease-in-out, stroke 0.3s' }}
        />
      </svg>
      <div style={{ marginTop: -size * 0.6, textAlign: 'center' }}>
        <div style={{ fontSize: size * 0.22, fontWeight: 800, color: c.text }}>{value}%</div>
      </div>
      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textAlign: 'center' }}>{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Government Panel
// ─────────────────────────────────────────────

function GovernmentPanel() {
  const [govData, setGovData] = useState<GovernmentDashboard | null>(null);
  const [budget, setBudget] = useState('200000');
  const [optResult, setOptResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [optLoading, setOptLoading] = useState(false);
  const [reasoning, setReasoning] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/government/dashboard`)
      .then((r) => r.json())
      .then(setGovData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const runOptimization = async () => {
    setOptLoading(true);
    setOptResult(null);
    try {
      const res = await fetch(`${API_URL}/government/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget: parseFloat(budget) }),
      });
      const data = await res.json();
      setOptResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setOptLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div className="spinner" />
        <p style={{ color: '#64748b', marginTop: 16 }}>Loading government dashboard...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Farmers', value: govData?.total_farmers ?? 0, color: '#6366f1', icon: '👨‍🌾' },
    { label: 'Critical', value: govData?.critical_count ?? 0, color: '#ef4444', icon: '🔴' },
    { label: 'Warning', value: govData?.warning_count ?? 0, color: '#f59e0b', icon: '🟡' },
    { label: 'Safe', value: govData?.safe_count ?? 0, color: '#10b981', icon: '🟢' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {statCards.map((s) => (
          <div
            key={s.label}
            style={{
              background: `${s.color}10`,
              border: `1px solid ${s.color}30`,
              borderRadius: 16,
              padding: '20px 16px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Farmer Registry Table */}
      <div
        style={{
          background: '#ffffff08',
          border: '1px solid #1e293b',
          borderRadius: 20,
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>📋</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Farmer Risk Registry</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0f172a' }}>
                {['Farmer', 'PIN', 'Crop', 'Land', 'Financial', 'Disaster', 'Compound', 'Status'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 16px',
                      textAlign: 'left',
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#64748b',
                      letterSpacing: '0.08em',
                      borderBottom: '1px solid #1e293b',
                    }}
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(govData?.farmers ?? []).map((f: FarmerOverviewItem, idx: number) => {
                const sc = getRiskColors(f.status);
                return (
                  <tr
                    key={f.id}
                    style={{
                      background: idx % 2 === 0 ? 'transparent' : '#ffffff04',
                      borderBottom: '1px solid #1e293b20',
                    }}
                  >
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{f.full_name}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#94a3b8' }}>{f.pin_code}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#94a3b8' }}>{f.primary_crop ?? '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#94a3b8' }}>{f.land_size_acres ? `${f.land_size_acres} ac` : '—'}</td>
                    <td style={{ padding: '12px 16px' }}><RiskBadge level={f.financial_risk_level} /></td>
                    <td style={{ padding: '12px 16px' }}><RiskBadge level={f.disaster_risk_level} /></td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: sc.text }}>
                      {f.compound_score?.toFixed(1) ?? '—'}%
                    </td>
                    <td style={{ padding: '12px 16px' }}><RiskBadge level={f.status} /></td>
                  </tr>
                );
              })}
              {(govData?.farmers ?? []).length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 32, color: '#64748b', fontSize: 13 }}>
                    No farmer profiles registered yet. Ask farmers to complete onboarding.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent 4 — Optimization Panel */}
      <div
        style={{
          background: '#ffffff08',
          border: '1px solid #6366f130',
          borderRadius: 20,
          padding: 24,
          boxShadow: '0 0 30px rgba(99,102,241,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div
            style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'linear-gradient(135deg,#6366f120,#8b5cf620)',
              border: '1px solid #6366f140',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}
          >
            ⚙️
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.1em' }}>AGENT 4</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Resource Optimization Engine</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>Google OR-Tools CP-SAT Solver</span>
            <AiBadge powered={false} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              TOTAL RELIEF BUDGET (₹)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: 10,
                color: '#f1f5f9',
                fontSize: 14,
                fontWeight: 600,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={runOptimization}
              disabled={optLoading}
              style={{
                padding: '10px 24px',
                background: optLoading ? '#334155' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                border: 'none',
                borderRadius: 10,
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                cursor: optLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                whiteSpace: 'nowrap',
              }}
            >
              {optLoading ? <>Running<ThinkingDots /></> : '🚀 Run Allocation'}
            </button>
          </div>
        </div>

        {optResult && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {[
                { label: 'Budget Used', value: `₹${optResult.total_spent.toLocaleString('en-IN')}`, sub: `of ₹${optResult.total_budget.toLocaleString('en-IN')}` },
                { label: 'Farmers Helped', value: optResult.allocations.length, sub: `of ${govData?.total_farmers ?? '?'} total` },
                { label: 'Risk Reduced', value: `${optResult.total_mitigated_score}pts`, sub: 'composite score' },
              ].map((s) => (
                <div key={s.label} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#6366f1' }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Allocations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {optResult.allocations.map((a, i) => (
                <div
                  key={a.farmer_id}
                  style={{
                    background: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: 12,
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 800, color: '#fff',
                      }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{a.farmer_name}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{a.intervention}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>
                      ₹{a.cost.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>Risk ↓ {a.risk_mitigated}pts</div>
                  </div>
                </div>
              ))}
              {optResult.allocations.length === 0 && (
                <div style={{ textAlign: 'center', padding: 24, color: '#64748b', fontSize: 13 }}>
                  No allocations possible. Register farmers or increase budget.
                </div>
              )}
            </div>

            {/* OR-Tools Reasoning */}
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 16 }}>
              <button
                onClick={() => setReasoning(!reasoning)}
                style={{
                  background: 'none', border: 'none', color: '#94a3b8',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', width: '100%',
                }}
              >
                <span>⚙️ Solver Process Log</span>
                <span>{reasoning ? '▲' : '▼'}</span>
              </button>
              {reasoning && (
                <div style={{ marginTop: 12, color: '#cbd5e1', fontSize: 12, lineHeight: 1.8, borderTop: '1px solid #1e293b', paddingTop: 12, fontFamily: 'monospace' }}>
                  {optResult.thought_process.split('\n').map((line, i) => (
                    <div key={i} style={{ marginBottom: 2 }}>▶ {line}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('khetseva_token'));
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'farmer' | 'government'>('farmer');

  const fetchDashboard = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/farmer/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error('Failed to load dashboard data');
      }
      const data = await res.json();
      setDashboardData(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchDashboard();
  }, [token, fetchDashboard]);

  const handleLoginSuccess = (newToken: string) => {
    localStorage.setItem('khetseva_token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('khetseva_token');
    setToken(null);
    setDashboardData(null);
  };

  // Parse eligible schemes from JSON
  const eligibleSchemes: EligibleScheme[] = (() => {
    try {
      return dashboardData?.compound_risk?.eligible_schemes_json
        ? JSON.parse(dashboardData.compound_risk.eligible_schemes_json)
        : [];
    } catch {
      return [];
    }
  })();

  const compoundStatus = dashboardData?.compound_risk?.status;
  const compoundScore = dashboardData?.compound_risk?.compound_score ?? 0;

  return (
    <>
      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
          font-family: 'Outfit', sans-serif;
          background: #020817;
          color: #e2e8f0;
          min-height: 100vh;
        }

        .bg-grid {
          background-image: 
            linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .agent-card {
          animation: slideUp 0.5s ease both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .spinner {
          width: 40px; height: 40px;
          border: 3px solid #1e293b;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .thinking-dots span {
          animation: blink 1.4s infinite both;
          font-size: 18px;
          font-weight: 900;
          color: #6366f1;
        }
        .thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
        .thinking-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes blink {
          0%, 80%, 100% { opacity: 0; }
          40% { opacity: 1; }
        }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }

        input[type=number]::-webkit-inner-spin-button { opacity: 0.5; }
      `}</style>

      <div className="bg-grid" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* ── Navigation ── */}
        <nav
          style={{
            background: 'rgba(2,8,23,0.85)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid #1e293b',
            padding: '0 32px',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22 }}>🌾</span>
            <div>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  background: 'linear-gradient(135deg,#10b981,#6366f1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                AgroNexus
              </span>
              <span style={{ fontSize: 10, color: '#475569', marginLeft: 8, fontWeight: 600 }}>MULTI-AGENT SYSTEM</span>
            </div>
          </div>

          {token && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Tab switcher */}
              <div
                style={{
                  display: 'flex',
                  background: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: 10,
                  padding: 3,
                  gap: 2,
                }}
              >
                {(['farmer', 'government'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '5px 14px',
                      borderRadius: 7,
                      border: 'none',
                      background: activeTab === tab ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
                      color: activeTab === tab ? '#fff' : '#64748b',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {tab === 'farmer' ? '🌾 My Dashboard' : '🏛️ Gov Panel'}
                  </button>
                ))}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  padding: '6px 16px',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  background: 'transparent',
                  color: '#94a3b8',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </div>
          )}
        </nav>

        {/* ── Main Content ── */}
        <main style={{ flex: 1, padding: '32px 24px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>

          {/* Not logged in — show onboarding */}
          {!token ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <div style={{ width: '100%', maxWidth: 520 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
                  <h1
                    style={{
                      fontSize: 28,
                      fontWeight: 900,
                      background: 'linear-gradient(135deg,#10b981,#6366f1,#8b5cf6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      marginBottom: 8,
                    }}
                  >
                    AgroNexus AI Agents
                  </h1>
                  <p style={{ color: '#64748b', fontSize: 14 }}>
                    4-Agent system: Financial · Disaster · Gov Schemes · Optimization
                  </p>
                </div>
                <OnboardingForm onSuccess={handleLoginSuccess} />
              </div>
            </div>
          ) : loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
                Agents Analyzing<ThinkingDots />
              </div>
              <p style={{ color: '#64748b', fontSize: 13 }}>
                Running Financial · Disaster · Scheme agents in parallel...
              </p>
            </div>
          ) : error ? (
            <div
              style={{
                maxWidth: 480,
                margin: '60px auto',
                background: '#ffffff08',
                border: '1px solid #ef444430',
                borderRadius: 20,
                padding: 32,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
                Unable to Fetch Dashboard
              </h3>
              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 24 }}>{error}</p>
              <button
                onClick={fetchDashboard}
                style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  border: 'none',
                  borderRadius: 10,
                  color: '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                Retry Connection
              </button>
            </div>
          ) : activeTab === 'government' ? (
            <GovernmentPanel />
          ) : dashboardData ? (
            /* ── FARMER DASHBOARD ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Welcome Header */}
              <div
                style={{
                  background: '#ffffff08',
                  border: '1px solid #1e293b',
                  borderRadius: 20,
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 16,
                }}
              >
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>
                    Welcome back, {dashboardData.farmer.full_name} 👋
                  </h1>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {[
                      ['📱', dashboardData.farmer.phone_number],
                      ['📍', `PIN: ${dashboardData.farmer.pin_code}`],
                      ['🌐', `${dashboardData.farmer.latitude?.toFixed(3)}°N, ${dashboardData.farmer.longitude?.toFixed(3)}°E`],
                    ].map(([icon, val]) => (
                      <span key={val} style={{ fontSize: 12, color: '#64748b' }}>
                        {icon} {val}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <AiBadge powered={dashboardData.is_ai_powered} />
                  <button
                    onClick={fetchDashboard}
                    style={{
                      padding: '8px 16px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: 10,
                      color: '#94a3b8',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>

              {/* Compound Risk Hero */}
              <div
                style={{
                  background: '#ffffff08',
                  border: `1px solid ${getRiskColors(compoundStatus).border}50`,
                  borderRadius: 20,
                  padding: 28,
                  display: 'flex',
                  gap: 32,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  boxShadow: `0 0 40px ${getRiskColors(compoundStatus).glow}`,
                }}
              >
                <CircularGauge value={compoundScore} size={130} label="Compound Risk" />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>Vulnerability Index</h2>
                    <RiskBadge level={compoundStatus} />
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>
                    {dashboardData.compound_risk?.xai_explanation}
                  </p>
                  <p style={{ fontSize: 11, color: '#475569' }}>
                    ℹ️ Compound score = weighted average of Financial Risk (Agent 1) and Disaster Risk (Agent 2) with synergistic amplification when both are High.
                  </p>
                </div>
              </div>

              {/* Agent Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(480px,1fr))', gap: 20 }}>

                {/* Agent 1 — Financial */}
                <AgentCard
                  agentNumber={1}
                  agentName="Financial Risk Analysis"
                  icon="💵"
                  riskLevel={dashboardData.financial_profile?.financial_risk_level}
                  riskScore={dashboardData.financial_profile?.financial_risk_score}
                  isAiPowered={dashboardData.is_ai_powered}
                  reasoning={dashboardData.financial_profile?.financial_thoughts}
                  delay={0}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                    {[
                      { label: 'Annual Income', value: `₹${(dashboardData.financial_profile?.annual_income ?? 0).toLocaleString('en-IN')}` },
                      { label: 'Outstanding Loan', value: `₹${(dashboardData.financial_profile?.total_outstanding_loan ?? 0).toLocaleString('en-IN')}` },
                      { label: 'Primary Crop', value: dashboardData.financial_profile?.primary_crop ?? '—' },
                      { label: 'Land Size', value: `${dashboardData.financial_profile?.land_size_acres ?? '—'} acres` },
                    ].map((item) => (
                      <div key={item.label} style={{ background: '#0f172a', borderRadius: 10, padding: '10px 14px' }}>
                        <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 3 }}>{item.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      padding: '10px 14px',
                      background: dashboardData.financial_profile?.has_previous_default ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
                      border: `1px solid ${dashboardData.financial_profile?.has_previous_default ? '#ef444430' : '#10b98130'}`,
                      borderRadius: 10,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>Previous Loan Default</span>
                    <RiskBadge level={dashboardData.financial_profile?.has_previous_default ? 'High' : 'Low'} />
                  </div>
                </AgentCard>

                {/* Agent 2 — Disaster */}
                <AgentCard
                  agentNumber={2}
                  agentName="Disaster & Climate Forecast"
                  icon="🌦️"
                  riskLevel={dashboardData.environmental_data?.disaster_risk_level}
                  riskScore={dashboardData.environmental_data?.disaster_risk_score}
                  isAiPowered={dashboardData.is_ai_powered}
                  reasoning={dashboardData.environmental_data?.disaster_thoughts}
                  delay={100}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                    {[
                      { label: 'Precipitation Index', value: `${dashboardData.environmental_data?.current_rainfall_mm ?? 0} mm` },
                      { label: 'Historical Risk Zone', value: dashboardData.environmental_data?.historical_disaster_risk ?? '—' },
                    ].map((item) => (
                      <div key={item.label} style={{ background: '#0f172a', borderRadius: 10, padding: '10px 14px' }}>
                        <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 3 }}>{item.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, background: '#0f172a', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                    <span>Last synced:</span>
                    <span>{new Date(dashboardData.environmental_data?.last_api_update ?? '').toLocaleString()}</span>
                  </div>
                </AgentCard>

                {/* Agent 3 — Gov Schemes */}
                <div
                  className="agent-card"
                  style={{
                    background: '#ffffff08',
                    border: '1px solid #6ee7b740',
                    borderRadius: 20,
                    padding: 24,
                    boxShadow: '0 0 30px rgba(16,185,129,0.1)',
                    animationDelay: '200ms',
                    gridColumn: 'span 2',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 42, height: 42, borderRadius: 12,
                          background: 'rgba(16,185,129,0.15)',
                          border: '1px solid rgba(16,185,129,0.3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                        }}
                      >
                        🏛️
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.1em' }}>AGENT 3</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Government Scheme Matcher</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span
                        style={{
                          background: 'linear-gradient(135deg,#10b981,#059669)',
                          color: '#fff',
                          padding: '3px 12px',
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {eligibleSchemes.length} Schemes Matched
                      </span>
                      <AiBadge powered={dashboardData.is_ai_powered} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12, marginBottom: 16 }}>
                    {eligibleSchemes.map((s) => (
                      <SchemeCard key={s.name} scheme={s} />
                    ))}
                  </div>

                  {dashboardData.compound_risk?.scheme_thoughts && (
                    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, overflow: 'hidden' }}>
                      <details>
                        <summary
                          style={{
                            padding: '10px 16px',
                            color: '#94a3b8',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            listStyle: 'none',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>💬 {dashboardData.is_ai_powered ? 'AI Agent Reasoning' : 'Eligibility Analysis'}</span>
                          <span>▼</span>
                        </summary>
                        <div style={{ padding: '12px 16px', color: '#cbd5e1', fontSize: 13, lineHeight: 1.7, borderTop: '1px solid #1e293b' }}>
                          {dashboardData.compound_risk.scheme_thoughts}
                        </div>
                      </details>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ) : null}
        </main>

        {/* Footer */}
        <footer
          style={{
            borderTop: '1px solid #1e293b',
            padding: '16px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 11,
            color: '#334155',
          }}
        >
          <span>🌾 AgroNexus — Multi-Agent Farmer Relief System</span>
          <span>Financial · Disaster · GovScheme · Optimization (OR-Tools)</span>
        </footer>
      </div>
    </>
  );
}
