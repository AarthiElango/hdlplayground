import {
    DialogFooter
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
import { get } from "lodash";
import { useAuthStore } from "@/store/auth";
import { useHeaderStore } from "@/store/header";
import { useEffect } from "react";
import { useActions } from "@/lib/action";

export default function LoginForm({ toggleForgotPassword }: { toggleForgotPassword: any }) {

    const login = useAuthStore((s) => s.login);
    const toggleGuestDialog = useAuthStore((s) => s.toggleGuestDialog);
    const user = useAuthStore((s) => s.user);
    const { setLastAction } = useHeaderStore();
    const lastAction = useHeaderStore((state) => state.lastAction);
    const { onActionClick } = useActions();

    useEffect(() => {
        if (user && user.username) {
            onActionClick(lastAction);
            setTimeout(()=>{
setLastAction('');
            toggleGuestDialog(false);
            });
            
        }
    }, [user]);

    const formSchema = z.object({
        username: z
            .string()
            .min(2, { message: "Username must be at least 2 characters" })
            .max(50, { message: "Username must be at most 50 characters" }),

        password: z
            .string()
            .min(8, { message: "Minumum 8 characters" })
            .max(20, { message: "Maximum 20 characters" }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {

        const response = await api.post('/guest/login', values);
        const token = get(response, 'data.token');
        if (!token) { return; }
        localStorage.setItem('token', token);
        login(get(response, 'data.user', null));


    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email/Mobile/Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter email or mobile or username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Enter Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <DialogFooter className="mt-4">
                    <div className="flex justify-between items-center w-full">
                        <button
                            type="button"
                            className="text-blue-600 hover:text-blue-800 underline font-medium focus:outline-none"
                            onClick={() => { toggleForgotPassword() }}
                        >
                            Forgot Password
                        </button>
                        <Button type="submit">Login</Button>

                    </div>
                </DialogFooter>
            </form>
        </Form>
    )
}