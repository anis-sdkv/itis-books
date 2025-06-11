import apiClient from "@/data/apiClient";
import {UpdateProfileRequest} from "@/data/requests/UpdateProfileRequest";
import { UserModel } from "../models/UserModel";

export class ProfileService {
    constructor() {}

    async fetchProfile(): Promise<UserModel> {
        const response = await apiClient.get('/users/profile/');
        console.log(response.data);
        return response.data;
    }

    async updateProfile(data: UpdateProfileRequest): Promise<UserModel> {
        const response = await apiClient.put('/users/profile/', data);
        return response.data;
    }
}

export const profileService = new ProfileService();