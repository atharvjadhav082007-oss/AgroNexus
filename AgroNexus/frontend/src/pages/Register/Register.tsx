import OnboardingForm from '../../components/OnboardingForm';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

export default function Register() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8faf8' }}>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{
          textAlign: 'center', marginBottom: 32,
        }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: 0 }}>
            Join <span style={{ color: '#166534' }}>KhetSeva</span>
          </h1>
          <p style={{ color: '#6b7280', marginTop: 8, fontSize: 15 }}>
            3 simple steps to get your compound risk analysis
          </p>
        </div>
        <div style={{
          background: '#fff', borderRadius: 20, padding: '32px 24px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          <OnboardingForm />
        </div>
      </div>
      <Footer />
    </div>
  );
}
