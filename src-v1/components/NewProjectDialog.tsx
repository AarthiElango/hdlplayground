import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useWorkspaceStore } from "@/store/workspace";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useProjectSidebarStore } from "@/store/projectSidebar";
import useTemplates from "@/lib/templates";
import { cloneDeep } from "lodash";



export function NewProjectDialog() {

    const [templatesJson, setTemplatesJson] = useState<any>([]);
    const [languages, setLanguages] = useState<any[]>([]);
    const [templates, setTemplates] = useState<any[]>([]);
    const { toggleProjectDialog, setProject } = useWorkspaceStore();
    const { getUserProjects } = useProjectSidebarStore();
    const { getTemplates, getTemplateContents } = useTemplates();

    useEffect(() => {
        getTemplatesJson();
    }, []);


    async function getTemplatesJson() {
        const result = await getTemplates();
        setTemplatesJson(result);
    }

    useEffect(() => {
        const languages = templatesJson.map((x: any) => x.language);
        const unique = [...new Set(languages)];
        setLanguages(unique);
    }, [templatesJson]);


    const formSchema = z.object({
        title: z
            .string("Title is required")
            .min(2, { message: "Title must be at least 2 characters" })
            .max(50, { message: "Title must be at most 50 characters" }),

        description: z
            .string("Description is required")
            .min(5, { message: "Description must be atleast 5 characters" })
            .max(500, { message: "Description must be at most 500 characters" }),

        language: z
            .string("Language is required")
            .min(1, { message: "Please select a language" }),

        template: z
            .string("Template is required")
            .min(1, { message: "Please select a template" }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            language: "",
            template: "",
        },
    })

    const { watch, setValue } = form;

    const selectedLang = watch("language");

    useEffect(() => {
        if (!selectedLang || templatesJson.length === 0) return;
        setValue("template", "");
        const filtered = templatesJson.filter((item: any) => item.language === selectedLang);
        setTemplates(filtered);
    }, [selectedLang, templatesJson, setValue]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const payload:any = cloneDeep(values);
        payload.contents = await getTemplateContents(values.template);
        const response = await api.post('projects', payload);
        if (!response.data.slug) {
            return;
        }
        setProject({ slug: response.data.slug });
        getUserProjects(true);
        toggleProjectDialog(false);

    }

    return (
        <Dialog open={true} onOpenChange={() => toggleProjectDialog(false)}>
            <DialogContent className="sm:max-w-[480px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold">
                                Create New Project
                            </DialogTitle>
                            <DialogDescription>
                                Start a new HDL project from scratch or from a template.
                            </DialogDescription>
                        </DialogHeader>

                        {/* --- Project Title --- */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="My Verilog Project" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* --- Description --- */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="What does this project do?"
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* --- Language Select --- */}
                        <FormField
                            control={form.control}
                            name="language"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Language</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a language" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {languages.map((language: string) => {
                                                return (
                                                    <SelectItem key={language} value={language}>{language}</SelectItem>

                                                )
                                            })}

                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* --- Template Select --- */}
                        <FormField
                            control={form.control}
                            name="template"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Template</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a template" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent position="popper" className="z-[9999]">
                                            {templates.map((template: any) => (
                                                <SelectItem key={template.id} value={template.id.toString()}>{template.name}</SelectItem>

                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="mt-4">
                            <Button variant="outline" onClick={() => toggleProjectDialog(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Create Project</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
