import Tooltip from "@/components/Tooltip"
import { Button } from "@/components/ui/button"
import { useSidebarStore } from "@/store/sidebar"
import { ArrowLeftFromLine, ArrowRightFromLine, Save, Play, FilePlus, Download, History, DraftingCompass } from "lucide-react"
import { useEffect, useState } from "react";
import ToolDialog from "./Secondary/ToolDialog";
import { useShared } from "@/lib/shared";
import { useMainStore } from "@/store/main";
import { useActions } from "@/lib/action";
import { useHeaderStore } from "@/store/header";
import  {MyProjects}  from '@/includes/Secondary/MyProjects';

export default function Secondary() {
    const { showSidebar, toggleSidebar } = useSidebarStore();
    const [openToolsDialog, setOpenToolsDialog] = useState(false);
    const [tools, setTools] = useState([]);
    const { fetchTools } = useShared();
    const { template, project, setTool } = useMainStore();
    const { onActionClick} = useActions();
    const { showMyProjects } = useHeaderStore();
    useEffect(()=>{
        if(!template) return;
        async function getTools(){
            const toolsFetched = await fetchTools();// =[{slug:'icarus'},{slug:'system-verilog'}]
            const templateTools = template.tools; // =[icarus]
             const tools = toolsFetched.filter((t:any) => templateTools.includes(t.slug));
             let tool = tools[0];
             if(project && project.tool_id){
                let projectTool = tools.find((x:any) => x.id == project.tool_id);
                if(projectTool){
                    tool = projectTool
                }
             }
             setTool(tool);
            setTools(tools);
        }
        getTools();
    }, [template]);

    return (
        <>
            <div className="border-t bg-muted/30">

                <div className="flex items-center gap-2 px-4 py-2">
                    {
                        !project?.slug && <Tooltip title="Templates">
                        <Button variant="outline" onClick={()=> toggleSidebar()}>
                            { showSidebar?<ArrowLeftFromLine />:<ArrowRightFromLine />}
                            
                        </Button>
                    </Tooltip>
                    }
                    
                     <Button
                        onClick={()=>{ window.location.href = "/";}}
                        variant="outline"
                        size="sm"
                        className="hover:bg-green-500/10 hover:border-green-500/30"
                    >
                        <FilePlus className="h-4 w-4 mr-2" />
                        New
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={()=>onActionClick('save')}
                        className="hover:bg-green-500/10 hover:border-green-500/30"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                   onClick={()=>onActionClick('run')}
                   >
                        
                        <Play className="h-4 w-4 mr-2" />
                        Run
                    </Button>
                       <Button
                        variant="outline"
                        size="sm"
                        onClick={()=>onActionClick('download')}
                                       >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                    </Button>
                       <Button
                        variant="outline"
                        size="sm"
                        onClick={()=>onActionClick('myprojects')}

                         >
                        <History className="h-4 w-4 mr-2" />
                        My Projects
                    </Button>
                        {
                            tools?.length && <Button
                        variant="outline"
                        size="sm"
                        onClick={()=>setOpenToolsDialog(true)}
                         >
                        <DraftingCompass className="h-4 w-4 mr-2" />
                        Tools
                    </Button>
                        }
                      
                </div>
            </div>
            {showMyProjects && <MyProjects  />}

            { openToolsDialog && <ToolDialog tools={tools} onClose={()=>setOpenToolsDialog(false)} /> }
        </>
    )
}