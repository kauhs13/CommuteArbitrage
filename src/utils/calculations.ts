import { ComparisonResult, ExpenseBreakdown } from '../types';

const AVERAGE_SPEED_KMH = 30;
const TRANSPORT_COST_PER_KM = 20;
const WORKING_DAYS_PER_MONTH = 4.33;

export const calculateComparison = (
  annualSalary: number,
  daysInOffice: number,
  commuteDistance: number,
  cityRent: number,
  suburbRent: number,
  cityOtherExpenses: number,
  suburbOtherExpenses: number
): ComparisonResult => {
  const monthlySalary = annualSalary / 12;
  const dailyRate = monthlySalary / 30;
  const hourlyRate = monthlySalary / 240;

  const commuteHoursPerDay = (commuteDistance * 2) / AVERAGE_SPEED_KMH;
  const monthlyOpportunityCost = commuteHoursPerDay * hourlyRate * daysInOffice * WORKING_DAYS_PER_MONTH;
  const transportCost = commuteDistance * TRANSPORT_COST_PER_KM * 2 * daysInOffice * WORKING_DAYS_PER_MONTH;

  const totalCityCost = cityRent + cityOtherExpenses;
  const totalSuburbCost = suburbRent + transportCost + monthlyOpportunityCost + suburbOtherExpenses;

  const monthlySavings = Math.abs(totalCityCost - totalSuburbCost);
  const annualSavings = monthlySavings * 12;

  return {
    totalCityCost,
    totalSuburbCost,
    transportCost,
    opportunityCost: monthlyOpportunityCost,
    commuteHoursPerDay,
    verdict: totalCityCost < totalSuburbCost ? 'city_center' : 'suburbs',
    monthlyOpportunityCost,
    monthlySavings,
    annualSavings,
  };
};

export const getCityExpenseBreakdown = (
  cityRent: number,
  cityOtherExpenses: number
): ExpenseBreakdown => ({
  rent: cityRent,
  transport: 0,
  opportunity: 0,
  other: cityOtherExpenses,
  total: cityRent + cityOtherExpenses,
});

export const getSuburbExpenseBreakdown = (
  suburbRent: number,
  transportCost: number,
  opportunityCost: number,
  suburbOtherExpenses: number
): ExpenseBreakdown => ({
  rent: suburbRent,
  transport: transportCost,
  opportunity: opportunityCost,
  other: suburbOtherExpenses,
  total: suburbRent + transportCost + opportunityCost + suburbOtherExpenses,
});

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCurrencyCompact = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
  return `₹${amount}`;
};

export const calculateBreakeven = (
  cityRent: number,
  suburbRent: number,
  transportCostPerMonth: number,
  opportunityCostPerMonth: number,
  suburbOtherExpenses: number,
  cityOtherExpenses: number
): number => {
  const rentDifference = cityRent - suburbRent;
  const otherExpensesDifference = cityOtherExpenses - suburbOtherExpenses;
  const variableCosts = transportCostPerMonth + opportunityCostPerMonth;

  if (variableCosts <= 0) return 0;

  return Math.max(0, (rentDifference + otherExpensesDifference) / variableCosts);
};
