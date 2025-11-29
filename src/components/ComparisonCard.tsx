import { MapPin, TrendingUp, Home, Zap, Clock } from 'lucide-react';
import { ComparisonResult, ExpenseBreakdown } from '../types';
import { formatCurrency } from '../utils/calculations';

interface ComparisonCardProps {
  title: string;
  location: string;
  icon: React.ReactNode;
  isCity: boolean;
  result: ComparisonResult;
  breakdown: ExpenseBreakdown;
  rent: number;
  otherExpenses: number;
  onRentChange: (rent: number) => void;
  onOtherExpensesChange: (expenses: number) => void;
}

export const ComparisonCard = ({
  title,
  location,
  icon,
  isCity,
  result,
  breakdown,
  rent,
  otherExpenses,
  onRentChange,
  onOtherExpensesChange,
}: ComparisonCardProps) => {
  const borderColor = isCity ? 'border-blue-300' : 'border-emerald-300';
  const bgGradient = isCity ? 'from-blue-50 to-blue-100' : 'from-emerald-50 to-emerald-100';

  return (
    <div className={`bg-gradient-to-br ${bgGradient} rounded-2xl shadow-xl p-8 border-2 ${borderColor}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={isCity ? 'text-blue-600' : 'text-emerald-600'}>{icon}</div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-600">{location}</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div className="bg-white rounded-xl p-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Home className="w-4 h-4" />
            Monthly Rent
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 font-semibold">₹</span>
            <input
              type="number"
              value={rent}
              onChange={(e) => onRentChange(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        {!isCity && (
          <>
            <div className="bg-white rounded-xl p-4 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  Transport Cost
                </label>
                <span className="text-lg font-bold text-yellow-700">{formatCurrency(result.transportCost)}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {result.commuteHoursPerDay.toFixed(1)} hrs/day commute
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  Opportunity Cost
                </label>
                <span className="text-lg font-bold text-orange-700">
                  {formatCurrency(result.monthlyOpportunityCost)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Value of time spent commuting
              </p>
            </div>
          </>
        )}

        <div className="bg-white rounded-xl p-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Other Monthly Expenses</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 font-semibold">₹</span>
            <input
              type="number"
              value={otherExpenses}
              onChange={(e) => onOtherExpensesChange(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">Food, utilities, miscellaneous</p>
        </div>

        <div className="mt-6 pt-6 border-t-2 border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">Total Monthly Cost</span>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <TrendingUp className="w-7 h-7 text-slate-700" />
            <span className="text-4xl font-black text-slate-900">
              {formatCurrency(isCity ? result.totalCityCost : result.totalSuburbCost).replace('₹', '')}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white bg-opacity-50 rounded-lg p-2">
              <p className="text-slate-600 font-medium">Rent</p>
              <p className="font-bold text-slate-800">{formatCurrency(breakdown.rent)}</p>
            </div>
            {breakdown.transport > 0 && (
              <div className="bg-white bg-opacity-50 rounded-lg p-2">
                <p className="text-slate-600 font-medium">Transport</p>
                <p className="font-bold text-slate-800">{formatCurrency(breakdown.transport)}</p>
              </div>
            )}
            {breakdown.opportunity > 0 && (
              <div className="bg-white bg-opacity-50 rounded-lg p-2">
                <p className="text-slate-600 font-medium">Opportunity</p>
                <p className="font-bold text-slate-800">{formatCurrency(breakdown.opportunity)}</p>
              </div>
            )}
            {breakdown.other > 0 && (
              <div className="bg-white bg-opacity-50 rounded-lg p-2">
                <p className="text-slate-600 font-medium">Other</p>
                <p className="font-bold text-slate-800">{formatCurrency(breakdown.other)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
