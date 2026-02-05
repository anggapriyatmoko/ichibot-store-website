"use client";

import { Printer } from "lucide-react";
import { useState } from "react";
import CheckoutReceipt from "@/components/checkout-receipt";

interface OrderListProps {
    orders: any[];
}

export default function OrderList({ orders }: OrderListProps) {
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    return (
        <>
            <div className="glass" style={{ borderRadius: '1rem', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.02)' }}>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Order ID</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Customer</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Total</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Date</th>
                            <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'center' }}>Action</th>
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
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        style={{
                                            background: 'rgba(56, 189, 248, 0.1)',
                                            color: '#0ea5e9',
                                            border: 'none',
                                            padding: '0.5rem',
                                            borderRadius: '0.5rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto',
                                            transition: 'all 0.2s'
                                        }}
                                        title="Print Receipt"
                                        className="hover:scale-110"
                                    >
                                        <Printer size={18} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No orders found in WooCommerce.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <CheckoutReceipt
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </>
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
