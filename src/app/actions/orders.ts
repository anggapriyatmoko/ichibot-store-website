"use server";

import api from "@/lib/woocommerce";
import { getSession } from "./auth";


export async function getOrders(page: number = 1, perPage: number = 10) {
    try {
        const response = await api.get("orders", {
            per_page: perPage,
            page: page
        });

        return {
            data: response.data,
            totalItems: parseInt(response.headers['x-wp-total'] || '0'),
            totalPages: parseInt(response.headers['x-wp-totalpages'] || '1')
        };
    } catch (error) {
        console.error("Error fetching orders:", error);
        return { data: [], totalItems: 0, totalPages: 1 };
    }
}

export async function createOrder(cart: any[]) {
    try {
        const session = await getSession();

        if (!session.role) {
            throw new Error("You must be logged in to checkout.");
        }

        const lineItems = cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            subtotal: (parseInt(item.price) * item.quantity).toString(),
            total: (parseInt(item.price) * item.quantity).toString()
        }));

        const orderData = {
            payment_method: "cod",
            payment_method_title: "Store Transaction",
            set_paid: false,
            billing: {
                first_name: session.username,
                last_name: "",
                address_1: "Store Transaction",
                city: "Local",
                state: "Local",
                postcode: "00000",
                country: "ID",
                email: "customer@ichibot.id",
                phone: "0000000000"
            },
            line_items: lineItems,
            status: "completed"
        };

        const response = await api.post("orders", orderData);

        console.log(`[WC API] Order created: ID=${response.data.id}`);

        return {
            success: true,
            order: response.data
        };
    } catch (error: any) {
        console.error("WooCommerce Order Error:", error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
}
