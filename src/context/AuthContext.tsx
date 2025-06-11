import {UserModel} from "@/data/models/UserModel";
import {createContext} from "react";
import {LoginUserRequest} from "@/data/requests/LoginUserRequest";
import {UpdateProfileRequest} from "@/data/requests/UpdateProfileRequest";

interface AuthCtx {
    user: UserModel | null;
    loading: boolean;
    login: (data: LoginUserRequest) => Promise<void>;
    updateProfile: (data: UpdateProfileRequest) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthCtx | null>(null);