import React, { useState } from 'react';
import { fetchCombinedRisk, type CombinedRiskInput, type CombinedRiskOutput } from './api/riskApi';
import { RiskResultCard } from './RiskResultCard';
import { Loader2, AlertCircle } from 'lucide-react';

export const RiskForm: React.FC = () => {
  const [formData, setFormData] = useState<CombinedRiskInput>({
    loan_amount: 0,
    land_acres: 1,
    has_insurance: false,
    has_recent_loss: false,
    income_bracket: 0,
    pincode: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CombinedRiskOutput | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'pincode') {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (value.length > 0 && !/^\d{6}$/.test(value)) {
        setPinError('Pincode must be exactly 6 digits');
      } else {
        setPinError(null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(formData.pincode)) {
      setPinError('Valid 6-digit pincode is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const res = await fetchCombinedRisk(formData);
      setResult(res);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to calculate risk. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6">
          <h2 className="text-2xl font-bold text-white">Farmer Risk Assessment</h2>
          <p className="text-emerald-100 mt-1">Get an instant, data-driven analysis of compound agricultural risks.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pincode */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Pincode (6 digits)</label>
              <input 
                type="text" 
                name="pincode" 
                value={formData.pincode}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-shadow ${pinError ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-teal-200 focus:border-teal-500'}`}
                placeholder="e.g. 411001"
                maxLength={6}
                required
              />
              {pinError && <p className="text-red-500 text-xs mt-1">{pinError}</p>}
            </div>

            {/* Land Size */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Land Size (Acres)</label>
              <input 
                type="number" 
                name="land_acres" 
                value={formData.land_acres}
                onChange={handleInputChange}
                min="0.1" 
                step="0.1"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-200 focus:border-teal-500 focus:outline-none"
                required
              />
            </div>

            {/* Loan Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Outstanding Loan Amount (₹)</label>
              <input 
                type="number" 
                name="loan_amount" 
                value={formData.loan_amount}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-200 focus:border-teal-500 focus:outline-none"
                required
              />
            </div>

            {/* Income Bracket */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Annual Income Bracket</label>
              <select 
                name="income_bracket" 
                value={formData.income_bracket}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-200 focus:border-teal-500 focus:outline-none bg-white"
              >
                <option value={0}>Less than ₹1 Lakh</option>
                <option value={1}>₹1 Lakh - ₹3 Lakhs</option>
                <option value={2}>₹3 Lakhs - ₹5 Lakhs</option>
                <option value={3}>More than ₹5 Lakhs</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            {/* Crop Insurance */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center mt-1">
                <input 
                  type="checkbox" 
                  name="has_insurance" 
                  checked={formData.has_insurance}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500 cursor-pointer"
                />
              </div>
              <div>
                <span className="block text-sm font-semibold text-gray-800 group-hover:text-teal-700 transition-colors">Has Crop Insurance</span>
                <span className="block text-xs text-gray-500">Currently enrolled in PMFBY or a private scheme</span>
              </div>
            </label>

            {/* Recent Loss */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center mt-1">
                <input 
                  type="checkbox" 
                  name="has_recent_loss" 
                  checked={formData.has_recent_loss}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500 cursor-pointer"
                />
              </div>
              <div>
                <span className="block text-sm font-semibold text-gray-800 group-hover:text-teal-700 transition-colors">Recent Crop Loss</span>
                <span className="block text-xs text-gray-500">Experienced significant farming loss in the last 2 months</span>
              </div>
            </label>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={loading || !!pinError}
              className={`w-full py-3.5 px-6 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all ${loading || !!pinError ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 hover:shadow-lg hover:-translate-y-0.5'}`}
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Calculating Risk...</>
              ) : (
                'Generate Risk Scorecard'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Analysis Failed</h4>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && <RiskResultCard result={result} />}
    </div>
  );
};
