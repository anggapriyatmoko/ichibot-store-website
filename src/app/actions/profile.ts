"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function updateProfile(formData: FormData) {
    try {
        const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

        if (!session.username) {
            return { success: false, error: "Not authenticated" };
        }

        const displayName = formData.get("displayName") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const pin = formData.get("pin") as string;

        // Validation
        if (pin && !/^\d{6}$/.test(pin)) {
            return { success: false, error: "PIN harus 6 digit angka" };
        }

        // Find the user by ID from session or email
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: session.username },
                    { email: session.email },
                    { displayName: session.username }
                ]
            }
        });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        // Prepare data for update
        const updateData: any = {
            displayName,
            email,
        };

        if (pin) {
            updateData.pin = await bcrypt.hash(pin, 10);
        }

        if (password && password.length >= 8) {
            updateData.password = await bcrypt.hash(password, 10);
        } else if (password && password.length < 8) {
            return { success: false, error: "Password minimal 8 karakter" };
        }

        // Update database
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: updateData
        });

        // Update session
        session.username = updatedUser.displayName;
        session.email = updatedUser.email;
        await session.save();

        revalidatePath("/");
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/profile");

        return { success: true };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: "Failed to update profile" };
    }
}
