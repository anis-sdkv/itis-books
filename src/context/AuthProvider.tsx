import {useEffect, useState} from 'react';
import {UserModel} from "@/data/models/UserModel";
import {AuthContext} from "@/context/AuthContext";
import {LoginUserRequest} from "@/data/requests/LoginUserRequest";
import {UpdateProfileRequest} from "@/data/requests/UpdateProfileRequest";
import {authService} from "@/data/services/AuthService";
import {profileService} from "@/data/services/ProfileSerivece";

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserModel | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const userData = await profileService.fetchProfile();
                setUser(userData);
            } catch (error) {
                console.log(error);
                localStorage.removeItem("access_token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const login = async (data: LoginUserRequest) => {
        setLoading(true);
        try {
            await authService.loginUser(data);
            const userData = await profileService.fetchProfile();
            setUser(userData);
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (data: UpdateProfileRequest) => {
        setLoading(true);
        try {
            const userData = await profileService.updateProfile(data);
            setUser(userData);
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            authService.logout();
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setUser(null);
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{user, loading, login, updateProfile, logout}}>
            {children}
        </AuthContext.Provider>
    );
}