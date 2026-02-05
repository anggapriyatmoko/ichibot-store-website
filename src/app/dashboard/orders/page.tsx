import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getOrders } from "@/app/actions/orders";
import OrderList from "@/components/orders/order-list";

interface PageProps {
    searchParams: Promise<{ page?: string; per_page?: string }>;
}

export default async function AdminOrders({ searchParams }: PageProps) {
    const params = await searchParams;
    const currentPage = parseInt(params.page || "1");
    const perPage = parseInt(params.per_page || "10");

    const { data: orders, totalItems, totalPages } = await getOrders(currentPage, perPage);

    const perPageOptions = [10, 50, 100];

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Orders Mirror</h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                        Showing {orders.length > 0 ? (currentPage - 1) * perPage + 1 : 0} - {Math.min(currentPage * perPage, totalItems)} of {totalItems} total orders
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Show:</span>
                    <div style={{ display: 'flex', background: 'white', borderRadius: '0.5rem', border: '1px solid var(--border)', overflow: 'hidden' }}>
                        {perPageOptions.map(option => (
                            <Link
                                key={option}
                                href={`/dashboard/orders?page=1&per_page=${option}`}
                                style={{
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '0.85rem',
                                    color: perPage === option ? 'white' : '#64748b',
                                    background: perPage === option ? 'var(--primary)' : 'transparent',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    borderRight: option === 100 ? 'none' : '1px solid var(--border)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {option}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <OrderList orders={orders} />

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <Link
                        href={`/dashboard/orders?page=${Math.max(1, currentPage - 1)}&per_page=${perPage}`}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            background: 'white',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            opacity: currentPage === 1 ? 0.5 : 1,
                            pointerEvents: currentPage === 1 ? 'none' : 'auto',
                            color: '#1e293b'
                        }}
                    >
                        <ChevronLeft size={20} />
                    </Link>

                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Show a window of pages around current page
                            let pageNum = currentPage;
                            if (currentPage <= 3) pageNum = i + 1;
                            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                            else pageNum = currentPage - 2 + i;

                            if (pageNum < 1 || pageNum > totalPages) return null;

                            return (
                                <Link
                                    key={pageNum}
                                    href={`/dashboard/orders?page=${pageNum}&per_page=${perPage}`}
                                    style={{
                                        minWidth: '2.5rem',
                                        height: '2.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '0.5rem',
                                        background: currentPage === pageNum ? 'var(--primary)' : 'white',
                                        color: currentPage === pageNum ? 'white' : '#475569',
                                        border: '1px solid var(--border)',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {pageNum}
                                </Link>
                            );
                        })}
                    </div>

                    <Link
                        href={`/dashboard/orders?page=${Math.min(totalPages, currentPage + 1)}&per_page=${perPage}`}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            background: 'white',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            opacity: currentPage === totalPages ? 0.5 : 1,
                            pointerEvents: currentPage === totalPages ? 'none' : 'auto',
                            color: '#1e293b'
                        }}
                    >
                        <ChevronRight size={20} />
                    </Link>
                </div>
            )}
        </div>
    );
}


