import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {RegisterUserDto, registerUserSchema} from "@/data/dto/RegisterUserDto";
import {registerUser} from "@/data/services/authService";

import {
    Card, CardContent, CardDescription, CardFooter,
    CardHeader, CardTitle
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Progress} from "@/components/ui/progress";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {AlertCircle} from "lucide-react";

export default function MultiStepRegisterForm() {
    const [currentStep, setCurrentStep] = useState(1);

    const {
        register,
        control,
        handleSubmit,
        formState: {errors},
        trigger
    } = useForm<RegisterUserDto>({
        mode: "onChange",
        resolver: zodResolver(registerUserSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            agreeTerms: false,
        },
    });

    const onSubmit = async (data: RegisterUserDto) => {
        try {
            await registerUser(data);
            console.log("Registration successful!");
            // TODO: перенаправление после регистрации
        } catch (error) {
            console.error("Ошибка регистрации:", error);
        }
    };

    const ErrorMessage = ({error}: { error?: string }) => {
        if (!error) return null;
        return (
            <div className="absolute right-0 top-0 flex items-center h-full pr-3">
                <div className="bg-red-100 text-red-700 text-xs rounded-md px-2 py-1 whitespace-nowrap">
                    {error}
                </div>
            </div>
        );
    };


    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Создание аккаунта</CardTitle>
                <CardDescription className="text-center">
                    {currentStep === 1 ? "Шаг 1: Данные для входа" : "Шаг 2: Персональные данные"}
                </CardDescription>
                <Progress value={currentStep * 50} className="mt-2"/>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {currentStep === 1 ? (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Input id="email" type="email" {...register("email")} />
                                    <ErrorMessage error={errors.email?.message}/>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Пароль</Label>
                                <div className="relative">
                                    <Input id="password" type="password" {...register("password")} />
                                    <ErrorMessage error={errors.password?.message}/>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                                <div className="relative">
                                    <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                                    <ErrorMessage error={errors.confirmPassword?.message}/>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Имя</Label>
                                <div className="relative">
                                    <Input id="firstName" {...register("firstName")} />
                                    <ErrorMessage error={errors.firstName?.message}/>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName">Фамилия</Label>
                                <div className="relative">
                                    <Input id="lastName" {...register("lastName")} />
                                    <ErrorMessage error={errors.lastName?.message}/>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Controller
                                    name="agreeTerms"
                                    control={control}
                                    render={({field}) => (
                                        <Checkbox
                                            id="agreeTerms"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />)}
                                />
                                <label htmlFor="agreeTerms" className="text-sm">
                                    Я согласен с <a href="#" className="text-blue-600 hover:underline">Условиями</a>
                                </label>
                            </div>
                        </>
                    )}

                    {(errors.root || errors.agreeTerms) && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertDescription>
                                {errors.agreeTerms ? errors.agreeTerms?.message : "Пожалуйста, исправьте ошибки в форме"}
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex flex-col space-y-4 pt-6">
                        {currentStep > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCurrentStep(currentStep - 1)}
                            >
                                Назад
                            </Button>
                        )}

                        {currentStep === 1 ? (
                            <Button
                                type="button"
                                onClick={async () => {
                                    const valid = await trigger(["email", "password", "confirmPassword"]);
                                    if (valid) {
                                        setCurrentStep(2);
                                    }
                                }}
                            >
                                Продолжить
                            </Button>
                        ) : (
                            <Button type="submit">
                                Зарегистрироваться
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>

            <CardFooter className="flex justify-center">
                <div className="text-sm text-gray-500">
                    Уже есть аккаунт? <a href="#" className="text-blue-600 hover:underline">Войти</a>
                </div>
            </CardFooter>
        </Card>
    );
}
