import {useEffect, useState} from 'react';
import {User} from "@/data/models/User";
import {AuthContext} from "@/context/AuthContext";
import {fetchProfile} from "@/data/services/profileSerivece";
import {loginUser, logout} from "@/data/services/authService";
import {LoginUserRequest} from "@/data/requests/LoginUserRequest";


export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const userData = await fetchProfile();
                setUser(userData);
            } catch (error) {
                console.error("Ошибка при проверке сессии:", error);
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const login = async (data: LoginUserRequest) => {
        setLoading(true);
        try {
            await loginUser(data);
            const userData = await fetchProfile();
            setUser(userData);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };


    return (
        <AuthContext.Provider value={{user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}
