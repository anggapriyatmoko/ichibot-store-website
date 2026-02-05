"use server";

import api from "@/lib/woocommerce";

export async function getProducts(search?: string, page: number = 1, perPage: number = 20) {
    try {
        const params: any = {
            per_page: perPage,
            page: page,
            status: "publish",
            orderby: "date",
            order: "desc"
        };

        if (search && search.trim() !== "") {
            params.search = search.trim();
        }

        const response = await api.get("products", params);

        const products = Array.isArray(response.data) ? response.data : [];
        const total = parseInt(response.headers['x-wp-total'] || '0');
        const totalPages = parseInt(response.headers['x-wp-totalpages'] || '0');

        console.log(`[WC API] Products fetch: page=${page}, count=${products.length}, total=${total}`);

        return {
            products,
            total,
            totalPages
        };
    } catch (error: any) {
        console.error("WooCommerce API Error:", error.message);
        return {
            products: [],
            total: 0,
            totalPages: 0
        };
    }
}
