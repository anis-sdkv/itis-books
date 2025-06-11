import apiClient from "@/data/apiClient";
import {RegisterUserRequest} from "@/data/requests/RegisterUserRequest";
import {LoginUserRequest} from "@/data/requests/LoginUserRequest";
import {RegisterUserResponse} from "@/data/responses/RegisterUserResponse";

export class AuthService {
    async registerUser(credentials: RegisterUserRequest): Promise<RegisterUserResponse> {
        const response = await apiClient.post('users/register/', credentials);
        return response.data;
    }

    async loginUser(credentials: LoginUserRequest): Promise<void> {
        const {data} = await apiClient.post<{ access: string; refresh: string }>('users/login/', credentials);
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
    }

    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
}

// Экземпляр сервиса — singleton
export const authService = new AuthService();