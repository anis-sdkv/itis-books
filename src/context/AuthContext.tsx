import {createContext, useContext, useEffect, useState} from 'react';
import {fetchUser, loginUser, logoutUser} from '@/data/services/authService';
import {User} from "@/data/models/User";

interface AuthCtx {
    user: User | null;
    loading: boolean;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    /** Проверяем пользователя по куке один раз при старте */
    useEffect(() => {
        (async () => {
            try {
                const userData = await fetchUser();
                setUser(userData);
            } catch (error) {
                console.error('Ошибка при проверке сессии:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    /** Логин: отправляем креды на сервер, сервер ставит куку */
    const login = async (credentials: { email: string; password: string }) => {
        try {
            const userData = await loginUser(credentials);
            setUser(userData);
        } catch (error) {
            console.error('Ошибка при логине:', error);
            throw error;
        }
    };

    /** Логаут: дергаем сервер на удаление куки */
    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error('Ошибка при логауте:', error);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
