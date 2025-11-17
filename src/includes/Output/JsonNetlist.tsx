import { useOutputStore } from "@/store/output";
import { useEffect } from "react";
import { get } from 'lodash';



export default function JsonNetlist() {
   const { result } = useOutputStore();
  
    return (
      <div className="bg-gray-900 text-white font-mono p-4 h-full w-full overflow-y-auto">
        <pre>{get(result, 'schematic.json_netlist')}</pre>
  
      </div>
    );
  
}
