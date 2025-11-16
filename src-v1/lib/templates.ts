import { isEmpty } from "lodash";

export default function useTemplates() {

    async function getTemplates() {

        const APP_URL = import.meta.env.VITE_APP_URL;
        const res = await fetch(`${APP_URL}/jsons/templates.json`);
        const templates = await res.json();
        return templates;
    }

    async function getTemplateContents(templateId:any){
        const APP_URL = import.meta.env.VITE_APP_URL;
        const res = await fetch(`${APP_URL}/jsons/templates.json`);
        const templates = await res.json();
        if(isEmpty(templates)){
            return null;
        }
        const template = templates.find((x:any)=> x.id == templateId);
        if(isEmpty(template)){
            return null;
        }
        const srcRes = await fetch(`${APP_URL}/${template.source}`);
        const src = await srcRes.text();
            const tbRes = await fetch(`${APP_URL}/${template.testbench}`);
        const tb = await tbRes.text();

        return {
            src,tb

        };

    }

    return {
        getTemplates,
        getTemplateContents
    }
}