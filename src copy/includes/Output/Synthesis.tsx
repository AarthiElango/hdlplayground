import { useOutputStore } from "@/store/output";
import { useWorkspaceStore } from "@/store/workspace";
import { useEffect, useState } from "react";
import { get } from "lodash";
import api from "@/lib/axios";
import { useMainStore } from "@/store/main";

export default function Schematics() {
    const runYosys = useOutputStore((state) => state.runYosys);
    const files = useWorkspaceStore((state) => state.files);

    const [svgContent, setSvgContent] = useState("");
        const { project } = useMainStore();
    

    useEffect(() => {
        if (runYosys) {
            getYosysData();
        }
    }, [runYosys]);

    async function getYosysData() {
        const codes = {
            design: get(files, "design.0.contents"),
            testbench: get(files, "testbench.0.contents"),
        };

        const payload = { verilog: `${codes.design}`, top: "blink" };

        try {
            // const YOSYS_URL = import.meta.env.VITE_YOSYS_URL;
            // const response = await fetch(`${YOSYS_URL}/run_yosys`, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(payload),
            // });

            // if (!response.ok) {
            //     const errorPayload = await response.json().catch(() => ({}));
            //     throw new Error(errorPayload.detail || "Simulation failed.");
            // }

            // const data = await response.json();
            // console.log("YOSYS Response:", data);

            const response = await api.post(`/projects/${project.slug}/yosys/run`, payload)
            

            // --- THIS IS YOUR SVG --- //
            if (response.data?.schematic_svg) {
                setSvgContent(response.data.schematic_svg);
            }

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            {/* Render SVG safely */}
            <div
                className="svg-content"
                dangerouslySetInnerHTML={{ __html: svgContent }}
            ></div>
        </>
    );
}
