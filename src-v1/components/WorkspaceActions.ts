import api from "@/lib/axios";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import * as jQuery from 'jquery';
import { useWorkspaceStore } from "@/store/workspace";

export default function useWorkspaceActions() {

    const { setRunResult } = useWorkspaceStore();

    function onRun(props: any) {

        const data = {
            source_code: props.src,
            testbench_code: props.tb,
            uuid: uuidv4()
        }
        jQuery.ajax({
            url: "https://esilicon.skriptx.com/onesilicon-create.php",
            method: "POST",
            data: data,
            success: function (res: any) {
                if (res.error) {
                    setRunResult({ error: res.error });
                    return;
                }
                if (res.uuid) {
                    setRunResult({ uuid: res.uuid });
                }
            }
        })
    }

    function onSave(props: any) {

        if (!props.src.trim()) {
            toast.error("Source code cannot be empty");
            return;
        }

        if (!props.tb.trim()) {
            toast.error("Testbench code cannot be empty");
            return;
        }

        if (!props?.template?.id) {
            toast.error("Template cannot be empty");
            return;
        }

        if (!props?.project?.slug) {
            toast.error("Project cannot be empty");
            return;
        }

        const saveCodes = async (payload: any) => {
            const response = await api.put(`projects/${props.project.slug}`, payload);
            if (response.data.success) {
                toast.success("Saved successfully");
            }
        }

        saveCodes({ contents: { src: props.src, tb: props.tb } })
    }


    function onDownload(props: { src: string; tb: string }) {
        // Helper to trigger file download
        const downloadFile = (filename: string, content: string) => {
            const blob = new Blob([content], { type: "text/plain" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();

            URL.revokeObjectURL(url);
        };

        // Trigger downloads
        if (props.src) downloadFile("src.txt", props.src);
        if (props.tb) downloadFile("tb.txt", props.tb);
    }

    return {

        onRun, onSave, onDownload
    }
}