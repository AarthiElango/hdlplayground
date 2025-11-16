import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import ProjectSidebar from '@/components/ProjectSidebar';
import CodeEditor from '@/components/CodeEditor';
import type { CodeEditorRef } from '@/components/CodeEditor';
import OutputPanel from '@/components/OutputPanel';
import { useProjectSidebarStore } from '@/store/projectSidebar';
import { useWorkspaceStore } from '@/store/workspace';
import NoProjectSelected from './NoProjectSelected';
import { FileCode, TestTube } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import useWorkspaceActions from './WorkspaceActions';
import { get } from 'lodash';
import api from '@/lib/axios';

export default function Workspace() {

  const { showProjectSidebar } = useProjectSidebarStore();
  const { project, testbenchCodeEdited, sourceCodeEdited, workspaceAction,codeEditorValues } = useWorkspaceStore();

  const [template, setTemplate] = useState<any>({});
  const [source, setSource] = useState('');
  const [tb, setTb] = useState('');

  const { onRun, onSave, onDownload } = useWorkspaceActions()
  const { setRunResult} = useWorkspaceStore();

  const sourceRef = useRef<CodeEditorRef>(null);
  const testbenchRef = useRef<CodeEditorRef>(null);

  useEffect(() => {
    if (!project?.slug) {
      return;
    }
    if (!project.template) {
      return;
    }
    setTemplate(project.template);
    getFileContents();
  }, [project]);

  useEffect(()=>{
    setRunResult(null);
    if(!codeEditorValues) return;
    sourceRef.current?.setValue(codeEditorValues.src);
    testbenchRef.current?.setValue(codeEditorValues.tb);
  },[codeEditorValues])

  useEffect(() => {
    if (!workspaceAction?.action) return;
    const args: any = {
      template: template,
      project: project,
      src: sourceRef.current?.getValue(),
      tb: testbenchRef.current?.getValue()
    };
    if (workspaceAction.action == 'run') {
      onRun(args)
    }
    if (workspaceAction.action == 'save') {
      onSave(args);

    }
    if (workspaceAction.action == 'download') {
      onDownload(args)
    }
  }, [workspaceAction])


  async function getFileContents() {
    const response = await api.get(`projects/${project.slug}/contents`);
    setSource(get(response, 'data.contents.src'));
    setTb(get(response, 'data.contents.tb'));
  }

  function srcCodeEdited(edited: boolean) {
    sourceCodeEdited(edited);
  }
  function tbCodeEdited(edited: boolean) {
    testbenchCodeEdited(edited)
  }

  return (
    <>
      <ResizablePanelGroup direction="horizontal" id="root-group">
        {showProjectSidebar ? (
          <>
            <ResizablePanel
              defaultSize={20}
              minSize={15}
              maxSize={30}
              id="sidebar-panel"
              order={1}
            >
              <ProjectSidebar />
            </ResizablePanel>
            <ResizableHandle />
          </>
        ) : null}

        {project ? (
          <ResizablePanel defaultSize={80} id="main-panel" order={2}>
            <ResizablePanelGroup direction="horizontal" id="main-group">
              {/* ---- Left: Design Panel ---- */}
              <ResizablePanel
                defaultSize={50}
                minSize={15}
                id="design-panel"
                order={1}
              >
                <div className="px-4 py-2 border-b bg-muted/50 flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  <span className="text-sm">Source</span>
                  {/* <Badge variant="outline" className="text-xs ml-auto">
                    10 lines
                  </Badge> */}
                </div>
                <CodeEditor
                  ref={sourceRef}
                  value={source}
                  language={template.editor}
                  onEdited={srcCodeEdited}
                />
              </ResizablePanel>

              <ResizableHandle />

              {/* ---- Right: Testbench + Output ---- */}
              <ResizablePanel
                defaultSize={50}
                minSize={15}
                id="right-panel"
                order={2}
              >
                <ResizablePanelGroup
                  direction="vertical"
                  id="vertical-group"
                >
                  {/* ---- Testbench ---- */}
                  <ResizablePanel
                    defaultSize={50}
                    minSize={15}
                    id="testbench-panel"
                    order={1}
                  >
                    <div className="px-4 py-2 border-b bg-muted/50 flex items-center gap-2">
                      <TestTube className="h-4 w-4" />
                      <span className="text-sm">Testbench</span>
                      {/* <Badge variant="outline" className="text-xs ml-auto">
                        10 lines
                      </Badge> */}
                    </div>
                    <CodeEditor
                      ref={testbenchRef}
                      value={tb}
                      language={template.editor}
                      onEdited={tbCodeEdited}
                    />
                  </ResizablePanel>

                  <ResizableHandle />

                  {/* ---- Output ---- */}
                  <ResizablePanel
                    defaultSize={50}
                    minSize={15}
                    id="output-panel"
                    order={2}
                  >
                    <OutputPanel />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        ) : (
          <ResizablePanel defaultSize={80} id="no-project-panel" order={2}>
            <NoProjectSelected />
          </ResizablePanel>
        )}
      </ResizablePanelGroup>

    </>
  );

}