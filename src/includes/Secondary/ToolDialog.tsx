import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMainStore } from "@/store/main";

interface Tool {
  title: string;
  slug: string;
  description: string;
}

interface ToolDialogProps {
  onClose: () => void;
  tools: Tool[];
}

export default function ToolDialog({
  onClose,
  tools,
}: ToolDialogProps) {
  const [selected, setSelected] = useState<string>("");
  const { tool, setTool } = useMainStore();
  // Select first tool by default
  useEffect(() => {
      setSelected(tool.slug);
  }, [open, tools]);

  const handleConfirm = () => {
    const tool = tools.find((t) => t.slug === selected);
    if (tool) {
      setTool(tool);
    };
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Tool</DialogTitle>
        </DialogHeader>

        <RadioGroup
          value={selected}
          onValueChange={setSelected}
          className="space-y-3 mt-2"
        >
          {tools.map((tool) => (
            <div
              key={tool.slug}
              className="flex items-start gap-3 p-3 border rounded-lg"
            >
              <RadioGroupItem value={tool.slug} id={tool.slug} />
              <Label htmlFor={tool.slug} className="cursor-pointer space-y-1 flex flex-col justify-start items-start">
                <div className="font-medium">{tool.title}</div>
                <div className="text-sm text-muted-foreground">
                  {tool.description}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
