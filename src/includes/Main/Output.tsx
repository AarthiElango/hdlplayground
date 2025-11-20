import React, { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Terminal, Activity, CircuitBoard, Settings } from "lucide-react";
import { Fliplot } from "@/includes/Output/VcdViewer";
import Console from "../Output/Console.tsx"; // Changed from Logs
import Schematics from "../Output/Schematics";
import { useOutputStore } from "@/store/output";

export const Output: React.FC = () => {
  const [activeTab, setActiveTab] = useState("console");
  const { run } = useOutputStore();

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full h-full flex flex-col"
    >
      {/* --- Tab Headers --- */}
      <TabsList className="flex gap-1 border-b border-border bg-muted/30 rounded-none px-2 py-1 w-full">
        <TabsTrigger
          value="console"
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary px-3 py-2 rounded-md transition-all"
        >
          <Terminal className="w-4 h-4" />
          <span className="text-sm font-medium">Console</span>
        </TabsTrigger>

        <TabsTrigger
          value="waveform"
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary px-3 py-2 rounded-md transition-all"
        >
          <Activity className="w-4 h-4" />
          <span className="text-sm font-medium">Waveform</span>
        </TabsTrigger>

        <TabsTrigger
          value="schematic"
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary px-3 py-2 rounded-md transition-all"
        >
          <CircuitBoard className="w-4 h-4" />
          <span className="text-sm font-medium">Schematic</span>
        </TabsTrigger>

        <TabsTrigger
          value="synthesis"
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary px-3 py-2 rounded-md transition-all"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">Synthesis</span>
        </TabsTrigger>
      </TabsList>

      {/* --- Tab Panels --- */}
      <div className="flex-1 overflow-auto bg-background">
        <TabsContent value="console" className="h-full">
          {run ? (
            <Console />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Run your code to see console output
            </div>
          )}
        </TabsContent>

        <TabsContent value="waveform" className="h-full">
          {run ? (
            <Fliplot />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Run your code to see waveforms
            </div>
          )}
        </TabsContent>

        <TabsContent value="schematic" className="h-full">
          {run ? (
            <Schematics />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Run your code to see schematic
            </div>
          )}
        </TabsContent>

        <TabsContent value="synthesis" className="h-full">
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            {run ? (
              <div className="text-center">
                <Settings className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p>Synthesis results will appear here</p>
              </div>
            ) : (
              "Run your code to see synthesis results"
            )}
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};