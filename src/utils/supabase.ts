import { createClient } from '@supabase/supabase-js';
import { Scenario } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DEFAULT_SCENARIOS = [
  {
    name: 'Mumbai: Software Engineer (Bandra to BKC)',
    annual_salary: 1200000,
    days_in_office: 5,
    commute_distance: 15,
    city_center_rent: 50000,
    suburb_rent: 20000,
    other_city_expenses: 12000,
    other_suburb_expenses: 6000,
  },
  {
    name: 'Bangalore: Manager (Koramangala to Whitefield)',
    annual_salary: 1800000,
    days_in_office: 4,
    commute_distance: 25,
    city_center_rent: 45000,
    suburb_rent: 18000,
    other_city_expenses: 10000,
    other_suburb_expenses: 5000,
  },
  {
    name: 'Delhi: Junior Developer (Karol Bagh to Gurugram)',
    annual_salary: 600000,
    days_in_office: 5,
    commute_distance: 30,
    city_center_rent: 35000,
    suburb_rent: 12000,
    other_city_expenses: 8000,
    other_suburb_expenses: 3000,
  },
  {
    name: 'Hyderabad: Designer (Jubilee Hills to Gachibowli)',
    annual_salary: 900000,
    days_in_office: 3,
    commute_distance: 20,
    city_center_rent: 32000,
    suburb_rent: 14000,
    other_city_expenses: 7000,
    other_suburb_expenses: 4000,
  },
];

export const createDefaultScenario = async (): Promise<Scenario> => {
  const scenario = DEFAULT_SCENARIOS[Math.floor(Math.random() * DEFAULT_SCENARIOS.length)];
  const { data, error } = await supabase
    .from('scenarios')
    .insert([
      {
        ...scenario,
        user_id: null,
        is_default: true,
      },
    ])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getOrCreateDefaultScenario = async (): Promise<Scenario> => {
  const { data: existing } = await supabase
    .from('scenarios')
    .select()
    .eq('is_default', true)
    .eq('user_id', null)
    .maybeSingle();

  if (existing) return existing;
  return createDefaultScenario();
};

export const createScenario = async (scenario: Partial<Scenario>): Promise<Scenario> => {
  const { data, error } = await supabase
    .from('scenarios')
    .insert([scenario])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateScenario = async (id: string, updates: Partial<Scenario>): Promise<Scenario> => {
  const { data, error } = await supabase
    .from('scenarios')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getScenarios = async (): Promise<Scenario[]> => {
  const { data, error } = await supabase
    .from('scenarios')
    .select()
    .eq('user_id', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const deleteScenario = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('scenarios')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const saveComparisonHistory = async (
  scenarioId: string,
  totalCityCost: number,
  totalSuburbCost: number
): Promise<void> => {
  const { error } = await supabase
    .from('comparison_history')
    .insert([
      {
        user_id: null,
        scenario_id: scenarioId,
        total_city_cost: totalCityCost,
        total_suburb_cost: totalSuburbCost,
      },
    ]);

  if (error) throw error;
};

export const getComparisonHistory = async (scenarioId: string) => {
  const { data, error } = await supabase
    .from('comparison_history')
    .select()
    .eq('scenario_id', scenarioId)
    .order('viewed_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data || [];
};
