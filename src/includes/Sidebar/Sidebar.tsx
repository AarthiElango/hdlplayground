import { useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import TemplateCard from "./TemplateCard";
import { useShared } from "@/lib/shared";
import { isEmpty, toLower } from "lodash";

export default function Sidebar() {

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTemplates, setFilteredTemplates] = useState([]);
    const { fetchTemplates } = useShared();
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        async function getTemplates() {
            const templates = await fetchTemplates();
            setTemplates(templates);
            setFilteredTemplates(templates);
        }
        getTemplates();
    }, []);

    useEffect(() => {
        if (isEmpty(searchTerm)) {
            setFilteredTemplates(templates);
            return;
        }
        const filtered = templates.filter((template: any) => {
            return toLower(template.name).includes(toLower(searchTerm));
        });
        setFilteredTemplates(filtered);
    }, [searchTerm])

    return (
        <>
            <div className="flex flex-col h-full">
                <div className="">
                    <SearchInput
                        value={searchTerm}
                        onChange={(val) => setSearchTerm(val)} // ✅ fix here
                        placeholder="Search templates..."
                    />
                </div>
            <div className="overflow-y-auto flex-1 space-y-2">
                {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template: any) => (
                        <TemplateCard key={template.slug} template={template} />
                    ))
                ) : (
                    <p className="text-muted-foreground text-sm text-center mt-6">
                        No projects found
                    </p>
                )}
            </div>
            </div>
           


        </>
    )
}