// ─────────────────────────────────────────────
// KhetSeva Frontend Type Definitions
// ─────────────────────────────────────────────

export interface Farmer {
  id: string;
  full_name: string;
  phone_number: string;
  pin_code: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
}

export interface FarmDetails {
  id: string;
  farmer_id: string;
  land_size_acres: number;
  ownership_type: string;
  crops: string;
  crop_season?: string;
  irrigation_source: string;
  soil_type?: string;
  experience_years?: number;
}

export interface FinancialDetails {
  id: string;
  farmer_id: string;
  loan_amount: number;
  loan_source: string;
  has_insurance: boolean;
  insurance_scheme?: string;
  income_band: string;
  past_crop_loss: boolean;
  dependents: number;
}

export interface RiskScore {
  id: string;
  farmer_id: string;
  financial_risk: number;
  disaster_risk: number;
  compound_risk: number;
  compound_label: 'Stable' | 'Watch' | 'High Risk' | 'Critical';
  xai_explanation?: string;
  financial_factors_json?: string;
  disaster_factors_json?: string;
  eligible_schemes_json?: string;
  computed_at: string;
}

export interface EligibleScheme {
  name: string;
  benefit: string;
  status: 'Eligible now' | 'Not eligible' | 'Conditionally eligible';
  reason: string;
  apply_url?: string;
}

export interface RecommendationItem {
  text: string;
  category: 'financial' | 'disaster' | 'scheme' | 'general';
  priority: 'urgent' | 'recommended' | 'informational';
}

export interface ForecastData {
  dates: string[];
  precipitation_mm: number[];
  temp_max: number[];
  temp_min: number[];
  is_mock?: boolean;
}

export interface DashboardData {
  farmer: Farmer;
  farm_details?: FarmDetails;
  financial_details?: FinancialDetails;
  latest_risk?: RiskScore;
  risk_history: RiskScore[];
  recommendations: RecommendationItem[];
  eligible_schemes: EligibleScheme[];
  forecast_data?: ForecastData;
}

// Risk factor breakdown (parsed from financial_factors_json)
export interface RiskFactor {
  factor: string;
  points: number;
}

// Disaster signal breakdown (parsed from disaster_factors_json)
export interface DisasterSignals {
  disaster_risk: number;
  drought_signal: number;
  flood_signal: number;
  heat_signal: number;
  hazard_type: string;
  forecast_total_mm: number;
  seasonal_normal_mm: number;
  rainfall_ratio: number;
  max_consecutive_hot_days: number;
  crop_heat_threshold: number;
}

// ── Government / Officer View ──

export interface FarmerOverviewItem {
  id: string;
  full_name: string;
  pin_code: string;
  compound_score?: number;
  compound_label?: string;
  financial_risk?: number;
  disaster_risk?: number;
  primary_crop?: string;
  land_size_acres?: number;
}

export interface GovernmentDashboard {
  total_farmers: number;
  critical_count: number;
  high_count: number;
  watch_count: number;
  stable_count: number;
  farmers: FarmerOverviewItem[];
}

// ── Optimization (OR-Tools) ──

export interface OptimizationAllocation {
  farmer_id: string;
  farmer_name: string;
  intervention: string;
  cost: number;
  risk_mitigated: number;
}

export interface OptimizationResult {
  total_budget: number;
  total_spent: number;
  total_mitigated_score: number;
  allocations: OptimizationAllocation[];
  thought_process: string;
}

// ── Onboarding Form State ──

export interface OnboardingStep1Data {
  fullName: string;
  phoneNumber: string;
  password: string;
  pinCode: string;
  latitude: number | null;
  longitude: number | null;
}

export interface OnboardingStep2Data {
  landSizeAcres: string;
  ownershipType: string;
  crops: string;
  cropSeason: string;
  irrigationSource: string;
  soilType: string;
  experienceYears: string;
}

export interface OnboardingStep3Data {
  loanAmount: string;
  loanSource: string;
  hasInsurance: boolean;
  insuranceScheme: string;
  incomeBand: string;
  pastCropLoss: boolean;
  dependents: string;
}

// Compound risk band helpers
export type RiskBand = 'Stable' | 'Watch' | 'High Risk' | 'Critical';

export function getRiskBandColor(label: RiskBand | string): string {
  switch (label) {
    case 'Critical': return '#dc2626';
    case 'High Risk': return '#ea580c';
    case 'Watch': return '#d97706';
    case 'Stable': return '#16a34a';
    default: return '#6b7280';
  }
}

export function getRiskBandBg(label: RiskBand | string): string {
  switch (label) {
    case 'Critical': return 'rgba(220,38,38,0.1)';
    case 'High Risk': return 'rgba(234,88,12,0.1)';
    case 'Watch': return 'rgba(217,119,6,0.1)';
    case 'Stable': return 'rgba(22,163,74,0.1)';
    default: return 'rgba(107,114,128,0.1)';
  }
}
