import {User} from "./User";

export type AuthResponse = {
    user: User;
    token: string;
    meta?: {
        [key: string]: any;
    };
}