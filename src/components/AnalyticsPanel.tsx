import { BarChart3, PieChart, TrendingUp, Calendar } from 'lucide-react';
import { ComparisonResult } from '../types';
import { formatCurrency, formatCurrencyCompact } from '../utils/calculations';

interface AnalyticsPanelProps {
  result: ComparisonResult;
  daysInOffice: number;
  commuteDistance: number;
}

export const AnalyticsPanel = ({ result, daysInOffice, commuteDistance }: AnalyticsPanelProps) => {
  const yearlyOpportunityCost = result.monthlyOpportunityCost * 12;
  const yearlyTransportCost = result.transportCost * 12;
  const daysCommutedPerYear = daysInOffice * 52;
  const costPerCommutingDay = result.transportCost / daysInOffice;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 pb-4 border-b-2 border-blue-100 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        Analytics & Insights
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
          <p className="text-sm font-semibold text-slate-700 mb-2">Annual Opportunity Cost</p>
          <p className="text-3xl font-black text-purple-700">{formatCurrencyCompact(yearlyOpportunityCost)}</p>
          <p className="text-xs text-slate-600 mt-2">
            {(result.commuteHoursPerDay * daysInOffice * 52).toFixed(0)} hours/year commuting
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-2 border-yellow-200">
          <p className="text-sm font-semibold text-slate-700 mb-2">Annual Transport Cost</p>
          <p className="text-3xl font-black text-yellow-700">{formatCurrencyCompact(yearlyTransportCost)}</p>
          <p className="text-xs text-slate-600 mt-2">
            {formatCurrency(costPerCommutingDay)}/commute day
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
          <p className="text-sm font-semibold text-slate-700 mb-2">Days Commuted/Year</p>
          <p className="text-3xl font-black text-green-700">{daysCommutedPerYear}</p>
          <p className="text-xs text-slate-600 mt-2">
            {commuteDistance * 2} km × {daysInOffice} days/week
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
          <p className="text-sm font-semibold text-slate-700 mb-2">Time Commuted/Year</p>
          <p className="text-3xl font-black text-blue-700">{(result.commuteHoursPerDay * daysCommutedPerYear).toFixed(0)}h</p>
          <p className="text-xs text-slate-600 mt-2">
            That's {((result.commuteHoursPerDay * daysCommutedPerYear) / 24).toFixed(1)} full days!
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border-2 border-slate-300">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-slate-700" />
          Cost Breakdown Comparison
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-3">City Center (Monthly)</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white rounded-lg p-3">
                <span className="text-sm text-slate-700">Rent</span>
                <span className="font-bold text-slate-800">{formatCurrencyCompact(result.totalCityCost)}</span>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg p-3">
                <span className="text-sm text-slate-700">Other</span>
                <span className="font-bold text-slate-800">Included</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-3">Suburbs (Monthly)</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white rounded-lg p-3">
                <span className="text-sm text-slate-700">Rent</span>
                <span className="font-bold text-slate-800">Lower</span>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg p-3">
                <span className="text-sm text-slate-700">Transport + Time</span>
                <span className="font-bold text-slate-800">Added Cost</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Key Metrics
        </h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-black text-blue-700">
              {(daysCommutedPerYear * commuteDistance * 2).toFixed(0)}km
            </p>
            <p className="text-xs text-slate-600 mt-1">Distance/Year</p>
          </div>
          <div>
            <p className="text-2xl font-black text-blue-700">{daysInOffice * 4}</p>
            <p className="text-xs text-slate-600 mt-1">Office Days/Month</p>
          </div>
          <div>
            <p className="text-2xl font-black text-blue-700">
              {(result.monthlySavings / result.transportCost).toFixed(1)}x
            </p>
            <p className="text-xs text-slate-600 mt-1">Rent vs Transport</p>
          </div>
        </div>
      </div>
    </div>
  );
};
