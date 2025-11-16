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
import { useWorkspaceStore } from "@/store/workspace";
import { get, isEmpty } from "lodash";
import api from "@/lib/axios";

interface ProjectHistoryProps {
    onOpenChange: (open: boolean) => void;
    onRestoreVersion: (version: any) => void;
}

export const ProjectHistory: React.FC<ProjectHistoryProps> = ({
    onOpenChange,
    onRestoreVersion,
}) => {

    const [versions, setVersions] = useState<any[]>([]);

    const { project } = useWorkspaceStore();

    useEffect(() => {
        if(isEmpty(project?.slug)){
            return;
        }


        getHistory();
    }, []);

    async function getHistory(){
        const response = await api.get('histories/'+project.slug);
        const histories = get(response, 'data.histories', []);
        setVersions(histories);
    }


    return (
        <Sheet open={true} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Project History</SheetTitle>
                    <SheetDescription>
                        View and restore previous versions of your project.
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-120px)] mt-6">
                    {versions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Clock className="h-12 w-12 mb-3" />
                            <p>No version history yet</p>
                            <p className="text-sm">
                                Versions are created when you save your project.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 p-3">
                            {versions.map((version) => (
                                <div
                                    key={version.comments}
                                    className="p-4 rounded-lg border bg-card shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-sm text-muted-foreground">
                                                    {new Date(version.updated_at).toLocaleString()}
                                                </span>
                                            </div>
                                            {version.comments && (
                                                <p className="text-sm mb-3">{version.comments}</p>
                                            )}
                                         
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onRestoreVersion(version)}
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
