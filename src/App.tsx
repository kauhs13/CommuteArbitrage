import { useState, useEffect } from 'react';
import { Menu, X, Home, DollarSign, Briefcase, TrendingUp, Clock, AlertTriangle, ArrowRight, ArrowLeft, Save, History, Trash2, CheckCircle2 } from 'lucide-react';
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
  
  // Responsive State: On mobile, start with sidebar closed so they see the dashboard first
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);

  useEffect(() => {
    loadScenarios();
    // Add resize listener to handle orientation changes
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
      // Don't auto-set active scenario on load to show landing page first if preferred
      // But for now, we keep the logic consistent
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
      // On mobile, open sidebar so they can edit the new scenario
      if (window.innerWidth < 1024) setSidebarOpen(true);
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-400 text-lg font-semibold tracking-wide">Initializing Engine...</p>
        </div>
      </div>
    );
  }

  // --- LANDING PAGE VIEW (Mobile Optimized) ---
  if (!activeScenario) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 overflow-y-auto">
        <div className="max-w-6xl w-full py-6 md:py-10">
          
          {/* NAV BAR */}
          <nav className="flex justify-between items-center mb-8 px-2 md:px-4">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-lg md:text-xl tracking-tight">CommuteArbitrage</span>
             </div>
             <div className="text-slate-500 text-xs md:text-sm font-mono bg-slate-800 px-2 py-1 rounded">v1.0 Beta</div>
          </nav>

          {/* HERO CONTENT */}
          <div className="relative overflow-hidden bg-slate-800/50 rounded-3xl p-6 md:p-12 shadow-2xl ring-1 ring-white/10 mb-12">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 md:w-96 md:h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 md:w-96 md:h-96 bg-emerald-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-4 md:mb-6">
                  <TrendingUp className="w-3 h-3" /> The Lifestyle ROI Calculator
                </div>
                {/* RESPONSIVE FONT SIZES HERE */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 md:mb-6 leading-tight">
                  Is your "Cheap Rent" <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">costing you a fortune?</span>
                </h1>
                <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed">
                  We aggregate <b>Real Estate data</b>, <b>Mobility costs</b>, and your <b>Hourly Salary</b> to calculate your <span className="text-white font-semibold">True Cost of Living</span>.
                  <br></br><br></br>
                  Designed by Shubham Kaushik ❤️
                  <br></br><br></br>
                </p>
                <button
                  onClick={handleCreateScenario}
                  className="w-full md:w-auto group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 rounded-xl hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  Calculate My ROI
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <div className="grid gap-3 md:gap-4">
                 <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <h3 className="text-white font-bold flex items-center gap-2 text-sm md:text-base"><Clock className="w-4 h-4 text-blue-400"/> Time Valuation</h3>
                    <p className="text-slate-400 text-xs mt-1">We treat your commute time as lost billable hours ($/hr).</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <h3 className="text-white font-bold flex items-center gap-2 text-sm md:text-base"><DollarSign className="w-4 h-4 text-emerald-400"/> Cost Aggregation</h3>
                    <p className="text-slate-400 text-xs mt-1">Rent + Uber/Metro Fares + Vehicle Depreciation.</p>
                 </div>
              </div>
            </div>
          </div>

          {/* SAVED SCENARIOS STACK */}
          {scenarios.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex items-center justify-between mb-4 md:mb-6 px-2">
                <h3 className="text-white text-xl md:text-2xl font-bold flex items-center gap-2">
                  <History className="w-5 h-5 md:w-6 md:h-6 text-slate-400" /> Recent Calculations
                </h3>
                <span className="text-slate-500 text-xs md:text-sm bg-slate-800 px-2 py-1 rounded-full">{scenarios.length} saved</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scenarios.map((scenario) => (
                  <div 
                    key={scenario.id} 
                    onClick={() => setActiveScenario(scenario)}
                    className="group cursor-pointer bg-slate-800/80 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 transition-all p-5 rounded-2xl relative shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="bg-blue-900/30 p-2 rounded-lg">
                        <Briefcase className="w-4 h-4 text-blue-400" />
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteScenario(scenario.id); }}
                        className="text-slate-600 hover:text-red-400 p-1 hover:bg-red-400/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <h4 className="text-white font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors truncate">
                      {scenario.name || "Untitled Scenario"}
                    </h4>
                    <p className="text-slate-400 text-xs mb-4">
                      {scenario.days_in_office} days/week • {scenario.commute_distance}km
                    </p>
                    
                    <div className="flex items-center text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded w-fit uppercase tracking-wide">
                      View Report
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

  // --- CALCULATOR DASHBOARD VIEW ---
  
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
      <div className="flex h-screen flex-col lg:flex-row overflow-hidden">
        
        {/* MOBILE OVERLAY BACKDROP */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR - RESPONSIVE */}
        <div
          className={`
            fixed lg:static inset-y-0 left-0 z-30
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:hidden'}
            w-[85vw] sm:w-96 lg:w-96 bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col
          `}
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-800 tracking-tight">CommuteArbitrage</h1>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Parameters</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <ScenarioManager
              scenarios={scenarios}
              activeScenario={activeScenario}
              onSelectScenario={(scenario) => {
                setActiveScenario(scenario);
                // On mobile, close sidebar after selection so they see results
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              onCreateScenario={handleCreateScenario}
              onDuplicateScenario={handleDuplicateScenario}
              onDeleteScenario={handleDeleteScenario}
            />

            <div className="h-px bg-slate-100 my-4"></div>

            <InputPanel scenario={activeScenario} onScenarioChange={handleScenarioChange} />
            
            {/* MOBILE ONLY: Show Results Button at bottom of sidebar */}
            <div className="lg:hidden pt-4 pb-20">
               <button 
                 onClick={() => setSidebarOpen(false)}
                 className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-4 rounded-xl font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
               >
                 <CheckCircle2 className="w-5 h-5"/> Update & See Results
               </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 h-full overflow-y-auto w-full relative">
          <div className="p-4 lg:p-8 pb-32">
            
            {/* TOP BAR MOBILE: Menu Button */}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden absolute top-4 left-4 z-10 p-3 bg-white text-slate-700 rounded-xl shadow-lg border border-slate-100 active:scale-95 transition-all"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}

            <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8 pt-12 lg:pt-0">
              
              {/* NAVIGATION HEADER (Back/Save) */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <button 
                  onClick={() => setActiveScenario(null)}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors text-sm md:text-base"
                >
                  <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                  Back to Dashboard
                </button>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  <span className="text-xs text-slate-400 hidden md:block">Auto-saving...</span>
                  <button 
                    onClick={() => setActiveScenario(null)}
                    className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all font-semibold shadow-md hover:shadow-xl text-sm md:text-base"
                  >
                    <Save className="w-4 h-4" />
                    Save & Exit
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-2">Comparison Analysis</h2>
                <p className="text-slate-600 text-sm md:text-base">Real-time breakdown of your rent vs. commute trade-off.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <ComparisonCard
                  title="City Center"
                  location="Living near the office"
                  icon={<Home className="w-6 h-6 md:w-7 md:h-7" />}
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
                  icon={<Home className="w-6 h-6 md:w-7 md:h-7" />}
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

              <div className="mt-8 border-t border-slate-200 pt-8 pb-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 opacity-70">
                  <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4" /> Methodology
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xl">
                      Calculations based on standard urban mobility rates (₹18-22/km avg), local real estate benchmarks, and your self-reported income valuation. 
                    </p>
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