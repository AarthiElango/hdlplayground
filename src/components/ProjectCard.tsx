import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { FileText, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWorkspaceStore } from "@/store/workspace";

interface Project {
  title: string;
  description: string;
  slug: string;
  template_id: number;
  updated_at: string;
  template?: { name?: string; tags?: string[] };
  active?: boolean;
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { title, description, slug, template_id, updated_at, template, active } = project;

  const { setProject } = useWorkspaceStore();

  function onCardClick(){
    setProject(project)
  }

  return (
    <Card onClick={()=>onCardClick()}
      className={`w-full max-w-md rounded-2xl shadow-md border transition-all duration-300 ${
        active
          ? "bg-primary/10 border-primary/40 shadow-primary/30"
          : "bg-background border-muted"
      }`}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileText className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>

        {template?.tags?.length ? (
          <div className="flex flex-wrap gap-1 mt-2">
            {template.tags.map((tag, i) => (
              <Badge
                key={i}
                variant={active ? "default" : "secondary"}
                className="text-[10px] px-2 py-0.5 rounded-full"
              >
                {tag}
              </Badge>
            ))}
          </div>
        ) : (
          <Badge
            variant={active ? "default" : "outline"}
            className="text-[10px] px-2 py-0.5 rounded-full mt-2"
          >
            Template {template_id}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium text-muted-foreground">Slug:</span>
          <span>{slug}</span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center gap-1 text-xs text-muted-foreground border-t pt-2">
        <Clock className="w-3 h-3" />
        Updated: {updated_at}
      </CardFooter>
    </Card>
  );
};
