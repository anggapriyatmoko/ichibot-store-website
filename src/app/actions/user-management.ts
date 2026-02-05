"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function getUsers() {
    try {
        return await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function addUser(formData: FormData) {
    try {
        const username = formData.get("username") as string;
        const displayName = formData.get("displayName") as string;
        const role = formData.get("role") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const pin = formData.get("pin") as string;

        // Validation for PIN if provided
        if (pin && !/^\d{6}$/.test(pin)) {
            return { success: false, error: "PIN harus 6 digit angka" };
        }

        // Check for duplicates
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser) {
            return {
                success: false,
                error: existingUser.username === username ? "Username already exists" : "Email already exists"
            };
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
        const hashedPin = pin ? await bcrypt.hash(pin, 10) : null;

        await prisma.user.create({
            data: {
                username,
                displayName,
                role,
                email,
                password: hashedPassword,
                pin: hashedPin
            }
        });

        revalidatePath("/dashboard/users");
        return { success: true };
    } catch (error) {
        console.error("Error adding user:", error);
        return { success: false, error: "Failed to add user" };
    }
}

export async function deleteUser(id: string) {
    try {
        await prisma.user.delete({
            where: { id }
        });

        revalidatePath("/dashboard/users");
        return { success: true };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, error: "Failed to delete user" };
    }
}

export async function updateUser(id: string, formData: FormData) {
    try {
        const displayName = formData.get("displayName") as string;
        const role = formData.get("role") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const pin = formData.get("pin") as string;

        // Validation for PIN if provided
        if (pin && !/^\d{6}$/.test(pin)) {
            return { success: false, error: "PIN harus 6 digit angka" };
        }

        // Check if email already exists for another user
        const existingEmailUser = await prisma.user.findFirst({
            where: {
                email,
                NOT: { id }
            }
        });

        if (existingEmailUser) {
            return { success: false, error: "Email already exists" };
        }

        const updateData: any = {
            displayName,
            role,
            email,
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (pin) {
            updateData.pin = await bcrypt.hash(pin, 10);
        }

        await prisma.user.update({
            where: { id },
            data: updateData
        });

        revalidatePath("/dashboard/users");
        return { success: true };
    } catch (error: any) {
        console.error("Error updating user:", error);
        // Provide more details if it's a known Prisma error
        if (error.code === 'P2002') {
            return { success: false, error: "Unique constraint failed" };
        }
        return { success: false, error: error.message || "Failed to update user" };
    }
}
