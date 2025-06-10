import axios from 'axios';
import { API_URL } from '@/config';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedQueue: (() => void)[] = [];

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Если получили 401 и это не сам refresh-запрос
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            localStorage.getItem("refresh_token")
        ) {
            originalRequest._retry = true;

            try {
                // Чтобы не делать несколько параллельных refresh-запросов
                if (!isRefreshing) {
                    isRefreshing = true;
                    const { data } = await axios.post<{ access: string }>(
                        "/api/users/token/refresh/",
                        { refresh: localStorage.getItem("refresh_token") }
                    );
                    localStorage.setItem("access_token", data.access);
                    apiClient.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

                    // Обновить access_token во всех запросах, которые были в очереди на ожидание
                    failedQueue.forEach((cb) => cb());
                    failedQueue = [];
                }

                // Повторяем исходный запрос с новым токеном
                originalRequest.headers["Authorization"] = `Bearer ${localStorage.getItem("access_token")}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Если не удалось обновить — логин/логаут
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login"; // или вызывай logout
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
