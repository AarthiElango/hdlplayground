
import { Button } from "@/components/ui/button";
import { useWorkspaceStore } from "@/store/workspace";
import { Save, Play, Download, History } from "lucide-react";
import { useState } from "react";
import { ProjectHistory } from "./ProjectHistory";
import { get } from "lodash";


export default function HeaderActions() {
 
 
  const {isSourceCodeEdited, isTestbenchCodeEdited, setWorkspaceAction, setCodeEditorValues} = useWorkspaceStore();
 
  const [showHistory, setShowHistory] = useState(false);

  function saveProject(){
    setWorkspaceAction({action:"save"});
  }

  function runSimulation(){
    setWorkspaceAction({action:"run"});
    
  }

  function downloadFiles(){
    setWorkspaceAction({action:"download"});

  }

  function onRestoreVersion(version:any){
    const values = {src:get(version,'contents.src'), tb:get(version,'contents.tb')}
    setCodeEditorValues(values)
    setShowHistory(false);
  }
 

  return (
    <>
      <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveProject}
                  disabled={!isSourceCodeEdited && !isTestbenchCodeEdited}
                  className="hover:bg-green-500/10 hover:border-green-500/30"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={runSimulation}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Run
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadFiles}
                  className="hover:bg-blue-500/10 hover:border-blue-500/30"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(true)}
                  className="hover:bg-purple-500/10 hover:border-purple-500/30"
                >
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>

                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGithubOpen(true)}
                  className="hover:bg-gray-500/10 hover:border-gray-500/30"
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button> */}
                
              </>
              {
                showHistory &&  <ProjectHistory onOpenChange={()=>setShowHistory(false)}  onRestoreVersion={onRestoreVersion} />
              }
   
    
    </>

         
  );
}
