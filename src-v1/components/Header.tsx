import { useAuthStore } from "@/store/auth";
import { useProjectSidebarStore } from "@/store/projectSidebar";
import { useWorkspaceStore } from "@/store/workspace";
import { LogOutIcon } from "lucide-react";
import HeaderActions from "./HeaderActions";


export default function Header() {
  const { toggleProjectSidebar } = useProjectSidebarStore();
  const { toggleProjectDialog, project } = useWorkspaceStore();
  const { toggleGuestDialog, user, logout } = useAuthStore();


  function onLogout() {
    logout();
    localStorage.clear();
  }

  function onCreateNewProject() {

    if (user && user.username) {
      toggleProjectDialog(true)
    } else {
      toggleGuestDialog(true);
    }
  }

  return (
    <>
    <header className="border-b bg-gradient-to-r from-card via-card to-card">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-file-code h-5 w-5 text-white"
              >
                <path d="M10 12.5 8 15l2 2.5"></path>
                <path d="m14 12.5 2 2.5-2 2.5"></path>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-black">HDL Playground</h1>
              <p className="text-xs text-muted-foreground">
                Verilog &amp; Hardware Design Platform
              </p>
            </div>
          </div>
        </div>
        {
          user?.username?  <button className="underline hover:text-primary" onClick={() => onLogout()}>
              <LogOutIcon />
            </button>:<div className="flex items-center gap-2">
          <div
            role="alert"
            className="flex flex-col rounded-lg border text-sm text-card-foreground py-2 px-3 bg-yellow-500/10 border-yellow-500/30 w-fit"
          >
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-lock h-4 w-4 text-yellow-600 dark:text-yellow-500"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <button
                className="underline hover:text-primary font-medium text-xs"
                onClick={() => toggleGuestDialog(true)}
              >
                Login required
              </button>
            </div>
            <span className="text-xs text-yellow-800 dark:text-yellow-300 ml-6">
              to run simulations
            </span>
          </div>
        </div>
        }




      </div>
      <div className="border-t bg-muted/30">
        <div className="flex items-center gap-2 px-4 py-2">
          <button onClick={() => toggleProjectSidebar()}
            data-slot="button"
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([className*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:text-accent-foreground dark:hover:bg-accent/50 h-8 rounded-md gap-1.5 px-3 has-[&gt;svg]:px-2.5 hover:bg-blue-500/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-panel-left-close h-4 w-4"
            >
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
              <path d="M9 3v18"></path>
              <path d="m16 15-3-3 3-3"></path>
            </svg> My Projects
          </button>
          <button
            data-slot="button"
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([className*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[&gt;svg]:px-2.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border-blue-500/30"
            onClick={() => onCreateNewProject()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-plus h-4 w-4 mr-2"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            New Project
          </button>
          {project?.slug && <HeaderActions /> }
          <button
            data-slot="button"
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([className*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background text-foreground hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[&gt;svg]:px-2.5 hover:bg-orange-500/10 hover:border-orange-500/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-wrench h-4 w-4 mr-2"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
            Tools
          </button>
        </div>
      </div>
    </header>
    </>
  );
}
