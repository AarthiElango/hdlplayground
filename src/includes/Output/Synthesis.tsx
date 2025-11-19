import { get } from 'lodash';
import { useOutputStore } from "@/store/output";
import { useState } from 'react';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, Play, Loader2, FileText } from "lucide-react";

export default function Schematics() {
  const { result, setResult } = useOutputStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [running, setRunning] = useState(false);
  const [design, setDesign] = useState(`module half_adder(
    input a,
    input b,
    output sum,
    output carry
);
    assign sum = a ^ b;
    assign carry = a & b;
endmodule`);
  const [consoleOut, setConsoleOut] = useState("Click 'Run Synthesis' to start...");

  const htmlString = get(result, 'schematic.schematic_svg', '');

  const runSynthesis = async () => {
    setRunning(true);
    setConsoleOut("🚀 Starting synthesis process...\nPlease wait...");

    try {
      console.log("Sending request to backend...");
      
      const response = await fetch("http://localhost:4000/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          design: design,
          testbench: "" // Empty testbench for synthesis-only
        }),
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Received data:", data);
      
      setConsoleOut(data.console || "No output received");
      
      // Store the result in the output store
      setResult({
        ...result,
        schematic: {
          schematic_svg: data.schematic || '',
          success: data.steps?.synthesis || false,
          console: data.console
        }
      });
      
    } catch (err) {
      console.error("Error:", err);
      setConsoleOut(`❌ Error: ${err.message}\n\n🔧 Troubleshooting:\n• Make sure backend is running on port 4000\n• Check Docker container is started\n• Verify no firewall blocking the connection\n\nTry running: docker ps`);
      
      setResult({
        ...result,
        schematic: {
          schematic_svg: '',
          success: false,
          console: `Error: ${err.message}`
        }
      });
    } finally {
      setRunning(false);
    }
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const resetZoom = () => setZoom(1);

  return (
    <div
      className={`relative w-full h-full bg-gradient-to-br from-slate-50 to-gray-100 transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50 bg-white" : ""
      }`}
    >
      {!isFullscreen && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full p-4">
          {/* Left Panel - Code Editor */}
          <div className="flex flex-col bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Verilog Design
              </h2>
              <button
                onClick={runSynthesis}
                disabled={running || !design.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
              >
                {running ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Synthesizing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Synthesis
                  </>
                )}
              </button>
            </div>

            <textarea
              value={design}
              onChange={(e) => setDesign(e.target.value)}
              disabled={running}
              className="flex-1 bg-slate-900 text-green-400 font-mono text-sm p-4 resize-none focus:outline-none"
              placeholder="Enter your Verilog design code here..."
              spellCheck={false}
            />

            {/* Console Output */}
            <div className="border-t border-gray-200">
              <div className="p-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700">Console Output</h3>
              </div>
              <pre className="bg-slate-900 text-gray-300 font-mono text-xs p-4 h-40 overflow-y-auto whitespace-pre-wrap">
                {consoleOut}
              </pre>
            </div>
          </div>

          {/* Right Panel - Schematic Viewer */}
          <div className="relative bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <SchematicViewer
              htmlString={htmlString}
              isFullscreen={false}
              setIsFullscreen={setIsFullscreen}
              zoom={zoom}
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              resetZoom={resetZoom}
            />
          </div>
        </div>
      )}

      {isFullscreen && (
        <SchematicViewer
          htmlString={htmlString}
          isFullscreen={true}
          setIsFullscreen={setIsFullscreen}
          zoom={zoom}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          resetZoom={resetZoom}
        />
      )}
    </div>
  );
}

function SchematicViewer({ htmlString, isFullscreen, setIsFullscreen, zoom, zoomIn, zoomOut, resetZoom }) {
  return (
    <div className="relative w-full h-full bg-white">
      {/* Toolbar */}
      <div className="absolute top-3 right-3 z-50 flex items-center gap-2">
        {/* Zoom Controls */}
        {htmlString && (
          <>
            <button
              onClick={zoomOut}
              className="p-2 rounded-full border border-gray-300 backdrop-blur-sm bg-white/80 hover:bg-white/90 text-gray-800 shadow-lg transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4 text-gray-600" />
            </button>
            
            <button
              onClick={resetZoom}
              className="p-2 rounded-full border border-gray-300 backdrop-blur-sm bg-white/80 hover:bg-white/90 text-gray-800 shadow-lg transition-all"
              title="Reset Zoom"
            >
              <RotateCcw className="h-4 w-4 text-gray-600" />
            </button>
            
            <button
              onClick={zoomIn}
              className="p-2 rounded-full border border-gray-300 backdrop-blur-sm bg-white/80 hover:bg-white/90 text-gray-800 shadow-lg transition-all"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4 text-gray-600" />
            </button>
          </>
        )}

        {/* Fullscreen Toggle */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-full border border-gray-300 backdrop-blur-sm bg-white/80 hover:bg-white/90 text-gray-800 shadow-lg transition-all"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="h-5 w-5 text-gray-600" />
          ) : (
            <Maximize2 className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* SVG Container */}
      <div className="svg-content w-full h-full overflow-auto p-4">
        {htmlString ? (
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              transition: 'transform 0.2s ease'
            }}
            dangerouslySetInnerHTML={{ __html: htmlString }}
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
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
            <p className="font-semibold text-gray-500">No schematic available</p>
            <p className="text-sm mt-2 text-gray-400">Run synthesis to generate schematic</p>
          </div>
        )}
      </div>

      {/* Zoom Indicator */}
      {htmlString && (
        <div className="absolute bottom-3 left-3 z-50 px-3 py-1 rounded-full border border-gray-300 backdrop-blur-sm bg-white/80 text-gray-700 text-sm shadow-lg">
          {Math.round(zoom * 100)}%
        </div>
      )}
    </div>
  );
}