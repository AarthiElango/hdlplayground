import { get } from 'lodash';
import { useOutputStore } from "@/store/output";
import { useState } from 'react';
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils"; // optional, for className concatenation

export default function Schematics() {
  const { result } = useOutputStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const htmlString = get(result, 'schematic.schematic_svg', '');

  return (
    <div
      className={cn(
        "relative w-full h-full bg-white transition-all duration-300 svg-viewer",
        isFullscreen && "fixed inset-0 z-50 p-4 bg-white"
      )}
    >
      {/* Fullscreen Toggle Button */}
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        className={cn(
          "absolute top-3 right-3 z-50 p-2 rounded-full border border-gray-300 backdrop-blur-sm",
          "bg-white/80 hover:bg-white/90 text-gray-800 shadow-lg transition-all"
        )}
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? (
          <Minimize2 className="h-5 w-5 text-gray-600" />
        ) : (
          <Maximize2 className="h-5 w-5 text-gray-600" />
        )}
      </button>

      {/* SVG Container */}
      <div
        className="svg-content w-full h-full overflow-auto"
        dangerouslySetInnerHTML={{ __html: htmlString }}
      ></div>
    </div>
  );
}
