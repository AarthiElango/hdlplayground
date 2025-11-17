import { useOutputStore } from "@/store/output";
import { useWorkspaceStore } from "@/store/workspace";
import { useEffect, useState } from "react";
import { get } from 'lodash';
import SchematicWaveform from "./SchematicWaveform";
import api from "@/lib/axios";
import { useMainStore } from "@/store/main";

export default function Schematics() {

    // const { runYosys } = useOutputStore();
    const  runYosys  = useOutputStore((state)=> state.runYosys);
    const files = useWorkspaceStore((state) => state.files);
    const [signals, setSignals] = useState([]);
    const [timescale, setTimescale] = useState('');
    const { project } = useMainStore();

    useEffect(() => {
        if (!runYosys) {
            return;
        }
        if (runYosys) {
            getYosysData();
        }
    }, [runYosys]);

    async function getYosysData() {
        const codes = {
            design: get(files, 'design.0.contents'),
            testbench: get(files, 'testbench.0.contents'),
        }
        const payload = { verilog: `${codes.design}\n\n${codes.testbench}`, top: "tb_blink" }

        try {
            // const YOSYS_URL = import.meta.env.VITE_YOSYS_URL;
            // const response = await fetch(`${YOSYS_URL}/run_simulation`, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(payload),
            // });

            // if (!response.ok) {
            //     const errorPayload = await response.json().catch(() => ({}));
            //     throw new Error(errorPayload.detail || "Simulation failed.");
            // }
            const response = await api.post(`/projects/${project.slug}/yosys/simulation`, payload)
            
              if (response.data?.signals) {
                            setSignals(response.data.signals);

            }
              if (response.data?.timescale) {
                            setTimescale(response.data.timescale);

            }
        } catch (err) {
         
        }

    }

    return (
        <>
            {runYosys && <SchematicWaveform signals={signals} timescale={timescale} />}
        </>
    );
}