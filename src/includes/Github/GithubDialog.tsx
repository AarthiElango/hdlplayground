import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { cloneDeep, get } from "lodash";
import { useWorkspaceStore } from "@/store/workspace";

export default function GithubDialog({ onClose }: any) {
    const [repos, setRepos] = useState([]);
    const [search, setSearch] = useState("");
    const [newRepo, setNewRepo] = useState("");

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [pushing, setPushing] = useState(false);
    const [pullingRepo, setPullingRepo] = useState<string | null>(null);

    const [pushRepo, setPushRepo] = useState<any>(null);
    const [commitMessage, setCommitMessage] = useState("");
    const { files, updateFilesFromGit } = useWorkspaceStore();

    const isBusy: any = loading || creating || pushing || pullingRepo; // disable all buttons if any action

    useEffect(() => {
        loadRepos();
    }, []);

    const loadRepos = async () => {
        setLoading(true);
        try {
            const res = await api.get("/github/repos");
            setRepos(get(res, "data.repos", []));
        } catch (e) {
            console.error("Failed to load repos", e);
        }
        setLoading(false);
    };

    const filtered = repos.filter((r: any) =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    // --- Create new repo ---
    const handleCreate = async () => {
        if (!newRepo.trim()) return;

        setCreating(true);
        try {
            const r = await api.post("/github/repos/create", { name: newRepo.trim() });
            if (r.data?.success) {
                loadRepos();
                setNewRepo("");
            }
        } catch (e) {
            console.error("Create repo failed", e);
        }
        setCreating(false);
    };

    // --- Pull files ---
    const pullFromGithub = async (repo: any) => {
        setPullingRepo(repo.name);
        try {
            // 1. Get file list
            const list = await api.get(`/github/repos/pull/${repo.name}`);
            const fileList = get(list, "data.files", []);
            const paths = fileList.map((file: any) => file.path);

            // 2. Fetch all file contents
            const remoteFilesResponse = await api.post(`/github/repos/pull/${repo.name}/files`, {
                paths: paths,
            });

            const remoteFiles = get(remoteFilesResponse, 'data.files', []);

            let clonedFiles: any = cloneDeep(files);
            console.log(clonedFiles)
            for (let key in clonedFiles) {
                clonedFiles[key].forEach((division: any) => {
                    if (remoteFiles[division.name].content) {
                        division.contents = remoteFiles[division.name].content;
                    }
                });
            }
            updateFilesFromGit(clonedFiles);
            onClose();
        } catch (e) {
            console.error("Pull failed", e);
        } finally {
            setPullingRepo(null);
        }
    };

    // --- Push changes ---
    const handlePush = async () => {
        if (!commitMessage.trim()) return;

        let filesInput: any = {};
        for (let key in files) {
            files[key].forEach((division: any) => {
                filesInput[division.name] = division.contents;
            });
        }

        setPushing(true);
        try {
            const payload = {
                repo: pushRepo.name,
                message: commitMessage,
                files: filesInput,
            };
            await api.post("/github/repos/push", payload);

            setCommitMessage("");
            setPushRepo(null);
            onClose();
        } catch (e) {
            console.error("Push failed", e);
        }
        setPushing(false);
    };

    return (
        <>
            {/* Main Dialog */}
            <Dialog open={true} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Select Repository</DialogTitle>
                        <DialogDescription>
                            Choose a repository to push or pull code.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Search */}
                    <Input
                        placeholder="Search repositories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mt-2"
                        disabled={isBusy}
                    />

                    {/* Repo List */}
                    <div className="mt-4">
                        {loading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : (
                            <ScrollArea className="h-48 border rounded-md p-2">
                                {filtered.length === 0 ? (
                                    <div className="text-center text-sm text-muted-foreground py-4">
                                        No repositories found.
                                    </div>
                                ) : (
                                    filtered.map((repo: any) => (
                                        <div
                                            key={repo.id}
                                            className="p-2 rounded-md hover:bg-accent flex justify-between items-center"
                                        >
                                            <div>
                                                <div className="font-medium">{repo.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {repo.private ? "Private" : "Public"}
                                                </div>
                                            </div>

                                            {/* Icons */}
                                            <div className="flex gap-3">
                                                {/* Pull */}
                                                {pullingRepo === repo.name ? (
                                                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                                ) : (
                                                    <ArrowDownLeft
                                                        className={`h-5 w-5 text-blue-500 hover:scale-110 transition ${isBusy ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                                            }`}
                                                        onClick={() => {
                                                            if (!isBusy) pullFromGithub(repo);
                                                        }}
                                                    />
                                                )}

                                                {/* Push */}
                                                <ArrowUpRight
                                                    className={`h-5 w-5 cursor-pointer text-green-600 hover:scale-110 transition ${isBusy ? "opacity-50 pointer-events-none" : ""
                                                        }`}
                                                    onClick={() => setPushRepo(repo)}
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </ScrollArea>
                        )}
                    </div>

                    {/* Create new repository */}
                    {!pushRepo && (
                        <div className="mt-6">
                            <div className="text-sm font-medium mb-2">Create New Repository</div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="New repository name"
                                    value={newRepo}
                                    onChange={(e) => setNewRepo(e.target.value)}
                                    disabled={isBusy}
                                />
                                <Button onClick={handleCreate} disabled={isBusy || creating}>
                                    {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
                                </Button>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={onClose} disabled={isBusy}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Push Commit Dialog */}
            {pushRepo && (
                <Dialog open={true} onOpenChange={() => setPushRepo(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Push to {pushRepo.name}</DialogTitle>
                            <DialogDescription>
                                Enter a commit message to push changes.
                            </DialogDescription>
                        </DialogHeader>

                        <Input
                            placeholder="Commit message"
                            value={commitMessage}
                            onChange={(e) => setCommitMessage(e.target.value)}
                            className="mt-2"
                            disabled={isBusy}
                        />

                        <DialogFooter className="mt-4 flex justify-between">
                            <Button
                                variant="outline"
                                onClick={() => setPushRepo(null)}
                                disabled={isBusy}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handlePush} disabled={isBusy || pushing}>
                                {pushing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Push"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
