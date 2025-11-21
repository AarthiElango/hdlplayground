import { useAuthStore } from "@/store/auth";
import { useHeaderStore } from "@/store/header";
import { useMainStore } from "@/store/main";
import { useWorkspaceStore } from "@/store/workspace";
import { cloneDeep, get } from "lodash";
import api from "./axios";
import { toast } from "sonner";
import { useOutputStore } from "@/store/output";


export function useActions() {

    const { setLastAction } = useHeaderStore();
    const { logout, toggleGuestDialog } = useAuthStore();
    const user = useAuthStore((state) => state.user);
    const files = useWorkspaceStore((state) => state.files);
    const { project, toggleProjectDialog } = useMainStore();
    const { toggleMyProjects } = useHeaderStore();
    const { tool } = useMainStore();
    const { setRun, setResult } = useOutputStore();

    /**
     * Extract module name from Verilog code
     * Matches: module <module_name> ( or module <module_name>;
     */
    function extractModuleName(verilogCode: string): string | null {
        if (!verilogCode) return null;
        
        // Match "module <name>" followed by optional whitespace and either ( or ;
        // This handles: module design(... or module design_tb; or module design  (
        const moduleRegex = /module\s+([a-zA-Z_][a-zA-Z0-9_]*)(?:\s*#\s*(\([^)]*\)|programmable\s*\([^)]*\)))?/;
        const match = verilogCode.match(moduleRegex);
        
        return match ? match[1].trim() : null;
    }

    function onDownloadClick() {
        Object.keys(files).forEach((category) => {
            files[category].forEach((file: any) => {
                const blob = new Blob([file.contents || ""], { type: "text/plain" });
                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = file.name; // design.v / tb.v
                a.click();

                URL.revokeObjectURL(url);
            });
        });
    }

    async function onSaveClick() {
        const payload = cloneDeep(project);
        payload.files = files;
        payload.tool_id = tool.id;
        const response = await api.put(`projects/${project.slug}`, payload);
        if (response.data.success) {
            toast.success("Save successful");
        }
    }

    async function onRunClick() {
    setRun(false);

    const design = String(get(files, 'design.0.contents', ''))?.trim();;
    const testbench = String(get(files, 'testbench.0.contents', ''))?.trim();

    // Extract module names if code is present
    const designModuleName = design ? extractModuleName(design) : null;
    const testbenchModuleName = testbench ? extractModuleName(testbench) : null;

    console.log("Detected modules:", { designModuleName, testbenchModuleName });

    // Build final code depending on what files exist
    let verilogForSimulation = "";
    let topModule = "";

    if (design && testbench) {
        // Both exist → normal flow
        verilogForSimulation = `${design}\n\n${testbench}`;
        topModule = testbenchModuleName || ""; 
    } 
    else if (design && !testbench) {
        // Only design file exists
        verilogForSimulation = design;
        topModule = designModuleName || ""; 
    } 
    else if (!design && testbench) {
        // Only testbench exists
        verilogForSimulation = testbench;
        topModule = testbenchModuleName || ""; 
    } 
    else {
        toast.error("No Verilog code found.");
        return;
    }

    // Send simulation request
    const simulationPayload = { 
        verilog: verilogForSimulation, 
        top: topModule 
    };

    const simulation = await api.post(
        `projects/${project.slug}/run/simulation`, 
        simulationPayload
    );

    // For schematic → only run if design code exists
    let schematic = { data: null };
    if (design && designModuleName) {
        const schematicPayload = {
            verilog: design,
            top: designModuleName
        };
        schematic = await api.post(
            `projects/${project.slug}/run/schematic`,
            schematicPayload
        );
    }

    // Store results
    setResult({ simulation: simulation.data, schematic: schematic.data });
    setRun(true);
}

    async function onActionClick(action: string) {

        if (action == 'login') {
            toggleGuestDialog(true);
            return;
        }
        
        if (action == 'logout') {
            logout();
            localStorage.clear();
            return;
        }

        if (!user || !user.username) {
            setLastAction(action);
            toggleGuestDialog(true);
            return;
        }

        if (action == 'download') {
            onDownloadClick();
            return;
        }

        if (action == 'myprojects') {
            toggleMyProjects(true);
            return;
        }

        if (!project || !project.slug) {
            setLastAction(action);
            toggleProjectDialog(true);
            return;
        }

        if (action == 'save') {
            onSaveClick();
        }

        if (action == 'run') {
            onRunClick();
        }
    }

    return {
        onActionClick
    }
}