import api from "@/lib/axios";
import { useMainStore } from "@/store/main";
import { useOutputStore } from "@/store/output";
import { useEffect, useState } from "react";

export default function Logs() {
  const { uuid } = useOutputStore();
  const { project } = useMainStore();

  const [errors, setErrors] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!uuid) return;

    async function getLogs() {
      try {
        const logsResponse = await api.post(`projects/${project.slug}/logs`, { uuid });

        setErrors(logsResponse.data?.error?.trim()?.split(/\r?\n/) || []);
        setLogs(logsResponse.data?.output?.trim()?.split(/\r?\n/) || []);

      } catch (err) {
        setErrors([`Failed to fetch logs: ${err}`]);
        setLogs([]);
      }
    }

    getLogs();
  }, [uuid, project.slug]);

  return (
    <div className="bg-gray-900 text-white font-mono p-4 h-full w-full overflow-y-auto">
      
      {logs.length > 0 && (
        <>
          <h3 className="text-green-400 mb-2">Logs</h3>
          <pre className="m-0">
            {logs.map((line, idx) => (
              <div key={idx} className="text-green-400">{line}</div>
            ))}
          </pre>
        </>
      )}

      {errors.length > 0 && (
        <>
          <h3 className="text-red-500 mt-4 mb-2">Errors</h3>
          <pre className="m-0">
            {errors.map((line, idx) => (
              <div key={idx} className="text-red-500">{line}</div>
            ))}
          </pre>
        </>
      )}

    </div>
  );
}
