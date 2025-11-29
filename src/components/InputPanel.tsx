import { Scenario } from '../types';
import { ChevronDown } from 'lucide-react';

interface InputPanelProps {
  scenario: Scenario;
  onScenarioChange: (updates: Partial<Scenario>) => void;
}

export const InputPanel = ({ scenario, onScenarioChange }: InputPanelProps) => {
  const handleChange = (key: keyof Scenario, value: any) => {
    onScenarioChange({ [key]: value });
  };

  const monthlySalary = scenario.annual_salary / 12;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-4 border-b-2 border-blue-100">Your Profile</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Scenario Name</label>
            <input
              type="text"
              value={scenario.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="e.g., My Current Job"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Annual Salary
              <span className="text-blue-600 font-bold ml-2">
                ₹{(scenario.annual_salary / 100000).toFixed(1)}L
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-semibold">₹</span>
              <input
                type="number"
                value={scenario.annual_salary}
                onChange={(e) => handleChange('annual_salary', Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Monthly: ₹{(monthlySalary / 1000).toFixed(0)}K</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Days in Office per Week
              <span className="text-blue-600 font-bold ml-2">{scenario.days_in_office}</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((day) => (
                <button
                  key={day}
                  onClick={() => handleChange('days_in_office', day)}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                    scenario.days_in_office === day
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              One-way Commute Distance
              <span className="text-blue-600 font-bold ml-2">{scenario.commute_distance} km</span>
            </label>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={scenario.commute_distance}
              onChange={(e) => handleChange('commute_distance', Number(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>5 km (Very Close)</span>
              <span>60 km (Far)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
