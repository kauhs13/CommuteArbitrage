import { Scenario } from '../types';
import { Plus, Trash2, Copy } from 'lucide-react';

interface ScenarioManagerProps {
  scenarios: Scenario[];
  activeScenario: Scenario | null;
  onSelectScenario: (scenario: Scenario) => void;
  onCreateScenario: () => void;
  onDuplicateScenario: (scenario: Scenario) => void;
  onDeleteScenario: (id: string) => void;
}

export const ScenarioManager = ({
  scenarios,
  activeScenario,
  onSelectScenario,
  onCreateScenario,
  onDuplicateScenario,
  onDeleteScenario,
}: ScenarioManagerProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-blue-100">
        <h2 className="text-xl font-bold text-slate-800">My Scenarios</h2>
        <button
          onClick={onCreateScenario}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          New
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {scenarios.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">No scenarios yet. Create one to get started!</p>
        ) : (
          scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all group ${
                activeScenario?.id === scenario.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-slate-50 hover:border-blue-300'
              }`}
              onClick={() => onSelectScenario(scenario)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{scenario.name}</p>
                  <p className="text-xs text-slate-600 mt-1">
                    ₹{(scenario.annual_salary / 100000).toFixed(1)}L • {scenario.commute_distance}km commute
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateScenario(scenario);
                    }}
                    className="p-2 hover:bg-blue-200 rounded-lg transition-all"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4 text-blue-600" />
                  </button>
                  {!scenario.is_default && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this scenario?')) {
                          onDeleteScenario(scenario.id);
                        }
                      }}
                      className="p-2 hover:bg-red-200 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
