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
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export default function WorkspaceSaveDialog({ closeSaveDialog }: { closeSaveDialog: any }) {

    const formSchema = z.object({
        comments: z
            .string("Comments is required")
            .min(2, { message: "Comments must be at least 2 characters" })
            .max(20, { message: "Comments must be at most 20 characters" }),

    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comments: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
closeSaveDialog(values);
    }

    return (
        <Dialog open={true} onOpenChange={() => closeSaveDialog()}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl">Welcome to HDL Playground</DialogTitle>
                    <DialogDescription className="text-center">
                        Save your version of the code
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        <FormField
                            control={form.control}
                            name="comments"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Enter comment for this version" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="mt-4">
                            <Button variant="outline" onClick={() => closeSaveDialog()}>
                                Cancel
                            </Button>

                            <Button type="submit">Save</Button>

                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}