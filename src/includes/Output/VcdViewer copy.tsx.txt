import { useEffect, useState, type FC } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils"; // optional helper if you use Shadcn utils
import { useOutputStore } from "@/store/output";
import { useMainStore } from "@/store/main";
import { useAuthStore } from "@/store/auth";

export const Fliplot: FC<{}> = () => {
  const [src, setSrc] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { uuid } = useOutputStore();
  const { project }= useMainStore();
  const { user }= useAuthStore();

  useEffect(() => {
    const APP_URL = import.meta.env.VITE_APP_URL;
    if (uuid) {
      const API_URL = import.meta.env.VITE_API_URL;

      const url = `${API_URL}/projects/${user.username}/${project.slug}/vcd/${uuid}`
      setSrc(`${APP_URL}/fliplot/index.html?url=${url}`);
    }
  }, [uuid]);

  return (
    <div
      className={cn(
        "relative w-full h-full bg-black flex flex-col vcd-viewer transition-all duration-300",
        isFullscreen && "fixed inset-0 z-50"
      )}
    >
      {/* Fullscreen Toggle Button */}
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        className={cn(
          "absolute top-3 right-3 z-50 p-2 rounded-full border border-white/20 backdrop-blur-sm",
          "bg-black/60 hover:bg-black/80 text-white shadow-lg",
          "animate-pulse ring-2 ring-blue-400/60 hover:ring-blue-500/80 transition-all"
        )}
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? (
          <Minimize2 className="h-5 w-5 text-blue-400" />
        ) : (
          <Maximize2 className="h-5 w-5 text-blue-400" />
        )}
      </button>

      {/* Iframe viewer */}
      {src && (
        <iframe
          key={src}
          src={src}
          className="flex-1 w-full border-none"
          style={{ display: "block", height: "100%" }}
          title="VCD Viewer"
        />
      )}
    </div>
  );
};
