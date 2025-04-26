import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [tab, setTab] = useState<"login" | "register">("login");

    useEffect(() => {
        if (location.pathname.endsWith("/register")) {
            setTab("register");
        } else {
            setTab("login");
        }
    }, [location.pathname]);

    const handleTabChange = (value: string) => {
        if (value === "register") {
            navigate("/auth/register");
        } else {
            navigate("/auth/login");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-4">
                <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Вход</TabsTrigger>
                        <TabsTrigger value="register">Регистрация</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <LoginForm />
                    </TabsContent>

                    <TabsContent value="register">
                        <RegisterForm />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
