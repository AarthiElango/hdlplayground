import { useOutputStore } from "@/store/output";
import { get } from 'lodash';

export default function Logs() {
  
  const { result } = useOutputStore();

  return (
    <div className="bg-gray-900 text-white font-mono p-4 h-full w-full overflow-y-auto">
      <h4>Simulation</h4>
      <p>{get(result, 'simulation.log')}</p>

      <h4>Schematic</h4>
      <p>{get(result, 'schematic.log')}</p>

    </div>
  );
}
