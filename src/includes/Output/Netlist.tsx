
import { useOutputStore } from "@/store/output";
import { get } from 'lodash';



export default function Netlist() {
   const { result } = useOutputStore();
  
    return (
      <div className="bg-gray-900 text-white font-mono p-4 h-full w-full overflow-y-auto">
        <pre>{get(result, 'schematic.netlist')}</pre>
  
      </div>
    );
  
}
