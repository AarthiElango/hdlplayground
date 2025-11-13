export default function useTemplates() {

    async function getTemplates() {

        const APP_URL = import.meta.env.VITE_APP_URL;
        const res = await fetch(`${APP_URL}/jsons/templates.json`);
        const templates = await res.json();
        return templates;
    }

    return {
        getTemplates
    }
}