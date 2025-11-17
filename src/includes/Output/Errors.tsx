import { useOutputStore } from "@/store/output";
import { useEffect } from "react";
import { get } from 'lodash';

export default function Errors() {
  
  const { result } = useOutputStore();

  return (
    <div className="bg-gray-900 text-red-500 font-mono p-4 h-full w-full overflow-y-auto">
      <h4>Simulation</h4>
      <p>{get(result, 'simulation.error.detail')}</p>

      <h4>Schematic</h4>
      <p>{get(result, 'schematic.error.detail')}</p>

    </div>
  );
}
