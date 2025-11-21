
import { useOutputStore } from "@/store/output";
import { get } from 'lodash';



export default function Synthesis() {
   const { result } = useOutputStore();
  
    return (
      <div className="bg-gray-900 text-white font-mono h-full w-full overflow-y-auto">
        <pre>{get(result, 'schematic.synthesis_report')}</pre>
  
      </div>
    );
  
}
