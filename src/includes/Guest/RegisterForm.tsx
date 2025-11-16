import {
    DialogFooter,
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
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import api from "@/lib/axios";
export default function RegisterForm({toggleSetPassword}:{toggleSetPassword:any}) {

    const formSchema = z.object({
        fullname: z
            .string()
            .min(2, { message: "Username must be at least 2 characters" })
            .max(50, { message: "Username must be at most 50 characters" }),
               username: z
            .string()
            .min(2, { message: "Username must be at least 2 characters" })
            .max(50, { message: "Username must be at most 50 characters" }),
               email: z
            .string()
            .min(2, { message: "Username must be at least 2 characters" })
            .max(50, { message: "Username must be at most 50 characters" }),
               mobile: z
            .string()
            .min(10, { message: "Username must be at least 2 characters" })
            .max(10, { message: "Username must be at most 50 characters" }),

    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullname: "",
            email: "",
            username: "",
            mobile: "",
        },
    })

  
      async  function onSubmit(values: z.infer<typeof formSchema>) {
   
            const response = await api.post('/guest/register',values);
            toggleSetPassword(response.data);

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fullname</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter fullname" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Enter Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Enter email</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Enter Mobile</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter mobile" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <DialogFooter className="mt-4">
                    <Button type="submit">Create Account</Button>
                </DialogFooter>
            </form>
        </Form>
    )
}