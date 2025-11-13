import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Home,
  Code,
  FolderOpen,
  HelpCircle,
  CheckCircle,
  Wrench,
  LogIn,
  UserCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";

export const VerticalNav: React.FC = () => {
  const { toggleGuestDialog, user }= useAuthStore();
  const navItems = [
    { id: "code", icon: Code, label: "Editor", color: "hover:bg-blue-500/10" },
    {
      id: "projects",
      icon: FolderOpen,
      label: "Projects",
      color: "hover:bg-purple-500/10",
    },
    {
      id: "tools",
      icon: Wrench,
      label: "Tools",
      color: "hover:bg-green-500/10",
    },
    {
      id: "validate",
      icon: CheckCircle,
      label: "Validate",
      color: "hover:bg-emerald-500/10",
    },
    {
      id: "help",
      icon: HelpCircle,
      label: "Help & Docs",
      color: "hover:bg-orange-500/10",
    },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <div className="w-16 h-full bg-gradient-to-b from-muted/50 to-muted/30 border-r flex flex-col items-center py-4 gap-2">
        {/* Logo/Home */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white mb-2"
            >
              <Home className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Home</p>
          </TooltipContent>
        </Tooltip>

        <Separator className="w-8" />

        {/* Navigation Items */}
        {navItems.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`w-11 h-11 rounded-xl ${item.color} transition-all`}
              >
                <item.icon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        {/* Spacer */}
        <div className="flex-1" />

        <Separator className="w-8" />

        {/* Bottom icons */}

        {
          user?.username?
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-11 h-11 rounded-xl hover:bg-primary/10 text-primary"
            >
              <UserCircle className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Profile</p>
          </TooltipContent>
        </Tooltip>
          :<Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={()=>toggleGuestDialog(true)}
              variant="ghost"
              size="icon"
              className="w-11 h-11 rounded-xl hover:bg-green-500/10 text-green-600"
            >
              <LogIn className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Login</p>
          </TooltipContent>
        </Tooltip>

        }
        

        
      </div>
    </TooltipProvider>
  );
};
