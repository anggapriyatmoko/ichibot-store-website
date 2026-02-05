export const dynamic = "force-dynamic";
import { getOrders } from "@/app/actions/orders";
import { ShoppingBag } from "lucide-react";

export default async function AdminOrders() {
    const orders = await getOrders();

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Orders Mirror</h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Showing {orders.length} recent orders</p>
            </div>

            <div className="glass" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.02)' }}>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Order ID</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Customer</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Total</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? orders.map((order: any) => (
                            <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>#{order.id}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span>{order.billing?.first_name} {order.billing?.last_name}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{order.billing?.email}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.75rem',
                                        background: getStatusColor(order.status).bg,
                                        color: getStatusColor(order.status).text,
                                        textTransform: 'capitalize'
                                    }}>
                                        {order.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>Rp {parseInt(order.total).toLocaleString()}</td>
                                <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                                    {new Date(order.date_created).toLocaleDateString()}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No orders found in WooCommerce.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case 'completed': return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' };
        case 'processing': return { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' };
        case 'pending': return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' };
        default: return { bg: 'rgba(148, 163, 184, 0.1)', text: '#94a3b8' };
    }
}
