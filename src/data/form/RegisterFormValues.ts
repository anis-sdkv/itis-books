import {z} from 'zod';

export const registerUserSchema = z.object({
    username: z.string().optional(),
    email: z.string().email('Некорректный email'),
    password: z.string().min(8, 'Пароль минимум 8 символов'),
    confirmPassword: z.string().min(8, 'Пароль минимум 8 символов'),
    firstName: z.string().nonempty('Имя обязательно'),
    lastName: z.string().nonempty('Фамилия обязательна'),
    agreeTerms: z.boolean().refine(val => val === true, {
        message: "Вы должны согласиться с условиями",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerUserSchema>;
