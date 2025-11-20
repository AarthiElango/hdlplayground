import Tooltip from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import { useActions } from "@/lib/action";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth";
import { useGithubStore } from "@/store/github";
import { useMainStore } from "@/store/main";
import { Code, LogIn, LogOut, LucideGithub } from "lucide-react";
import GithubDialog from "./Github/GithubDialog";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const { template, project } = useMainStore();
  const { onActionClick } = useActions();
  const { showGithubDialog, toggleGithubDialog} = useGithubStore();

  const githubAuth = async () => {
   
    const exists = await api.get('github/auth/exists');
    if(exists.data.success){
      toggleGithubDialog(true);
      return;
    }
    const response = await api.get(`/github/auth/start`)
    console.log(response.data);
    if(!response.data.url){
      return;
    }

   window.open(
      response.data.url,
      "githubLogin",
      "width=600,height=700"
    );
  };

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
                <h1 className="text-black">HDL Studio</h1>
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
              <>
                <Tooltip title="GitHub">
                  <button className="cursor-pointer" onClick={() => githubAuth()}>
                    <LucideGithub />
                  </button>
                </Tooltip>
                <Tooltip title="Logout">
                  <button className="cursor-pointer" onClick={() => onActionClick('logout')}>
                    <LogOut />
                  </button>
                </Tooltip>
              </>

            ) : (
              <Tooltip title="LogIn" side="left">
                <button className="cursor-pointer" onClick={() => onActionClick('login')}>
                  <LogIn />
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </header>
      { showGithubDialog && <GithubDialog onClose={()=>toggleGithubDialog(false)} />}
    </>
  );
}