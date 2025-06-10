import {Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginUserSchema, LoginFormValues} from "@/data/form/LoginFormValues";
import ErrorMessage from "./ErrorMessage";
import {toLoginRequest} from "@/data/requests/LoginUserRequest";
import {useAuth} from "@/context/useAuth";

export default function LoginForm() {
    const {login} = useAuth();

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
        watch,
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginUserSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await login(toLoginRequest(data));
            console.log("Успешный вход пользователя:");
        } catch (error) {
            console.error("Ошибка входа:", error);
        }
    };

    const rememberMe = watch("rememberMe");

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Вход в аккаунт</CardTitle>
                <CardDescription className="text-center">Введите свои данные для входа в систему</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                {...register("email")}
                            />
                            <ErrorMessage error={errors.email?.message}/>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="password">Пароль</Label>
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                                Забыли пароль?
                            </a>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register("password")}
                            />
                            <ErrorMessage error={errors.password?.message}/>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="remember"
                            checked={rememberMe}
                            onCheckedChange={(checked) => setValue("rememberMe", !!checked)}
                        />
                        <label
                            htmlFor="remember"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Запомнить меня
                        </label>
                    </div>

                    <Button type="submit" className="w-full">
                        Войти
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="flex justify-center">
                {/* текст "Нет аккаунта? Зарегистрироваться" можно убрать, т.к. уже есть табы */}
            </CardFooter>
        </Card>
    );
}
