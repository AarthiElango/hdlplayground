import Tooltip from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import { useActions } from "@/lib/action";
import { useAuthStore } from "@/store/auth";
import { useMainStore } from "@/store/main";
import { Code, LogIn, LogOut } from "lucide-react";

export default function Header() {
  const  user  = useAuthStore((state) => state.user);
  const { template, project } = useMainStore();
  const { onActionClick } = useActions();
  return (
    <>
      <header className="border-b bg-gradient-to-r from-card via-card to-card">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Code />
              </div>
              <div>
                <h1 className="text-black">HDL Playground v3</h1>
                <p className="text-xs text-muted-foreground">
                  Verilog &amp; Hardware Design Platform
                </p>
              </div>
            </div>
            {
              template?.slug && project?.slug && <div className="flex justify-start gap-4">
                <Badge variant="secondary">{template.language}</Badge>
                {project?.title}
              </div>
            }

          </div>
          <div>
            {user?.username ? (
              <Tooltip title="Logout">
                <button className="cursor-pointer" onClick={()=>onActionClick('logout')}>
                  <LogOut />
                </button>
              </Tooltip>
            ) : (
              <Tooltip title="LogIn" side="left">
                <button className="cursor-pointer" onClick={()=>onActionClick('login')}>
                  <LogIn />
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
