"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function login(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    // Super admin hardcoded bypass or check from DB
    // For now, let's keep the user/admin hardcoded password check for these two
    // but fetch the role and displayName from the database

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { username: username },
                { email: username }
            ]
        }
    });

    if (!user) {
        throw new Error("User tidak ditemukan. Silakan cek Username/Email Anda.");
    }

    // Temporary logic: match hardcoded passwords for now
    // In a real app, you'd use bcrypt to check hashed passwords from the DB
    // Check for hardcoded bypass (optional, good for initial setup)
    if (username === "admin" && password === (process.env.ADMIN_PASSWORD || "admin1234567890")) {
        session.isAdmin = true;
        session.role = user.role as 'admin' | 'user';
        session.username = user.displayName;
        session.email = user.email;
        await session.save();
        redirect("/dashboard");
    }

    // Check database password (hashed)
    if (user.password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            session.isAdmin = user.role === 'admin';
            session.role = user.role as 'admin' | 'user';
            session.username = user.displayName;
            session.email = user.email;
            await session.save();
            redirect("/dashboard");
        }
    }

    throw new Error("Invalid credentials");
}

export async function loginWithPin(pin: string) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    // Since PINs are hashed, we can't search by PIN directly.
    // For this implementation, we fetch all users with a PIN and compare.
    const usersWithPin = await prisma.user.findMany({
        where: { NOT: { pin: null } }
    });

    let foundUser = null;
    for (const user of usersWithPin) {
        if (user.pin && await bcrypt.compare(pin, user.pin)) {
            foundUser = user;
            break;
        }
    }

    if (!foundUser) {
        throw new Error("PIN salah");
    }

    session.isAdmin = foundUser.role === 'admin';
    session.role = foundUser.role as 'admin' | 'user';
    session.username = foundUser.displayName;
    session.email = foundUser.email;
    await session.save();

    return { success: true, redirect: "/dashboard" };
}

export async function logout() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    session.destroy();
    redirect("/");
}

export async function getSession() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    return {
        isAdmin: session.isAdmin || false,
        role: session.role,
        username: session.username,
        email: session.email
    };
}
