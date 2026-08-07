import axios from 'axios';

// Reuse existing VITE_API_URL or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export interface FarmerRiskInput {
  loan_amount: number;
  land_acres: number;
  has_insurance: boolean;
  has_recent_loss: boolean;
  income_bracket: number; // 0-3
}

export interface CombinedRiskInput extends FarmerRiskInput {
  pincode: string;
}

export interface DisasterBreakdown {
  flood: number;
  drought: number;
  storm: number;
  frost_or_heat: number;
}

export interface DisasterRiskOutput {
  disaster_risk_score: number;
  dominant_hazard: string;
  breakdown: DisasterBreakdown;
  resolved_location?: {
    latitude: number;
    longitude: number;
    source: string;
  };
}

export interface CombinedRiskOutput {
  overall_risk_score: number;
  risk_band: string;
  financial_risk_score: number;
  disaster_risk: DisasterRiskOutput;
}

export const fetchCombinedRisk = async (data: CombinedRiskInput): Promise<CombinedRiskOutput> => {
  const response = await axios.post(`${API_BASE_URL}/risk/combined`, data);
  return response.data;
};
