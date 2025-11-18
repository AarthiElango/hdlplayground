import { useAuthStore } from "@/store/auth";
import { useHeaderStore } from "@/store/header";
import { useMainStore } from "@/store/main";
import { useWorkspaceStore } from "@/store/workspace";
import { cloneDeep, get } from "lodash";
import api from "./axios";
import { toast } from "sonner";
// import { v4 as uuidv4 } from "uuid";
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
        const design = (get(files, 'design.0.contents'));
        const testbench = get(files, 'testbench.0.contents')
       
        const verilogForSimulation = (`${design}\n\n${testbench}`).replace(/\r\n/g, "\n")
        const verilogForSchematic = (`${design}`).replace(/\r\n/g, "\n")
        const simulationPayload = { verilog:verilogForSimulation , top: "tb_blink" }
        const simulation = await api.post(`projects/${project.slug}/run/simulation`, simulationPayload);
       
        const schematicPayload = { verilog: verilogForSchematic, top: "blink" }
        const schematic = await api.post(`projects/${project.slug}/run/schematic`, schematicPayload);
        setResult({simulation:simulation.data, schematic:schematic.data})
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
            setLastAction(action); // will be cleared on login
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
            setLastAction(action); // will be cleared on login
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