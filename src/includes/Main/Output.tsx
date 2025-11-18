import React, {  useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Terminal, Activity, CircuitBoard } from "lucide-react";
import { Fliplot } from "@/includes/Output/VcdViewer";
import Logs from "../Output/Logs";
import Errors from "../Output/Errors";
import Schematics from "../Output/Schematics";
import { useOutputStore } from "@/store/output";
import Netlist from "../Output/Netlist";
import JsonNetlist from "../Output/JsonNetlist";


export const Output: React.FC = () => {
  const [activeTab, setActiveTab] = useState("console"); // 👈 controlled tab state
  const { run }  = useOutputStore();
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full h-full flex flex-col"
    >
      {/* --- Tab Headers --- */}
      <TabsList className="flex gap-1 border-b border-border bg-muted/30 rounded-none px-2 py-1 w-full">
        <TabsTrigger
          value="logs"
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary px-3 py-2 rounded-md transition-all"
        >
          <Terminal className="w-4 h-4" />
          <span className="text-sm font-medium">Logs</span>
        </TabsTrigger>
          <TabsTrigger
          value="error"
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary px-3 py-2 rounded-md transition-all"
        >
          <Terminal className="w-4 h-4" />
          <span className="text-sm font-medium">Error</span>
        </TabsTrigger>
         <TabsTrigger
          value="netlist"
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary px-3 py-2 rounded-md transition-all"
        >
          <Terminal className="w-4 h-4" />
          <span className="text-sm font-medium">Netlist</span>
        </TabsTrigger>

          <TabsTrigger
          value="json_netlist"
          className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-primary px-3 py-2 rounded-md transition-all"
        >
          <Terminal className="w-4 h-4" />
          <span className="text-sm font-medium">JSON Netlist</span>
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

      
      </TabsList>

      {/* --- Tab Panels --- */}
      <div className="flex-1 overflow-auto bg-background">
        <TabsContent value="console" className="h-full">
         {
          run &&  <Logs />
         }
        

        </TabsContent>
        <TabsContent value="error" className="h-full">
         {
          run &&  <Errors />
         }
        

        </TabsContent>

           <TabsContent value="netlist" className="h-full">
         {
          run &&  <Netlist />
         }
        

        </TabsContent>

           <TabsContent value="json_netlist" className="h-full">
         {
          run &&  <JsonNetlist />
         }
        

        </TabsContent>

        <TabsContent value="waveform" className="h-full">
          <Fliplot />
          {
           run && <Fliplot />
         }
        </TabsContent>

        <TabsContent value="schematic" className="h-full">
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            
             {
           run && <Schematics />
         }
          </div>
        </TabsContent>

    
      </div>
    </Tabs>
  );
};

