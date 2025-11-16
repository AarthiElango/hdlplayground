import { isEmpty } from "lodash";
import { useState } from "react";

export function useShared() {

    const [templates, setTemplates] = useState([]);

    async function fetchTemplates() {
        if (isEmpty(templates)) {
            const APP_URL = import.meta.env.VITE_APP_URL;
            const res = await fetch(`${APP_URL}/jsons/templates.json`);
            const templates = await res.json();
            setTemplates(templates);
            return templates;
        }
        return templates;

    }

    async function fetchTemplateById(id: any) {
        const templates = await fetchTemplates();
        const template = templates.find((x: any) => x.id == id);
        return template;

    }

    async function fetchTools() {
        const APP_URL = import.meta.env.VITE_APP_URL;
        const res = await fetch(`${APP_URL}/jsons/tools.json`);
        const tools = await res.json();
        return tools;

    }

     async function fetchToolBySlug(slug:string) {
             const tools = await fetchTools();
               const tool = tools.find((x: any) => x.slug == slug);
        return tool;

    }

    return {
        fetchTemplates, fetchTemplateById, fetchTools, fetchToolBySlug
    }
}