import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';
import Sidebar from './Sidebar/Sidebar';
import { Output } from './Main/Output';
import { useSidebarStore } from '@/store/sidebar';
import { Tabs } from './Main/Tabs';
import { useMainStore } from '@/store/main';
import { useEffect } from 'react';
import { useShared } from '@/lib/shared';
import { isEmpty } from 'lodash';
import NewProjectDialog from './Main/NewProjectDialog';

export default function Main() {

    const { showSidebar } = useSidebarStore();
    const { project, showProjectDialog, toggleProjectDialog, template, setTemplate } = useMainStore();
    const { fetchTemplateById } = useShared();


    useEffect(() => {


        (async () => {
            if (isEmpty(project?.slug)) {
                const template = await fetchTemplateById(1);
                setTemplate(template);
            } else {
                let template = await fetchTemplateById(project.template_id);
                template = { ...template, ...{ files: project.files } }
                setTemplate(template);
            }
        })();


    }, [project]);

    return (
        <>
            <ResizablePanelGroup direction="horizontal" id="root-group">

                {
                    !project?.slug && showSidebar && <>
                        <ResizablePanel
                            defaultSize={20}
                            minSize={15}
                            maxSize={30}
                            id="sidebar-panel"
                            order={1}
                        >
                            <Sidebar />
                        </ResizablePanel>
                        <ResizableHandle />
                    </>
                }

                <ResizablePanel defaultSize={80} id="main-panel" order={2}>
                    <ResizablePanelGroup direction="horizontal" id="main-group">
                        <ResizablePanel
                            defaultSize={50}
                            minSize={15}
                            id="design-panel"
                            order={1}
                        >
                            {
                                template?.slug && <Tabs template={template} refKey="testbench" />
                            }


                        </ResizablePanel>
                        <ResizableHandle />
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

                                <ResizablePanel
                                    defaultSize={50}
                                    minSize={15}
                                    id="testbench-panel"
                                    order={1}
                                >

                                    {
                                        template?.slug && <Tabs template={template} refKey="design" />
                                    }
                                </ResizablePanel>
                                <ResizableHandle />
                                <ResizablePanel
                                    defaultSize={50}
                                    minSize={15}
                                    id="output-panel"
                                    order={2}
                                >
                                    <Output />
                                </ResizablePanel>

                            </ResizablePanelGroup>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>

            {showProjectDialog && <NewProjectDialog onClose={() => toggleProjectDialog(false)} />}
        </>
    )
}