import {LoginFormValues} from "@/data/form/LoginFormValues";

export interface LoginUserRequest {
    username: string;
    password: string;
}

export function toLoginRequest(values: LoginFormValues): LoginUserRequest {
    return {
        username: values.email,
        password: values.password
    }
}
