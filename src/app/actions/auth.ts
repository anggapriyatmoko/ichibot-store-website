"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (username === "admin" && password === (process.env.ADMIN_PASSWORD || "admin1234567890")) {
        session.isAdmin = true;
        session.role = 'admin';
        session.username = 'Administrator';
        await session.save();
        redirect("/dashboard");
    } else if (username === "user" && password === "user123") {
        session.isAdmin = false;
        session.role = 'user';
        session.username = 'Customer';
        await session.save();
        redirect("/");
    } else {
        throw new Error("Invalid credentials");
    }
}

export async function logout() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    session.destroy();
    redirect("/login");
}

export async function getSession() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    return {
        isAdmin: session.isAdmin || false,
        role: session.role,
        username: session.username
    };
}
