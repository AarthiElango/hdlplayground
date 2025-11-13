import { useProjectSidebarStore } from "@/store/projectSidebar";
import SearchInput from "./SearchInput";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { get } from "lodash";
import { ProjectCard } from "./ProjectCard";
import { useWorkspaceStore } from "@/store/workspace";
import useTemplates from "@/lib/templates";

export default function ProjectSidebar() {
  const { renderUserProjects, getUserProjects } = useProjectSidebarStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { project,setProject, setRunResult } = useWorkspaceStore();
const { getTemplates} = useTemplates();


  useEffect(() => {
    if (renderUserProjects) {
      getUserProjectsList();
    }
  }, [renderUserProjects]);

  useEffect(() => {
    if (project?.slug) {
      projects.forEach((projectObj: any) => {
        projectObj.active = !!(project && project.slug && project.slug == projectObj.slug)
      })
      setProjects([...projects]);
    }
  }, [project])


  async function getUserProjectsList() {
    const response = await api.get("projects");
    const projects = get(response, 'data.projects', []);
    const templates = await getTemplates();
    projects.forEach((projectObj: any) => {
      const template = templates.find((item: any) => item.id == projectObj.template_id);
      projectObj.template = template;
      projectObj.active = !!(project && project.slug && project.slug == projectObj.slug);
      if(projectObj.active){
        setRunResult(null);
        setProject(projectObj);
      }
    })
    setProjects(projects);
    getUserProjects(false);
  }

  // Filter projects by title (case-insensitive)
  const filteredProjects = projects.filter((project: any) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Search input */}
      <div className="p-3">
        <SearchInput
          value={searchTerm}
          onChange={(val) => setSearchTerm(val)} // ✅ fix here
          placeholder="Search projects..."
        />
      </div>

      {/* Separator line */}
      <div className="border-b border-muted mb-2" />

      {/* Scrollable project list */}
      <div className="overflow-y-auto flex-1 px-3 space-y-2">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project: any) => (
            <ProjectCard key={project.slug} project={project} />
          ))
        ) : (
          <p className="text-muted-foreground text-sm text-center mt-6">
            No projects found
          </p>
        )}
      </div>
    </div>
  );
}
