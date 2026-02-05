"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

const USERS_FILE = path.join(process.cwd(), "src/data/users.json");

export async function getUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading users:", error);
        return [];
    }
}

export async function addUser(formData: FormData) {
    try {
        const username = formData.get("username") as string;
        const displayName = formData.get("displayName") as string;
        const role = formData.get("role") as 'admin' | 'user';
        const email = formData.get("email") as string;

        const users = await getUsers();

        // Simple check to avoid duplicates
        if (users.find((u: any) => u.username === username)) {
            return { success: false, error: "Username already exists" };
        }

        const newUser = {
            id: Date.now().toString(),
            username,
            displayName,
            role,
            email
        };

        const updatedUsers = [...users, newUser];
        await fs.writeFile(USERS_FILE, JSON.stringify(updatedUsers, null, 2));

        revalidatePath("/dashboard/users");
        return { success: true };
    } catch (error) {
        console.error("Error adding user:", error);
        return { success: false, error: "Failed to add user" };
    }
}

export async function deleteUser(id: string) {
    try {
        const users = await getUsers();
        const updatedUsers = users.filter((u: any) => u.id !== id);

        await fs.writeFile(USERS_FILE, JSON.stringify(updatedUsers, null, 2));

        revalidatePath("/dashboard/users");
        return { success: true };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, error: "Failed to delete user" };
    }
}
