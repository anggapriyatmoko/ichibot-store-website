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
            // Increase window to 100 (max) to capture more title matches into Page 1
            params.per_page = 100;
            // Remove explicit ordering to avoid overrides
            delete params.orderby;
            delete params.order;
        }

        const response = await api.get("products", params);

        let products = Array.isArray(response.data) ? response.data : [];

        // Manual sorting for the 100-item window
        if (search && search.trim() !== "" && products.length > 0) {
            const query = search.toLowerCase().trim();
            products = [...products].sort((a: any, b: any) => {
                const aName = (a.name || "").toLowerCase();
                const bName = (b.name || "").toLowerCase();
                const aIdx = aName.indexOf(query);
                const bIdx = bName.indexOf(query);

                // Priority 1: Title matches first
                if (aIdx !== -1 && bIdx === -1) return -1;
                if (aIdx === -1 && bIdx !== -1) return 1;

                // Priority 2: Earlier title matches first
                if (aIdx !== -1 && bIdx !== -1) {
                    if (aIdx < bIdx) return -1;
                    if (aIdx > bIdx) return 1;
                }

                return 0;
            });
        }

        const total = parseInt(response.headers['x-wp-total'] || '0');
        // If searching, use the forced per_page for calculating total pages
        const effectivePerPage = (search && search.trim() !== "") ? 100 : perPage;
        const totalPages = Math.ceil(total / effectivePerPage);

        console.log(`[WC API] Products fetch: search="${search || ''}", page=${page}, count=${products.length}, total=${total}`);

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
