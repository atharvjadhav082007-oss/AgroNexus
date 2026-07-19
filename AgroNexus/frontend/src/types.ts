export interface Farmer {
  id: string;
  full_name: string;
  phone_number: string;
  pin_code: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
}

export interface FinancialProfile {
  id: string;
  farmer_id: string;
  annual_income: number;
  total_outstanding_loan: number;
  has_previous_default: boolean;
  land_size_acres: number;
  primary_crop: string;
  financial_risk_score?: number;
  financial_risk_level?: 'High' | 'Medium' | 'Low';
  financial_thoughts?: string;
}

export interface EnvironmentalData {
  id: string;
  farmer_id: string;
  current_rainfall_mm?: number;
  historical_disaster_risk: 'High' | 'Medium' | 'Low';
  last_api_update: string;
  disaster_risk_score?: number;
  disaster_risk_level?: 'High' | 'Medium' | 'Low';
  disaster_thoughts?: string;
}

export interface EligibleScheme {
  name: string;
  type: string;
  value: string;
  description: string;
}

export interface CompoundRisk {
  id: string;
  farmer_id: string;
  compound_score?: number;
  xai_explanation?: string;
  status: 'Safe' | 'Warning' | 'Critical';
  scheme_thoughts?: string;
  eligible_schemes_json?: string;
}

export interface DashboardData {
  farmer: Farmer;
  financial_profile?: FinancialProfile;
  environmental_data?: EnvironmentalData;
  compound_risk?: CompoundRisk;
  is_ai_powered: boolean;
}

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
  is_ai_powered: boolean;
}

export interface FarmerOverviewItem {
  id: string;
  full_name: string;
  pin_code: string;
  compound_score?: number;
  status?: string;
  financial_risk_level?: string;
  disaster_risk_level?: string;
  primary_crop?: string;
  land_size_acres?: number;
}

export interface GovernmentDashboard {
  total_farmers: number;
  critical_count: number;
  warning_count: number;
  safe_count: number;
  farmers: FarmerOverviewItem[];
}
