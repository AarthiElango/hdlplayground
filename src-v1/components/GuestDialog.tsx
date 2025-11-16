import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/auth";
import LoginForm from "./guest/LoginForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import RegisterForm from "./guest/RegisterForm";
import ForgotPasswordForm from "./guest/ForgotPassword";
import { useState } from "react";
import SetPasswordForm from "./guest/SetPassword";


export function GuestDialog() {

    const { toggleGuestDialog } = useAuthStore();

    const [showLogin, setShowLogin] = useState(true);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showSetPassword, setShowSetPassword] = useState(false);

    const [userProps, setUserProps] = useState({});

    function toggleForgotPassword() {
        setShowLogin(false);
        setShowSetPassword(false);
        setShowForgotPassword(true);

    }
    function toggleLoginForm() {
        setShowSetPassword(false);
        setShowForgotPassword(false);
        setShowLogin(true);
    }

    function toggleSetPassword(userProps: any) {

        setShowForgotPassword(false);
        setShowLogin(false);
        setShowSetPassword(true);
        setUserProps(userProps);

    }

    return (
        <Dialog open={true} onOpenChange={() => toggleGuestDialog(false)}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl">Welcome to HDL Playground</DialogTitle>
                    <DialogDescription className="text-center">
                        Login or create an account to start designing
                    </DialogDescription>
                </DialogHeader>
                {
                    showLogin ? <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login" className="space-y-4">
                            <LoginForm toggleForgotPassword={toggleForgotPassword} />
                        </TabsContent>
                        <TabsContent value="signup" className="space-y-4">
                            <RegisterForm toggleSetPassword={toggleSetPassword} />
                        </TabsContent>
                    </Tabs> : ""
                }
                {
                    showForgotPassword ? <ForgotPasswordForm toggleLoginForm={toggleLoginForm} toggleSetPassword={toggleSetPassword} /> : ""
                }
                {
                    showSetPassword ? <SetPasswordForm userProps={userProps} toggleLoginForm={toggleLoginForm} /> : ""
                }
            </DialogContent>
        </Dialog>
    );
}
