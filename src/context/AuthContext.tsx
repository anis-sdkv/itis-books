import {User} from "@/data/models/User";
import {createContext} from "react";
import {LoginUserRequest} from "@/data/requests/LoginUserRequest";

interface AuthCtx {
    user: User | null;
    loading: boolean;
    login: (data: LoginUserRequest) => Promise<void>;
    logout: () => void;

}

export const AuthContext = createContext<AuthCtx | null>(null);