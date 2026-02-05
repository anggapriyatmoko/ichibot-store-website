import { getProducts } from "@/app/actions/products";
import { Package, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const sp = await searchParams;
    const page = parseInt(sp.page || "1");
    const { products, total, totalPages } = await getProducts(undefined, page, 20);

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Products Mirror</h2>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#1e293b', fontWeight: 600, fontSize: '1rem' }}>Total: {total} Produk</p>
                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Halaman {page} dari {totalPages}</p>
                </div>
            </div>

            <div className="glass" style={{ borderRadius: '1rem', overflow: 'hidden', marginBottom: '2rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.02)' }}>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Product</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>SKU</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Price</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Stock</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? products.map((product: any) => (
                            <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', background: '#f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {product.images?.[0] ? <img src={product.images[0].src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={20} color="#cbd5e1" />}
                                        </div>
                                        <span style={{ fontWeight: 500 }}>{product.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', color: '#94a3b8' }}>{product.sku || '-'}</td>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>Rp {parseInt(product.price).toLocaleString()}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: product.stock_status === 'instock' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: product.stock_status === 'instock' ? '#10b981' : '#ef4444'
                                    }}>
                                        {product.stock_status === 'instock' ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <a href={product.permalink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                        View <ExternalLink size={14} />
                                    </a>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No products found in WooCommerce.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
                    <Link
                        href={`/dashboard/products?page=${Math.max(1, page - 1)}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.6rem 1.25rem',
                            borderRadius: '0.75rem',
                            background: page === 1 ? '#f1f5f9' : 'white',
                            border: '1px solid var(--border)',
                            color: page === 1 ? '#94a3b8' : '#1e293b',
                            fontWeight: 600,
                            pointerEvents: page === 1 ? 'none' : 'auto',
                            textDecoration: 'none',
                            fontSize: '0.9rem'
                        }}
                    >
                        <ChevronLeft size={18} /> Prev
                    </Link>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {[...Array(totalPages)].map((_, i) => {
                            const p = i + 1;
                            // Show only limited number of pages if too many
                            if (p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2)) {
                                return (
                                    <Link
                                        key={p}
                                        href={`/dashboard/products?page=${p}`}
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '0.6rem',
                                            background: page === p ? 'var(--primary)' : 'white',
                                            border: '1px solid ' + (page === p ? 'var(--primary)' : 'var(--border)'),
                                            color: page === p ? 'white' : '#1e293b',
                                            fontWeight: 700,
                                            textDecoration: 'none',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {p}
                                    </Link>
                                );
                            } else if (p === page - 3 || p === page + 3) {
                                return <span key={p} style={{ color: '#94a3b8' }}>...</span>;
                            }
                            return null;
                        })}
                    </div>

                    <Link
                        href={`/dashboard/products?page=${Math.min(totalPages, page + 1)}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.6rem 1.25rem',
                            borderRadius: '0.75rem',
                            background: page === totalPages ? '#f1f5f9' : 'white',
                            border: '1px solid var(--border)',
                            color: page === totalPages ? '#94a3b8' : '#1e293b',
                            fontWeight: 600,
                            pointerEvents: page === totalPages ? 'none' : 'auto',
                            textDecoration: 'none',
                            fontSize: '0.9rem'
                        }}
                    >
                        Next <ChevronRight size={18} />
                    </Link>
                </div>
            )}
        </div>
    );
}

