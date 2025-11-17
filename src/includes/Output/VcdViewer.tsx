import { get } from 'lodash';
import { useOutputStore } from "@/store/output";
import { useState, type FC } from 'react';
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Fliplot: FC<{}> = () => {
  const { result } = useOutputStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const vcd = get(result, 'simulation.vcd', '');
  const APP_URL = import.meta.env.VITE_APP_URL;
const [mountedOnce] = useState(true);
  // Compute src once
  const src = vcd ? `${APP_URL}/fliplot/index.html?vcd=${btoa(vcd)}` : '';
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

      {/* Iframe */}
      <div className="svg-content w-full h-full overflow-auto">
        {mountedOnce && src && (
          <iframe
            src={src} // no key needed
            className="flex-1 w-full border-none"
            style={{ display: "block", height: "100%" }}
            title="VCD Viewer"
          />
        )}
      </div>
    </div>
  );
};
