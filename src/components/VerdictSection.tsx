import { TrendingUp, TrendingDown, Zap, DollarSign } from 'lucide-react';
import { ComparisonResult } from '../types';
import { formatCurrency, formatCurrencyCompact } from '../utils/calculations';

interface VerdictSectionProps {
  result: ComparisonResult;
}

export const VerdictSection = ({ result }: VerdictSectionProps) => {
  const isCityBetter = result.verdict === 'city_center';

  return (
    <div
      className={`rounded-2xl shadow-2xl p-8 md:p-12 ${
        isCityBetter ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-emerald-600 to-emerald-700'
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="flex items-center gap-4">
          {isCityBetter ? (
            <Zap className="w-12 h-12 text-yellow-300 animate-pulse" />
          ) : (
            <TrendingDown className="w-12 h-12 text-green-200 animate-pulse" />
          )}
          <div>
            <h3 className="text-3xl font-black text-white mb-2">VERDICT</h3>
            <p className="text-white text-opacity-90 font-semibold text-lg leading-tight">
              {isCityBetter
                ? 'Move Closer! You are losing money sitting in traffic.'
                : 'Commute! The rent savings are worth the travel.'}
            </p>
          </div>
        </div>

        <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
          <p className="text-white text-opacity-80 text-sm font-semibold mb-2">Monthly Savings</p>
          <p className="text-4xl font-black text-white mb-2">{formatCurrencyCompact(result.monthlySavings)}</p>
          <p className="text-white text-opacity-80 text-sm">
            ≈ {formatCurrencyCompact(result.annualSavings)}/year
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20 text-center">
            <p className="text-white text-opacity-80 text-xs font-semibold mb-1">City Center</p>
            <p className="text-2xl font-black text-white">{formatCurrencyCompact(result.totalCityCost)}</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-20 text-center">
            <p className="text-white text-opacity-80 text-xs font-semibold mb-1">Suburbs</p>
            <p className="text-2xl font-black text-white">{formatCurrencyCompact(result.totalSuburbCost)}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm border border-white border-opacity-20">
          <p className="text-white text-opacity-80 text-xs font-semibold mb-1">Daily Commute</p>
          <p className="text-2xl font-bold text-white">{result.commuteHoursPerDay.toFixed(1)}h</p>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm border border-white border-opacity-20">
          <p className="text-white text-opacity-80 text-xs font-semibold mb-1">Monthly Transport</p>
          <p className="text-2xl font-bold text-white">{formatCurrencyCompact(result.transportCost)}</p>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm border border-white border-opacity-20">
          <p className="text-white text-opacity-80 text-xs font-semibold mb-1">Monthly Opportunity</p>
          <p className="text-2xl font-bold text-white">{formatCurrencyCompact(result.monthlyOpportunityCost)}</p>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm border border-white border-opacity-20">
          <p className="text-white text-opacity-80 text-xs font-semibold mb-1">Annual Savings</p>
          <p className="text-2xl font-bold text-white">{formatCurrencyCompact(result.annualSavings)}</p>
        </div>
      </div>
    </div>
  );
};
