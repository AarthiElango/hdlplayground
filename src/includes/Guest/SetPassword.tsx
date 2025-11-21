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
import { useState } from "react";
import api from "@/lib/axios";
import { get } from 'lodash';

export default function SetPasswordForm({ userProps, toggleLoginForm }: { userProps: any, toggleLoginForm: any }) {

    const [username] = useState(userProps.username);

    const formSchema = z
  .object({
    otp: z
      .string()
      .min(6, { message: "OTP must be 6 characters" })
      .max(6, { message: "OTP must be 6 characters" }),

    password: z
      .string()
      .min(8, { message: "Minimum 8 characters required" })
      .max(20, { message: "Maximum 20 characters allowed" })
      .nonempty({ message: "Password is required" }),

    cpassword: z
      .string()
      .min(8, { message: "Minimum 8 characters required" })
      .max(20, { message: "Maximum 20 characters allowed" })
      .nonempty({ message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.cpassword, {
    path: ["cpassword"],
    message: "Passwords do not match",
  });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: get(userProps, 'otp', ''),
            password: "",
            cpassword:""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const payload = {...values, ...{username}};
        await api.post('/guest/set-password', payload);
        toggleLoginForm();

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>One Time Password</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Otp" {...field} />
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
                                <Input type="password" placeholder="Enter password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="cpassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Enter password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <DialogFooter className="mt-4">
                    <div className="flex justify-between items-center w-full">
                        {/* <button
                            type="button"
                            className="text-blue-600 hover:text-blue-800 underline font-medium focus:outline-none"
                            onClick={() => console.log("Navigate to forgot password")}
                        >
                            Back to login
                        </button> */}

                        <Button type="submit">Set password</Button>

                    </div>
                </DialogFooter>
            </form>
        </Form>
    )
}