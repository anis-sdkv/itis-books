import apiClient from "@/data/apiClient";
import {RegisterUserRequest} from "@/data/requests/RegisterUserRequest";
import {LoginUserRequest} from "@/data/requests/LoginUserRequest";
import {RegisterUserResponse} from "@/data/responses/RegisterUserResponse";

export const registerUser = async (credentials: RegisterUserRequest): Promise<RegisterUserResponse> => {
    const response = await apiClient.post('users/register/', credentials);
    return response.data;
}

export const loginUser = async (credentials: LoginUserRequest): Promise<void> => {
    const {data} = await apiClient.post<{ access: string; refresh: string }>('users/login/', credentials);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
};

export const logout = (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};