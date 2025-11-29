export interface Scenario {
  id: string;
  user_id: string | null;
  name: string;
  annual_salary: number;
  days_in_office: number;
  commute_distance: number;
  city_center_rent: number;
  suburb_rent: number;
  other_city_expenses: number;
  other_suburb_expenses: number;
  verdict: 'city_center' | 'suburbs';
  savings_per_month: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComparisonResult {
  totalCityCost: number;
  totalSuburbCost: number;
  transportCost: number;
  opportunityCost: number;
  commuteHoursPerDay: number;
  verdict: 'city_center' | 'suburbs';
  monthlyOpportunityCost: number;
  monthlySavings: number;
  annualSavings: number;
}

export interface ExpenseBreakdown {
  rent: number;
  transport: number;
  opportunity: number;
  other: number;
  total: number;
}
