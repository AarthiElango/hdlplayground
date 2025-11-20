import { useOutputStore } from "@/store/output";
import { get } from 'lodash';

export default function Errors() {
  
  const { result } = useOutputStore();

  // Get simulation error
  const simulationError = get(result, 'simulation.error.detail', '');
  
  // Optionally get synthesis error (commented out - only show if needed)
  // const synthesisError = get(result, 'schematic.error.detail', '');

  return (
    <div className="bg-gray-900 text-red-500 font-mono p-4 h-full w-full overflow-y-auto whitespace-pre-wrap">
      {simulationError && (
        <>
          <h4 className="text-red-400 font-bold mb-2">Simulation Error</h4>
          <p className="text-red-300">{simulationError}</p>
        </>
      )}

      {/* Synthesis/Schematic errors - COMMENTED OUT
      {synthesisError && (
        <>
          <h4 className="text-orange-400 font-bold mt-4 mb-2">Synthesis Error</h4>
          <p className="text-orange-300">{synthesisError}</p>
        </>
      )}
      */}
    </div>
  );
}