"use server";

import api from "@/lib/woocommerce";

export async function getOrders(page: number = 1) {
    try {
        const response = await api.get("orders", {
            per_page: 20,
            page: page
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}
