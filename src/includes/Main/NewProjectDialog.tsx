
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspaceStore } from "@/store/workspace";
import { useMainStore } from "@/store/main";
import { cloneDeep } from "lodash";
import api from "@/lib/axios";

interface ProjectDialogProps {
  onClose: () => void;
}

export default function NewProjectDialog({ onClose }: ProjectDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { template, tool } = useMainStore();
  const { files } = useWorkspaceStore();

  const handleSubmit = () => {
    // Only title is required, description is optional
    if (!title.trim()) return;
    
    onCreate({ title, description });
    setTitle("");
    setDescription("");
    onClose();
  };

  async function onCreate(data: any) {
    const payload = cloneDeep(data);
   
    payload.files = files;
    payload.template_id = template.id;
    payload.tool_id = tool.id;
    
    // Ensure description always has a value (even if empty) to satisfy backend validation
    payload.description = data.description?.trim() || '';

    try {
      const response = await api.post('projects', payload);
      if (!response?.data?.success || !response?.data?.slug) {
        console.error('Project creation failed:', response);
        return;
      }
      const APP_URL = import.meta.env.VITE_APP_URL;
      window.location.href = `${APP_URL}/${response.data.slug}`;
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      // Optionally show error message to user
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Project Name</Label>
            <Input
              placeholder="My HDL Project"
              value={title}
              required={true}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description (Optional)</Label>
            <Textarea
              placeholder="Short project description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

