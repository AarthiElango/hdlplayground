import { get } from 'lodash';
import { useOutputStore } from "@/store/output";
import { useState, useRef, useEffect, type FC } from 'react';
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Fliplot: FC<{}> = () => {
  const { result } = useOutputStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const vcd = get(result, 'simulation.vcd', '');
  const APP_URL = import.meta.env.VITE_APP_URL;

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const src = vcd ? `${APP_URL}/fliplot/index.html?vcd=${btoa(vcd)}` : '';

  useEffect(() => {
    const applyStyles = () => {
      try {
        const iframeDoc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
        if (!iframeDoc) return;

        // Remove old style
        const oldStyle = iframeDoc.getElementById('custom-fliplot-styles');
        if (oldStyle) oldStyle.remove();

        const style = iframeDoc.createElement('style');
        style.id = 'custom-fliplot-styles';
        
        if (isFullscreen) {
          // Fullscreen: Hide rm* and Development, show Zoom and Cursor in single row
          style.textContent = `
            /* Force toolbar to display horizontally */
            .navbar ul {
              display: flex !important;
              flex-direction: row !important;
              align-items: center !important;
            }
            
            .tool-group-container {
              display: inline-flex !important;
              flex-direction: row !important;
              margin-right: 10px !important;
            }
            
            .tool-group-tools {
              display: flex !important;
              flex-direction: row !important;
            }
            
            .tool-group-name {
              display: none !important;
            }
            
            /* Hide VCD section completely */
            #tool-group-file {
              display: none !important;
            }
            
            /* Show Zoom section */
            #tool-group-zoom {
              display: inline-flex !important;
            }
            
            /* Show Cursor section */
            #tool-group-cursor {
              display: inline-flex !important;
            }
            
            /* Hide Development section */
            #tool-group-development {
              display: none !important;
            }
            
            /* Increase structure column width */
            #structure-col {
              width: 180px !important;
              min-width: 180px !important;
            }
          `;
        } else {
          // Normal view: Show rm* and Zoom only in single row
          style.textContent = `
            /* Force toolbar to display horizontally */
            .navbar ul {
              display: flex !important;
              flex-direction: row !important;
              align-items: center !important;
            }
            
            .tool-group-container {
              display: inline-flex !important;
              flex-direction: row !important;
              margin-right: 10px !important;
            }
            
            .tool-group-tools {
              display: flex !important;
              flex-direction: row !important;
            }
            
            .tool-group-name {
              display: none !important;
            }
            
            /* Show VCD section but hide file open button */
            #tool-group-file {
              display: inline-flex !important;
            }
            
            #file-open-button {
              display: none !important;
            }
            
            /* Show Zoom section */
            #tool-group-zoom {
              display: inline-flex !important;
            }
            
            /* Hide Cursor section */
            #tool-group-cursor {
              display: none !important;
            }
            
            /* Hide Development section */
            #tool-group-development {
              display: none !important;
            }
            
            /* Increase structure column width */
            #structure-col {
              width: 180px !important;
              min-width: 180px !important;
            }
          `;
        }

        iframeDoc.head.appendChild(style);
      } catch (error) {
        console.error('Could not access iframe:', error);
      }
    };

    if (iframeRef.current) {
      applyStyles();
      iframeRef.current.addEventListener('load', applyStyles);
      return () => {
        iframeRef.current?.removeEventListener('load', applyStyles);
      };
    }
  }, [isFullscreen, src]);

  return (
    <div
      className={cn(
        "relative w-full h-full bg-white transition-all duration-300",
        isFullscreen && "fixed inset-0 z-50 p-4 bg-white"
      )}
    >
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

      <div className="w-full h-full overflow-auto">
        {src ? (
          <iframe
            ref={iframeRef}
            src={src}
            className="w-full h-full border-none"
            title="VCD Viewer"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg
              className="w-16 h-16 mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            <p className="font-semibold text-gray-500">No waveform data</p>
            <p className="text-sm mt-2 text-gray-400">Run simulation to view waveforms</p>
          </div>
        )}
      </div>
    </div>
  );
};