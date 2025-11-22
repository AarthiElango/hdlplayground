import { useEffect, useState } from "react";
import {
  Tabs as TabsProvider,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Terminal, Plus, X } from "lucide-react";
import { get } from "lodash";
import NewTabDialog from "./NewTabDialog";
// Optional: react-hot-toast (install if you want nice toasts)
import { toast } from "sonner";
import CodeEditor from "./CodeEditor";


export const Tabs = ({ template, refKey }: { template: any, refKey: any }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [fileExt, setFileExt] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    const f = get(template, `files.${refKey}`, []).map((file: any) => ({
      ...file,
      id: crypto.randomUUID(),
      isUser: false,
    }));
    setFiles(f);
    setFileExt(template.fileext || "");
    if (f.length > 0) setActiveTab(f[0].id);
  }, [template, refKey]);

  // sanitize name -> no spaces, lower, hyphens, append ext if missing
  const makeFilename = (raw: string) => {
    const base = raw.trim().toLowerCase().replace(/\s+/g, "-");
    if (!fileExt) return base;
    // if user already passed ext, avoid double appending
    return base.endsWith(fileExt) ? base : `${base}${fileExt}`;
  };

  // show toast error (try react-hot-toast then fallback)
  const showError = (msg: string) => {
    try {
      toast.error(msg);
    } catch {
      alert(msg);
    }
  };

  // CREATE NEW FILE — preventing duplicates (case-insensitive)
  const createNewFile = (rawName: string) => {
    const filename = makeFilename(rawName);

    // check duplicates by exact name, case-insensitive
    const exists = files.some(
      (f) => f.name.toLowerCase() === filename.toLowerCase()
    );

    if (exists) {
      showError("File name already exists");
      return;
    }

    const newFile = {
      id: crypto.randomUUID(),
      name: filename,
      contents: "",
      isUser: true,
    };

    setFiles((prev) => [...prev, newFile]);
    setActiveTab(newFile.id);
  };

  // CLOSE FILE
  const closeFile = (id: string) => {
    setFiles((prev) => {
      const index = prev.findIndex((f) => f.id === id);
      if (index === -1) return prev;
      const updated = prev.filter((f) => f.id !== id);

      // if closing active, pick nearest (left) or first
      setTimeout(() => {
        setActiveTab((curr) => {
          if (curr !== id) return curr;
          if (updated.length === 0) return "";
          const newIdx = Math.max(0, index - 1);
          return updated[newIdx].id;
        });
      }, 0);

      return updated;
    });
  };

  return (
    <TabsProvider
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full h-full flex flex-col"
    >
      {/* TOP BAR */}
      <div className="flex items-center gap-2 border-b bg-muted/30 px-2 py-1">
        {/* TabsList: horizontal scroll only, no vertical scroll */}
        <TabsList className="flex items-center gap-2 flex-nowrap overflow-x-auto overflow-y-hidden">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center relative whitespace-nowrap"
            >
              {/* Tab: ensure no wrapping (whitespace-nowrap) and consistent height */}
              <TabsTrigger
                value={file.id}
                className="flex-none flex items-center gap-2 
                           data-[state=active]:bg-background 
                           data-[state=active]:text-primary 
                           px-3 py-2 rounded-md transition-all min-w-[120px] max-w-[220px] whitespace-nowrap"
              >
                <div className="flex items-center gap-2 truncate">
                  <Terminal className="w-4 h-4" />
                  <span className="text-sm font-medium truncate">{file.name}</span>
                </div>
              </TabsTrigger>

              {/* Close button only for user tabs.
                  Place it visually overlapping (no extra height) using absolute positioning
                  but keep it keyboard/mouse accessible. */}
              {file.isUser && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFile(file.id);
                  }}
                  aria-label={`Close ${file.name}`}
                  className="absolute right-0 translate-x-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded hover:bg-red-50"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </TabsList>

        {/* + BUTTON */}
       <button
  className="ml-auto p-1 rounded-md disabled:cursor-not-allowed"
  onClick={() => setDialogOpen(true)}
disabled={true}
>
  <Plus className="w-4 h-4" />
</button>
      </div>

      {/* TAB CONTENTS */}
      <div className="flex-1 overflow-auto bg-background">
        {files.map((file) => (
          <TabsContent key={file.id} value={file.id} className="h-full">
            {/* <div className="p-4">Content for: {file.name}</div> */}
            <CodeEditor src={file.src} contents={file.contents} filename={file.name} refKey={refKey} language={template.language} />
          </TabsContent>
        ))}
      </div>

      {/* NEW TAB DIALOG */}
      <NewTabDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={createNewFile}
        fileExt={fileExt}
      />
    </TabsProvider>
  );
};
