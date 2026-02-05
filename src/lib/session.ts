import { SessionOptions } from "iron-session";

export interface SessionData {
    username?: string;
    role?: 'admin' | 'user';
    isAdmin: boolean;
}

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long",
    cookieName: "ichibot_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};
