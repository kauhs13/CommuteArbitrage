/*
  # Create CommuteArbitrage Application Schema

  1. New Tables
    - `scenarios`
      - `id` (uuid, primary key) - unique identifier
      - `user_id` (uuid) - references auth.users (can be null for non-authenticated users)
      - `name` (text) - user-defined scenario name
      - `annual_salary` (numeric) - annual salary in INR
      - `days_in_office` (integer) - days per week in office (1-5)
      - `commute_distance` (numeric) - one-way distance in km
      - `city_center_rent` (numeric) - monthly rent in city center
      - `suburb_rent` (numeric) - monthly rent in suburbs
      - `other_city_expenses` (numeric) - other monthly expenses in city center
      - `other_suburb_expenses` (numeric) - other monthly expenses in suburbs
      - `verdict` (text) - calculated verdict (city_center or suburbs)
      - `savings_per_month` (numeric) - calculated savings
      - `is_default` (boolean) - whether this is the default scenario
      - `created_at` (timestamptz) - creation timestamp
      - `updated_at` (timestamptz) - last update timestamp

    - `comparison_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - references auth.users (can be null)
      - `scenario_id` (uuid) - references scenarios
      - `total_city_cost` (numeric) - calculated total cost for city option
      - `total_suburb_cost` (numeric) - calculated total cost for suburb option
      - `viewed_at` (timestamptz) - when comparison was viewed/created

  2. Security
    - Enable RLS on both tables
    - Add policies for non-authenticated users to create/view their own scenarios
    - Add policies for authenticated users to create/view/update/delete their own scenarios
*/

CREATE TABLE IF NOT EXISTS scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'My Scenario',
  annual_salary numeric NOT NULL DEFAULT 600000,
  days_in_office integer NOT NULL DEFAULT 5 CHECK (days_in_office >= 1 AND days_in_office <= 5),
  commute_distance numeric NOT NULL DEFAULT 20 CHECK (commute_distance >= 0),
  city_center_rent numeric NOT NULL DEFAULT 35000 CHECK (city_center_rent >= 0),
  suburb_rent numeric NOT NULL DEFAULT 18000 CHECK (suburb_rent >= 0),
  other_city_expenses numeric NOT NULL DEFAULT 8000 CHECK (other_city_expenses >= 0),
  other_suburb_expenses numeric NOT NULL DEFAULT 5000 CHECK (other_suburb_expenses >= 0),
  verdict text NOT NULL DEFAULT 'city_center',
  savings_per_month numeric NOT NULL DEFAULT 0,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comparison_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_id uuid REFERENCES scenarios(id) ON DELETE CASCADE,
  total_city_cost numeric NOT NULL,
  total_suburb_cost numeric NOT NULL,
  viewed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparison_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Unauthenticated users can create scenarios"
  ON scenarios
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Unauthenticated users can view their scenarios"
  ON scenarios
  FOR SELECT
  TO anon
  USING (user_id IS NULL);

CREATE POLICY "Unauthenticated users can update their scenarios"
  ON scenarios
  FOR UPDATE
  TO anon
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Unauthenticated users can delete their scenarios"
  ON scenarios
  FOR DELETE
  TO anon
  USING (user_id IS NULL);

CREATE POLICY "Authenticated users can create their own scenarios"
  ON scenarios
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Authenticated users can view their own scenarios"
  ON scenarios
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Authenticated users can update their own scenarios"
  ON scenarios
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Authenticated users can delete their own scenarios"
  ON scenarios
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Unauthenticated users can view their history"
  ON comparison_history
  FOR SELECT
  TO anon
  USING (user_id IS NULL);

CREATE POLICY "Unauthenticated users can create history entries"
  ON comparison_history
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Authenticated users can view their own history"
  ON comparison_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Authenticated users can create their own history entries"
  ON comparison_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE INDEX IF NOT EXISTS scenarios_user_id_idx ON scenarios(user_id);
CREATE INDEX IF NOT EXISTS scenarios_is_default_idx ON scenarios(is_default);
CREATE INDEX IF NOT EXISTS comparison_history_user_id_idx ON comparison_history(user_id);
CREATE INDEX IF NOT EXISTS comparison_history_scenario_id_idx ON comparison_history(scenario_id);
