import {z} from 'zod';

export const loginUserSchema = z.object({
    email: z.string().email('Некорректный email'),
    password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
    rememberMe: z.boolean().optional(), // флаг "запомнить меня" не обязателен
});

export type LoginUserDto = z.infer<typeof loginUserSchema>;