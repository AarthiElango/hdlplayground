import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, RotateCcw } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { get } from "lodash";
import api from "@/lib/axios";
import { useHeaderStore } from "@/store/header";

interface MyProjectsProps {
}

export const MyProjects: React.FC<MyProjectsProps> = () => {

    const [projects, setProjects] = useState<any[]>([]);
    const { toggleMyProjects } = useHeaderStore();

    useEffect(() => {

        getProjects();
    }, []);

    async function getProjects() {
        const response = await api.get('projects');
        const projects = get(response, 'data.projects', []);
        setProjects(projects);
    }

    async function onRestoreVersion(project: any) {
        const APP_URL = import.meta.env.VITE_APP_URL;
        window.location.href = `${APP_URL}/${project.slug}`
    }

   

    return (
        <Sheet open={true} onOpenChange={()=>toggleMyProjects(false)}>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Project History</SheetTitle>
                    <SheetDescription>
                        View and go to your of your project.
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-120px)] mt-6">
                    {projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Clock className="h-12 w-12 mb-3" />
                            <p>No project history yet</p>

                        </div>
                    ) : (
                        <div className="space-y-4 p-3">
                            {projects.map((project) => (
                                <div
                                    key={project.slug}
                                    className="p-4 rounded-lg border bg-card shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-sm text-muted-foreground">
                                                    {new Date(project.updated_at).toLocaleString()}
                                                </span>
                                            </div>
                                            {project.description && (
                                                <p className="text-sm mb-3">{project.description}</p>
                                            )}

                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onRestoreVersion(project)}
                                            className="flex items-center"
                                        >
                                            <RotateCcw className="h-4 w-4 mr-2" />
                                            Restore
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};
