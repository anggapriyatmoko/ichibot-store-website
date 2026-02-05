const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
    url: "https://store.ichibot.id/",
    consumerKey: "ck_d01bb0a70f5035e1e590fe64a50dc8aadb5195d2",
    consumerSecret: "cs_978db1abd49c417e0fc56d1141b738eb34bb73e6",
    version: "wc/v3",
});

async function test() {
    try {
        const word = "Raspberry Pi 5";
        console.log(`\nTesting search with word: "${word}"`);
        const searchRes = await api.get("products", { search: word, per_page: 5 });
        console.log(`Results found for "${word}":`, searchRes.data.length);
        console.log("Search results titles:", searchRes.data.map(p => p.name));
    } catch (err) {
        console.error("Test failed:", err.message);
    }
}

test();
