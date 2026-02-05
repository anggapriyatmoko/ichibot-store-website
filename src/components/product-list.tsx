"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Package, ShoppingCart, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts } from "@/app/actions/products";
import ProductDetail from "./product-detail";

function ProductListContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const activeSearch = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const [hasMore, setHasMore] = useState(true);

    const loadProducts = async (currentPage: number, searchTerm: string) => {
        setLoading(true);
        try {
            const { products: data, totalPages } = await getProducts(searchTerm, currentPage, 60);
            setProducts(data);

            if (currentPage >= totalPages) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error("Failed to load products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts(page, activeSearch);
    }, [page, activeSearch]);

    const setPage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`/?${params.toString()}`);
    };

    const clearFilter = () => {
        router.push("/");
    };

    return (
        <div className="animate-fade-in">
            {activeSearch && (
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', padding: '1rem 1.5rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                    <span style={{ color: '#64748b', fontSize: '0.95rem' }}>Menampilkan hasil untuk:</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem' }}>"{activeSearch}"</span>
                    <button onClick={clearFilter} style={{
                        marginLeft: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        color: '#ef4444',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: 'rgba(239, 68, 68, 0.05)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '0.5rem'
                    }}>
                        <X size={14} /> Bersihkan Pencarian
                    </button>
                </div>
            )}

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="glass" style={{ aspectRatio: '1/1', borderRadius: 'var(--radius)', opacity: 0.5 }}></div>
                    ))}
                </div>
            ) : products.length > 0 ? (
                <>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '2rem',
                        marginBottom: '4rem'
                    }}>
                        {products.map((product) => (
                            <div
                                key={product.id}
                                style={{
                                    background: 'white',
                                    borderRadius: '1rem',
                                    overflow: 'hidden',
                                    border: '1px solid var(--border)',
                                    transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    cursor: 'pointer',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-10px)';
                                    e.currentTarget.style.boxShadow = '0 15px 30px -10px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                                }}
                                onClick={() => setSelectedProduct(product)}
                            >
                                <div style={{ aspectRatio: '1/1', background: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                                    {product.images?.[0] ? (
                                        <img
                                            src={product.images[0].src}
                                            alt={product.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Package size={40} color="#cbd5e1" />
                                        </div>
                                    )}
                                    {product.on_sale && (
                                        <span style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: '#f59e0b', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.65rem', fontWeight: 800 }}>DISKON</span>
                                    )}
                                </div>
                                <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <h3 style={{
                                        fontSize: '0.95rem',
                                        fontWeight: 600,
                                        color: '#334155',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        height: '2.6rem'
                                    }}>{product.name}</h3>

                                    <div style={{ marginTop: 'auto' }}>
                                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                                            Rp {parseInt(product.price).toLocaleString()}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: product.stock_status === 'instock' ? 'var(--success)' : 'var(--destructive)' }}></div>
                                            <span style={{ fontSize: '0.75rem', color: product.stock_status === 'instock' ? 'var(--success)' : 'var(--destructive)', fontWeight: 600 }}>
                                                {product.stock_status === 'instock' ? (product.stock_quantity ? `Stok: ${product.stock_quantity}` : 'Ready Stock') : 'Stok Habis'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', paddingBottom: '4rem' }}>
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(Math.max(1, page - 1))}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.25rem',
                                borderRadius: '0.75rem',
                                background: page === 1 ? '#f1f5f9' : 'white',
                                border: '1px solid var(--border)',
                                color: page === 1 ? '#94a3b8' : '#1e293b',
                                fontWeight: 600,
                                cursor: page === 1 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <ChevronLeft size={20} /> Prev
                        </button>

                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>Halaman {page}</span>

                        <button
                            disabled={!hasMore}
                            onClick={() => setPage(page + 1)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.25rem',
                                borderRadius: '0.75rem',
                                background: !hasMore ? '#f1f5f9' : 'white',
                                border: '1px solid var(--border)',
                                color: !hasMore ? '#94a3b8' : '#1e293b',
                                fontWeight: 600,
                                cursor: !hasMore ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Next <ChevronRight size={20} />
                        </button>
                    </div>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', border: '1px solid var(--border)', borderRadius: '1rem' }}>
                    <Package size={64} color="#cbd5e1" style={{ marginBottom: '1.5rem' }} />
                    <h3 style={{ fontSize: '1.25rem', color: '#1e293b' }}>Produk tidak ditemukan</h3>
                    <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Coba kata kunci lain atau kembali ke halaman utama.</p>
                    <button onClick={clearFilter} style={{ marginTop: '1.5rem', color: 'var(--primary)', fontWeight: 700 }}>Lihat Semua Produk</button>
                </div>
            )}

            {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
        </div>
    );
}

export default function ProductList() {
    return (
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><Loader2 className="animate-spin" /></div>}>
            <ProductListContent />
        </Suspense>
    );
}
