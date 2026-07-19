import React, { useState } from 'react';

interface OnboardingFormProps {
  onSuccess: (token: string) => void;
}

export default function OnboardingForm({ onSuccess }: OnboardingFormProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    password: '',
    pinCode: '',
    latitude: null as number | null,
    longitude: null as number | null,
    landSizeAcres: '',
    primaryCrop: 'Rice (Paddy)',
    annualIncome: '',
    totalOutstandingLoan: '0',
    hasPreviousDefault: false,
  });

  const [geoStatus, setGeoStatus] = useState<'idle' | 'fetching' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoStatus('fetching');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setGeoStatus('success');
      },
      (err) => {
        console.error(err);
        setGeoStatus('error');
        setError('Unable to fetch location. Please enter coordinates manually if desired.');
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const API_URL = 'http://localhost:8000/api';

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: formData.phoneNumber,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      onSuccess(data.access_token);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      // Step 1: Register Farmer
      const registerRes = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          password: formData.password,
          pin_code: formData.pinCode,
          latitude: formData.latitude,
          longitude: formData.longitude,
        }),
      });

      const registerData = await registerRes.json();
      if (!registerRes.ok) {
        throw new Error(registerData.detail || 'Registration failed');
      }

      const token = registerData.access_token;

      // Step 2: Submit Financial & Farm Profile
      const profileRes = await fetch(`${API_URL}/farmer/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          annual_income: parseInt(formData.annualIncome) || 0,
          total_outstanding_loan: parseInt(formData.totalOutstandingLoan) || 0,
          has_previous_default: formData.hasPreviousDefault,
          land_size_acres: parseFloat(formData.landSizeAcres) || 1.0,
          primary_crop: formData.primaryCrop,
        }),
      });

      const profileData = await profileRes.json();
      if (!profileRes.ok) {
        throw new Error(profileData.detail || 'Failed to save financial profile');
      }

      // Success - log them in
      onSuccess(token);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.phoneNumber || !formData.password || !formData.pinCode) {
        setError('Please fill out all identity credentials.');
        return;
      }
      if (formData.phoneNumber.length < 10) {
        setError('Phone number must be at least 10 digits.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    }
    if (step === 2) {
      if (!formData.landSizeAcres || parseFloat(formData.landSizeAcres) <= 0) {
        setError('Please enter a valid land size in acres.');
        return;
      }
    }
    setError('');
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setStep((prev) => prev - 1);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden p-8 transition-all duration-300">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          🌾 KhetSeva Onboarding
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
          {isLogin
            ? 'Sign in to access your farm dashboard and risk forecast.'
            : 'Register your farm to monitor risk factors and optimize relief eligibility.'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {isLogin ? (
        // LOGIN FORM
        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              required
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Access Dashboard'}
          </button>

          <div className="text-center pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm font-medium"
            >
              Don't have an account? Register here
            </button>
          </div>
        </form>
      ) : (
        // REGISTER MULTI-STEP FLOW
        <div className="space-y-6">
          {/* Progress Indicators */}
          <div className="flex justify-between items-center px-4 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    step >= s
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`h-1 w-16 md:w-24 transition-all duration-500 ${
                      step > s ? 'bg-emerald-600' : 'bg-zinc-200 dark:bg-zinc-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* STEP 1: Account Setup */}
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                Step 1: Account & Credentials
              </h3>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  PIN Code
                </label>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  placeholder="e.g. 110001"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className={`w-full py-2.5 px-4 rounded-xl border transition-all text-sm font-semibold flex items-center justify-center gap-2 ${
                    geoStatus === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
                      : geoStatus === 'fetching'
                      ? 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700'
                      : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  {geoStatus === 'fetching' ? (
                    'Accessing location...'
                  ) : geoStatus === 'success' ? (
                    <span>✔ Coordinates Captured ({formData.latitude?.toFixed(4)}, {formData.longitude?.toFixed(4)})</span>
                  ) : (
                    <>
                      <span>📍</span> Use Device GPS Coordinates
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-md"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Land & Crop Details */}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                Step 2: Farm & Agriculture Details
              </h3>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Land Size (in Acres)
                </label>
                <input
                  type="number"
                  name="landSizeAcres"
                  value={formData.landSizeAcres}
                  onChange={handleChange}
                  placeholder="e.g. 3.5"
                  step="0.1"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Primary Crop Type
                </label>
                <select
                  name="primaryCrop"
                  value={formData.primaryCrop}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                >
                  <option value="Rice (Paddy)">Rice (Paddy)</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Maize">Maize</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Pulses">Pulses</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                </select>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2.5 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-semibold rounded-xl transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-md"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Financial Background */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                Step 3: Financial Background
              </h3>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Annual Income (INR)
                </label>
                <input
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  placeholder="e.g. 150000"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Total Outstanding Loan (INR)
                </label>
                <input
                  type="number"
                  name="totalOutstandingLoan"
                  value={formData.totalOutstandingLoan}
                  onChange={handleChange}
                  placeholder="e.g. 50000"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="hasPreviousDefault"
                  name="hasPreviousDefault"
                  checked={formData.hasPreviousDefault}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:bg-zinc-800 dark:border-zinc-700"
                />
                <label htmlFor="hasPreviousDefault" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  I have a previous history of loan default
                </label>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  disabled={loading}
                  onClick={prevStep}
                  className="px-6 py-2.5 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-semibold rounded-xl transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleRegisterSubmit}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Complete & Register'}
                </button>
              </div>
            </div>
          )}

          <div className="text-center pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm font-medium"
            >
              Already registered? Sign in here
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
