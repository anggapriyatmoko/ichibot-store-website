export const dynamic = "force-dynamic";
import { getProducts } from "@/app/actions/products";
import { getOrders } from "@/app/actions/orders";
import { Package, ShoppingCart, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
    const { total: totalProducts } = await getProducts();
    const orders = await getOrders();

    const stats = [
        { label: "Total Products", value: totalProducts || 0, icon: <Package size={24} />, color: "#6366f1" },
        { label: "Total Orders", value: orders.totalItems || 0, icon: <ShoppingCart size={24} />, color: "#10b981" },
        { label: "Recent Sync", value: "Live", icon: <TrendingUp size={24} />, color: "#a855f7" },
    ];

    return (
        <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>Dashboard Overview</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {stats.map((stat, i) => (
                    <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ background: `${stat.color}20`, color: stat.color, padding: '1rem', borderRadius: '0.75rem' }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>{stat.label}</p>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 600 }}>Recent Activity</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Everything is up to date with WooCommerce API.</p>
                </div>
            </div>
        </div>
    );
}
