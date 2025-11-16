import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { useWorkspaceStore } from "@/store/workspace";
import {
    FileCode, Plus
} from "lucide-react";

export default function NoProjectSelected() {
    const { toggleProjectDialog } = useWorkspaceStore();
    const { toggleGuestDialog, user } = useAuthStore();

    function onCreateNewProject() {

        if (user && user.username) {
            toggleProjectDialog(true)
        } else {
            toggleGuestDialog(true);
        }
    }
    return (
        <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center space-y-4">
                <FileCode className="h-16 w-16 mx-auto opacity-20" />
                <div>
                    <p className="text-lg">No project selected</p>
                    <p className="text-sm">Create a new project or select one from the sidebar</p>
                </div>
                <Button onClick={() => onCreateNewProject()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Project
                </Button>
            </div>
        </div>
    )

}