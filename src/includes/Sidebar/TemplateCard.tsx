import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, GitFork } from "lucide-react";
import Tooltip from "@/components/Tooltip";
import { useActions } from "@/lib/action";
import { useMainStore } from "@/store/main";

interface Template {
  id: number;
  name: string;
  description: string;
  slug: string;
  fileext: string;
  files: {
    design: { name: string; contents: string }[];
    testbench: { name: string; contents: string }[];
  };
  language: string;
  tools: string[];
}

export default function TemplateCard({ template }: { template: Template }) {

  const { onActionClick } = useActions();
  const { setTemplate } =  useMainStore();

  function onFork(template:any){
    setTemplate(template);
    onActionClick('fork');
  }

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-all">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">{template.name}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Code2 className="w-4 h-4" />
            <span>{template.language.toUpperCase()}</span>
          </div>
        </div>

        <Tooltip title="Fork" side="right">
          <Button size="icon" variant="outline" className="cursor-pointer rounded-full"
            title="Fork this project" onClick={() => onFork(template)}
          >
            <GitFork className="w-4 h-4" />
          </Button>
        </Tooltip>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-gray-500">{template.description}</p>

        <div className="flex flex-wrap gap-2 pt-2">
          {template.tools.map((tool) => (
            <span
              key={tool}
              className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
            >
              {tool}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
