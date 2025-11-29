import { useState, useEffect } from 'react';
import { Menu, X, Home, DollarSign, Briefcase, TrendingUp, Clock, AlertTriangle, ArrowRight, ArrowLeft, Save, History, Trash2 } from 'lucide-react';
import { Scenario } from './types';
import { InputPanel } from './components/InputPanel';
import { ComparisonCard } from './components/ComparisonCard';
import { VerdictSection } from './components/VerdictSection';
import { ScenarioManager } from './components/ScenarioManager';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import {
  calculateComparison,
  getCityExpenseBreakdown,
  getSuburbExpenseBreakdown,
} from './utils/calculations';
import {
  getOrCreateDefaultScenario,
  getScenarios,
  createScenario,
  updateScenario,
  deleteScenario,
} from './utils/supabase';

function App() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showMobileScenarios, setShowMobileScenarios] = useState(false);

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      setLoading(true);
      let scenarioList = await getScenarios();

      if (scenarioList.length === 0) {
        const defaultScenario = await getOrCreateDefaultScenario();
        scenarioList = [defaultScenario];
      }

      setScenarios(scenarioList);
      setActiveScenario(scenarioList[0]);
    } catch (error) {
      console.error('Error loading scenarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScenarioChange = async (updates: Partial<Scenario>) => {
    if (!activeScenario) return;

    const updated = { ...activeScenario, ...updates };
    setActiveScenario(updated);

    try {
      await updateScenario(activeScenario.id, updates);
      setScenarios(scenarios.map((s) => (s.id === activeScenario.id ? updated : s)));
    } catch (error) {
      console.error('Error updating scenario:', error);
    }
  };

  const handleCreateScenario = async () => {
    try {
      const newScenario = await createScenario({
        user_id: null,
        name: 'New Scenario',
        annual_salary: activeScenario?.annual_salary || 600000,
        days_in_office: 5,
        commute_distance: 20,
        city_center_rent: 35000,
        suburb_rent: 18000,
        other_city_expenses: 8000,
        other_suburb_expenses: 5000,
      });

      setScenarios([...scenarios, newScenario]);
      setActiveScenario(newScenario);
    } catch (error) {
      console.error('Error creating scenario:', error);
    }
  };

  const handleDuplicateScenario = async (scenario: Scenario) => {
    try {
      const newScenario = await createScenario({
        user_id: null,
        name: `${scenario.name} (Copy)`,
        annual_salary: scenario.annual_salary,
        days_in_office: scenario.days_in_office,
        commute_distance: scenario.commute_distance,
        city_center_rent: scenario.city_center_rent,
        suburb_rent: scenario.suburb_rent,
        other_city_expenses: scenario.other_city_expenses,
        other_suburb_expenses: scenario.other_suburb_expenses,
      });

      setScenarios([...scenarios, newScenario]);
      setActiveScenario(newScenario);
    } catch (error) {
      console.error('Error duplicating scenario:', error);
    }
  };

  const handleDeleteScenario = async (id: string) => {
    try {
      await deleteScenario(id);
      const filtered = scenarios.filter((s) => s.id !== id);
      setScenarios(filtered);

      if (activeScenario?.id === id) {
        setActiveScenario(filtered[0] || null);
      }
    } catch (error) {
      console.error('Error deleting scenario:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Loading CommuteArbitrage...</p>
        </div>
      </div>
    );
  }

  // --- START OF NEW LANDING PAGE CODE ---
    // LANDING PAGE VIEW (When no scenario is selected)
  if (!activeScenario) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 overflow-y-auto">
        <div className="max-w-6xl w-full py-10">
          
          {/* NAV BAR */}
          <nav className="flex justify-between items-center mb-8 px-4">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-xl tracking-tight">CommuteArbitrage</span>
             </div>
             <div className="text-slate-400 text-sm">v1.0.0 Beta</div>
          </nav>

          {/* HERO CONTENT */}
          <div className="relative overflow-hidden bg-slate-800/50 rounded-3xl p-8 md:p-12 shadow-2xl ring-1 ring-white/10 mb-12">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
                  <TrendingUp className="w-3 h-3" /> The Lifestyle ROI Calculator
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                  Is your "Cheap Rent" <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">costing you a fortune?</span>
                </h1>
                <p className="text-slate-300 text-lg mb-8">
                  We aggregate Real Estate data, Mobility costs, and your Hourly Salary to calculate your <b>True Cost of Living</b>.
                </p>
                <button
                  onClick={handleCreateScenario}
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 rounded-xl hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  Calculate My ROI
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              {/* Simple Feature Grid */}
              <div className="grid gap-4">
                 <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h3 className="text-white font-bold flex items-center gap-2"><Clock className="w-4 h-4 text-blue-400"/> Time Valuation</h3>
                    <p className="text-slate-400 text-xs mt-1">Commute time = Lost billable hours.</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h3 className="text-white font-bold flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-400"/> Cost Aggregation</h3>
                    <p className="text-slate-400 text-xs mt-1">Rent + Uber + Metro + Maintenance.</p>
                 </div>
              </div>
            </div>
          </div>

          {/* SAVED SCENARIOS SECTION (The Stack) */}
          {scenarios.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="text-white text-2xl font-bold flex items-center gap-2">
                  <History className="w-6 h-6 text-slate-400" /> Recent Calculations
                </h3>
                <span className="text-slate-500 text-sm">{scenarios.length} saved</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scenarios.map((scenario) => (
                  <div 
                    key={scenario.id} 
                    onClick={() => setActiveScenario(scenario)}
                    className="group cursor-pointer bg-slate-800 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-750 transition-all p-6 rounded-2xl relative"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-blue-900/30 p-2 rounded-lg">
                        <Briefcase className="w-5 h-5 text-blue-400" />
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteScenario(scenario.id); }}
                        className="text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <h4 className="text-white font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors">
                      {scenario.name || "Untitled Scenario"}
                    </h4>
                    <p className="text-slate-400 text-sm mb-4">
                      {scenario.days_in_office} days/week • {scenario.commute_distance}km
                    </p>
                    
                    <div className="flex items-center text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded w-fit">
                      Click to view breakdown
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  const result = calculateComparison(
    activeScenario.annual_salary,
    activeScenario.days_in_office,
    activeScenario.commute_distance,
    activeScenario.city_center_rent,
    activeScenario.suburb_rent,
    activeScenario.other_city_expenses,
    activeScenario.other_suburb_expenses
  );

  const cityBreakdown = getCityExpenseBreakdown(
    activeScenario.city_center_rent,
    activeScenario.other_city_expenses
  );

  const suburbBreakdown = getSuburbExpenseBreakdown(
    activeScenario.suburb_rent,
    result.transportCost,
    result.monthlyOpportunityCost,
    activeScenario.other_suburb_expenses
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex h-screen flex-col lg:flex-row">
        <div
          className={`${
            sidebarOpen ? 'w-full lg:w-96' : 'w-0'
          } bg-white shadow-2xl transition-all duration-300 overflow-hidden flex flex-col`}
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between lg:justify-start gap-3 mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-800">CommuteArbitrage</h1>
                  <p className="text-xs text-slate-500">Smart Location Analytics</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ScenarioManager
              scenarios={scenarios}
              activeScenario={activeScenario}
              onSelectScenario={(scenario) => {
                setActiveScenario(scenario);
                setShowMobileScenarios(false);
              }}
              onCreateScenario={handleCreateScenario}
              onDuplicateScenario={handleDuplicateScenario}
              onDeleteScenario={handleDeleteScenario}
            />

            <InputPanel scenario={activeScenario} onScenarioChange={handleScenarioChange} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mb-4 p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="max-w-5xl mx-auto space-y-8">
              {/* NEW NAVIGATION HEADER */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
                <button 
                  onClick={() => setActiveScenario(null)}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Dashboard
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 hidden md:block">Changes saved automatically</span>
                  <button 
                    onClick={() => setActiveScenario(null)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all font-semibold shadow-lg hover:shadow-xl"
                  >
                    <Save className="w-4 h-4" />
                    Save & Exit
                  </button>
                </div>
              </div>
              {/* END HEADER */}
              {/* START OF NEW HERO SECTION */}
              <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 md:p-12 mb-10 shadow-2xl ring-1 ring-slate-900/5">
              {/* Abstract Background Effect */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

              <div className="relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
                  <TrendingUp className="w-3 h-3" /> The Lifestyle ROI Calculator
                </div>

                {/* Main Headline */}
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight max-w-3xl">
                  Is your "Cheap Rent" actually <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">costing you a fortune?</span>
                </h2>

                <p className="text-slate-400 text-lg mb-8 max-w-2xl leading-relaxed">
      You save on rent by living far away, but you bleed money in traffic. 
      We aggregate <b>Rent</b>, <b>Commute Fares</b>, and your <b>Hourly Salary Value</b> to reveal your True Cost of Living.
                </p>

                {/* The 3 Value Props Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
                    <div className="bg-blue-500/20 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
                      <Clock className="w-4 h-4 text-blue-400" />
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1">Time Valuation</h3>
                    <p className="text-slate-400 text-xs">We treat your commute time as lost billable hours.</p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
                    <div className="bg-emerald-500/20 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1">Hidden Costs</h3>
                    <p className="text-slate-400 text-xs">Comparing Metro vs. Uber vs. Fuel wear-and-tear.</p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
                    <div className="bg-orange-500/20 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1">Opportunity Cost</h3>
                    <p className="text-slate-400 text-xs">The price you pay for every hour stuck at a signal.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* END OF NEW HERO SECTION */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ComparisonCard
                  title="City Center"
                  location="Living near the office"
                  icon={<Home className="w-7 h-7" />}
                  isCity={true}
                  result={result}
                  breakdown={cityBreakdown}
                  rent={activeScenario.city_center_rent}
                  otherExpenses={activeScenario.other_city_expenses}
                  onRentChange={(rent) => handleScenarioChange({ city_center_rent: rent })}
                  onOtherExpensesChange={(expenses) =>
                    handleScenarioChange({ other_city_expenses: expenses })
                  }
                />

                <ComparisonCard
                  title="Suburbs"
                  location="Living far from the office"
                  icon={<Home className="w-7 h-7" />}
                  isCity={false}
                  result={result}
                  breakdown={suburbBreakdown}
                  rent={activeScenario.suburb_rent}
                  otherExpenses={activeScenario.other_suburb_expenses}
                  onRentChange={(rent) => handleScenarioChange({ suburb_rent: rent })}
                  onOtherExpensesChange={(expenses) =>
                    handleScenarioChange({ other_suburb_expenses: expenses })
                  }
                />
              </div>

              <VerdictSection result={result} />

              <AnalyticsPanel
                result={result}
                daysInOffice={activeScenario.days_in_office}
                commuteDistance={activeScenario.commute_distance}
              />

              <div className="mt-12 border-t border-slate-200 pt-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 opacity-70 hover:opacity-100 transition-opacity">
                <div>
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Methodology
                  </h4>
                  <p className="text-sm text-slate-500 mt-1 max-w-xl">
                    Calculations based on standard urban mobility rates (₹18-22/km avg), local real estate benchmarks, and your self-reported income valuation. 
                  </p>
                </div>
                <div className="text-right hidden md:block">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Built For</div>
                  <div className="font-black text-slate-800">SMART WORKFORCE</div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
