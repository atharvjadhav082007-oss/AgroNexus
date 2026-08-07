import React, { useState } from 'react';
import type { CombinedRiskOutput } from './api/riskApi';
import { AlertTriangle, TrendingUp, CloudRain, Droplets, Wind, ThermometerSun, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  result: CombinedRiskOutput;
}

export const RiskResultCard: React.FC<Props> = ({ result }) => {
  const [expanded, setExpanded] = useState(false);

  // Helper to determine colors based on the band
  const getBandColor = (band: string) => {
    switch (band) {
      case "Low Risk": return "text-green-600 bg-green-100 border-green-200";
      case "Moderate Risk": return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "High Risk": return "text-orange-600 bg-orange-100 border-orange-200";
      case "Severe Risk": return "text-red-600 bg-red-100 border-red-200";
      default: return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getScoreColorText = (score: number) => {
    if (score < 25) return "text-green-600";
    if (score < 50) return "text-yellow-500";
    if (score < 75) return "text-orange-500";
    return "text-red-600";
  };

  const colorClasses = getBandColor(result.risk_band);

  return (
    <div className={`mt-6 w-full max-w-2xl mx-auto rounded-2xl border-2 ${colorClasses.split(' ')[2]} bg-white shadow-xl overflow-hidden transition-all duration-300`}>
      {/* Header Section */}
      <div className={`p-6 ${colorClasses.split(' ')[1]} flex flex-col items-center justify-center border-b ${colorClasses.split(' ')[2]}`}>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Overall Risk Assessment</h2>
        
        <div className="flex items-end gap-2 mb-2">
          <span className={`text-6xl font-extrabold tracking-tighter ${colorClasses.split(' ')[0]}`}>
            {result.overall_risk_score}
          </span>
          <span className="text-gray-500 text-lg font-medium mb-1">/ 100</span>
        </div>
        
        <div className={`px-4 py-1.5 rounded-full font-bold text-sm uppercase tracking-wider ${colorClasses}`}>
          {result.risk_band}
        </div>
      </div>

      {/* Sub-Scores */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
        
        {/* Financial Risk */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-gray-700 font-semibold">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Financial Risk
          </div>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className={`text-3xl font-bold ${getScoreColorText(result.financial_risk_score)}`}>
              {result.financial_risk_score}
            </span>
            <span className="text-sm text-gray-400">/ 100</span>
          </div>
        </div>

        {/* Disaster Risk */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col">
          <div className="flex items-center gap-2 mb-1 text-gray-700 font-semibold">
            <AlertTriangle className="w-5 h-5 text-purple-500" />
            Disaster Risk
          </div>
          <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">
            Dominant: <span className="text-purple-600 font-bold">{result.disaster_risk.dominant_hazard.replace('_', ' ')}</span>
          </p>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className={`text-3xl font-bold ${getScoreColorText(result.disaster_risk.disaster_risk_score)}`}>
              {result.disaster_risk.disaster_risk_score}
            </span>
            <span className="text-sm text-gray-400">/ 100</span>
          </div>
        </div>
      </div>

      {/* Expandable Hazard Breakdown */}
      <div className="border-t border-gray-100">
        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-full px-6 py-4 flex items-center justify-between text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span>View Detailed Weather Hazard Breakdown</span>
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {expanded && (
          <div className="px-6 pb-6 bg-gray-50 grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100 shadow-sm">
              <div className="flex items-center gap-2"><CloudRain className="w-4 h-4 text-blue-500"/><span className="text-sm font-medium text-gray-700">Flood</span></div>
              <span className={`font-bold ${getScoreColorText(result.disaster_risk.breakdown.flood)}`}>{result.disaster_risk.breakdown.flood}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100 shadow-sm">
              <div className="flex items-center gap-2"><Droplets className="w-4 h-4 text-amber-500"/><span className="text-sm font-medium text-gray-700">Drought</span></div>
              <span className={`font-bold ${getScoreColorText(result.disaster_risk.breakdown.drought)}`}>{result.disaster_risk.breakdown.drought}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2"><Wind className="w-4 h-4 text-gray-500"/><span className="text-sm font-medium text-gray-700">Storm</span></div>
              <span className={`font-bold ${getScoreColorText(result.disaster_risk.breakdown.storm)}`}>{result.disaster_risk.breakdown.storm}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-100 shadow-sm">
              <div className="flex items-center gap-2"><ThermometerSun className="w-4 h-4 text-red-500"/><span className="text-sm font-medium text-gray-700">Frost/Heat</span></div>
              <span className={`font-bold ${getScoreColorText(result.disaster_risk.breakdown.frost_or_heat)}`}>{result.disaster_risk.breakdown.frost_or_heat}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
