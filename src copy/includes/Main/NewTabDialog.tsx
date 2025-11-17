// components/NewTabDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { kebabCase } from "lodash";

export default function NewTabDialog({ open, onClose, onCreate, fileExt }: any) {
    const [name, setName] = useState("");

    const handleCreate = () => {
        if (!name.trim()) return;

        const clean = kebabCase(name);
        onCreate(clean + fileExt);
        setName("");
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New File</DialogTitle>
                </DialogHeader>

                <Input
                    placeholder="Enter file name dont inclue extension"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <DialogFooter>
                    <Button onClick={handleCreate}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
