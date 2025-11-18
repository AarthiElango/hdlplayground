import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { get } from "lodash";

export default function GithubDialog({
    onClose
}: any) {
    const [repos, setRepos] = useState([]);
    const [search, setSearch] = useState("");
    const [newRepo, setNewRepo] = useState("");
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    // Fetch user's repositories
    useEffect(() => {

        loadRepos();
    }, []);

    const loadRepos = async () => {
        setLoading(true);
        try {
            const res = await api.get("/github/repos"); // backend API
            const repos = get(res, 'data.repos', []);
            setRepos(repos);
        } catch (e) {
            console.error("Failed to load repos", e);
        }
        setLoading(false);
    };


    const filtered = repos.filter((r: any) =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = async () => {
        if (!newRepo.trim()) return;

        setCreating(true);
        try {
            const r = await api.post('/github/repos/create', { name: newRepo.trim() });
            if (r.data?.success) {
                loadRepos();
                setNewRepo("");

            }
        } finally {
            setCreating(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Select Repository</DialogTitle>
                    <DialogDescription>
                        Choose a repository to push code, or create a new one.
                    </DialogDescription>
                </DialogHeader>

                {/* Search */}
                <Input
                    placeholder="Search repositories..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="mt-2"
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
                                        className="p-2 rounded-md hover:bg-accent cursor-pointer"
                                    >
                                        <div className="font-medium">{repo.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {repo.private ? "Private" : "Public"}
                                        </div>
                                    </div>
                                ))
                            )}
                        </ScrollArea>
                    )}
                </div>

                {/* Create new repository */}
                <div className="mt-6">
                    <div className="text-sm font-medium mb-2">
                        Create New Repository
                    </div>
                    <div className="flex gap-2">
                        <Input
                            placeholder="New repository name"
                            value={newRepo}
                            onChange={e => setNewRepo(e.target.value)}
                        />
                        <Button onClick={handleCreate} disabled={creating}>
                            {creating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Create"
                            )}
                        </Button>
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
