import {z} from 'zod';

export const loginUserSchema = z.object({
    email: z.string().email('Некорректный email'),
    password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
    rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginUserSchema>;
