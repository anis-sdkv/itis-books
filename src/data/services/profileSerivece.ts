import apiClient from "@/data/apiClient";
import {UpdateProfileRequest} from "@/data/requests/UpdateProfileRequest";
import { User } from "../models/User";


export const fetchProfile = async (): Promise<User> =>
    apiClient.get('/users/profile/');

export const updateProfile = async (data: UpdateProfileRequest) /*: Promise<UserProfile>*/ =>
    apiClient.put('/users/profile/', data);