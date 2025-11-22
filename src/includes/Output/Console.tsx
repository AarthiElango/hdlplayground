import { useOutputStore } from "@/store/output";
import { get } from 'lodash';
import { AlertCircle } from 'lucide-react';

export default function Console() {
  
  const { result } = useOutputStore();

  const simulationLog = get(result, 'simulation.log', '');
  const simulationError = get(result, 'simulation.error.detail', '');

  return (
    <div className="font-mono text-sm p-4 h-full w-full overflow-y-auto whitespace-pre-wrap">
      {simulationError ? (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <h4 className="text-red-400 font-bold text-xs uppercase tracking-wide">Simulation Error</h4>
          </div>
          <div className="text-red-300">{simulationError}</div>
        </div>
      ) : simulationLog ? (
        <div className="">{simulationLog}</div>
      ) : (
        <div className="text-center py-8">No output available</div>
      )}
    </div>
  );
}