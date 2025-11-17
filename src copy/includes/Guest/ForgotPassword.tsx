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
export default function ForgotPasswordForm({toggleLoginForm,toggleSetPassword}:{toggleLoginForm:any,toggleSetPassword:any}) {

    const formSchema = z.object({
        username: z
            .string()
            .min(2, { message: "Username must be at least 2 characters" })
            .max(50, { message: "Username must be at most 50 characters" }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    })

     async  function onSubmit(values: z.infer<typeof formSchema>) {
   
            const response = await api.post('/guest/forgot-password',values);
            toggleSetPassword(response.data);

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

                <DialogFooter className="mt-4">
                    <div className="flex justify-between items-center w-full">
                 
                 <button
  type="button"
  className="text-blue-600 hover:text-blue-800 underline font-medium focus:outline-none"
  onClick={() => toggleLoginForm()}
>
    Back to login
</button>

                    <Button type="submit">Reset password</Button>

                    </div>
                </DialogFooter>
            </form>
        </Form>
    )
}