import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Terminal, Activity, CircuitBoard, Cog } from "lucide-react";
import { Fliplot } from "@/components/output/fliplot";
import { useWorkspaceStore } from "@/store/workspace";

export const OutputPanel: React.FC = () => {
  const [uuid, setUuid] = useState("");
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState("console"); // 👈 controlled tab state

  const { runResult } = useWorkspaceStore();

  useEffect(() => {
    setUuid('');
    setError('')
    if (!runResult) return;

    if (runResult.uuid) {
      setUuid(runResult.uuid);
      setActiveTab("waveform"); // 👈 open waveform tab automatically
    } else if (runResult.error) {
      setActiveTab("console"); // 👈 open console tab on error
      setError(runResult.error);
    }
  }, [runResult]);

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
          <Cog className="w-4 h-4" />
          <span className="text-sm font-medium">Synthesis</span>
        </TabsTrigger>
      </TabsList>

      {/* --- Tab Panels --- */}
      <div className="flex-1 overflow-auto bg-background">
        <TabsContent value="console" className="h-full">
          {
            error && (<div className="font-mono text-xs text-muted-foreground p-3 text-red-500">
              {error.split(/\r?\n/).map((line: string, i: number) => (
                <div key={i}>{line}</div>
              ))}
            </div>)
          }

        </TabsContent>

        <TabsContent value="waveform" className="h-full">
          {uuid && <Fliplot uuid={uuid} />}
        </TabsContent>

        <TabsContent value="schematic" className="h-full">
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            (Schematic viewer area)
          </div>
        </TabsContent>

        <TabsContent value="synthesis" className="h-full">
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            (Synthesis report area)
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default OutputPanel;
