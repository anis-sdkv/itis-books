import {API_URL} from '@/config';
import {User} from '@/data/models/User';
import {apiClient} from "@/data/apiClient";
import {RegisterUserDto} from "@/data/dto/RegisterUserDto";
import {LoginUserDto} from '@/data/dto/LoginUserDto';

export async function fetchUser(): Promise<User> {
    const {data} = await apiClient.get<User>(`${API_URL}/api/me`, {
        withCredentials: true,
    });
    return data;
}

export async function registerUser(credentials: RegisterUserDto): Promise<void> {
    await apiClient.post(`${API_URL}/api/register`, credentials, {
        withCredentials: true,
    });
}

export async function loginUser(credentials: LoginUserDto): Promise<User> {
    const {data} = await apiClient.post<User>(`${API_URL}/api/login`, credentials, {
        withCredentials: true,
    });
    return data;
}

export async function logoutUser(): Promise<void> {
    await apiClient.post(`${API_URL}/api/logout`, {}, {
        withCredentials: true,
    });
}
