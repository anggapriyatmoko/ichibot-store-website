"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Package, ShoppingCart, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts } from "@/app/actions/products";
import { getSession } from "@/app/actions/auth";
import ProductDetail from "./product-detail";
import CheckoutReceipt from "./checkout-receipt";
import { createOrder } from "@/app/actions/orders";


function ProductCardSkeleton() {
    return (
        <div className="glass" style={{ borderRadius: '1.25rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className="animate-shimmer" style={{ aspectRatio: '1/1' }}></div>
            <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div className="animate-shimmer" style={{ height: '1.2rem', width: '90%', borderRadius: '0.4rem' }}></div>
                <div className="animate-shimmer" style={{ height: '1.2rem', width: '60%', borderRadius: '0.4rem' }}></div>
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div className="animate-shimmer" style={{ height: '1.5rem', width: '120px', borderRadius: '0.4rem' }}></div>
                    <div className="animate-shimmer" style={{ height: '0.8rem', width: '80px', borderRadius: '0.4rem' }}></div>
                </div>
            </div>
        </div>
    );
}

function ProductListContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [cart, setCart] = useState<any[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdOrder, setCreatedOrder] = useState<any>(null);


    const activeSearch = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            const session = await getSession();
            setUser(session);
        }
        fetchUser();

        // Load cart from localStorage
        const savedCart = localStorage.getItem('ichibot_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart");
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('ichibot_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (e: React.MouseEvent, product: any) => {
        e.stopPropagation(); // Prevent opening detail modal
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const updatePrice = (productId: number, newPrice: string) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                return { ...item, price: newPrice };
            }
            return item;
        }));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (parseInt(item.price) * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
        console.log(`[ProductList] Loading page ${page} with search "${activeSearch}"`);
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

    const handleCheckout = async () => {
        if (cart.length === 0 || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const result = await createOrder(cart);
            if (result.success) {
                setCreatedOrder(result.order);
                setCart([]);
                localStorage.removeItem('ichibot_cart');
                setIsCartOpen(false);
            } else {
                alert("Gagal membuat pesanan: " + result.error);
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Terjadi kesalahan saat melakukan checkout.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
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
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '2rem',
                        marginBottom: '4rem'
                    }}>
                        {[...Array(12)].map((_, i) => (
                            <ProductCardSkeleton key={i} />
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
                                    className="glass"
                                    style={{
                                        borderRadius: '1.25rem',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        position: 'relative'
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
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            filter: product.stock_status !== 'instock' ? 'blur(1px) grayscale(20%)' : 'none',
                                            transition: 'filter 0.3s'
                                        }}>
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
                                        </div>

                                        {product.stock_status !== 'instock' && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                padding: '0.4rem 1.2rem',
                                                background: 'rgba(0,0,0,0.6)',
                                                color: 'white',
                                                borderRadius: '0.6rem',
                                                fontSize: '0.8rem',
                                                fontWeight: 800,
                                                letterSpacing: '1px',
                                                zIndex: 2,
                                                pointerEvents: 'none',
                                                border: '1px solid rgba(255,255,255,0.2)'
                                            }}>
                                                HABIS
                                            </div>
                                        )}

                                        {product.on_sale && (
                                            <span style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: '#f59e0b', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.65rem', fontWeight: 800, zIndex: 3 }}>DISKON</span>
                                        )}

                                        {/* Add to Cart Button */}
                                        {user?.role && product.stock_status === 'instock' && (
                                            <button
                                                onClick={(e) => addToCart(e, product)}
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '0.75rem',
                                                    right: '0.75rem',
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: 'var(--primary)',
                                                    color: 'white',
                                                    border: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                                                    zIndex: 4,
                                                    padding: 0
                                                }}
                                                title="Tambah ke Keranjang"
                                            >
                                                <ShoppingCart size={18} />
                                            </button>
                                        )}
                                    </div>

                                    <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <h3 style={{
                                            fontSize: '0.95rem',
                                            fontWeight: 600,
                                            color: '#334155',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            height: '4.2rem',
                                            lineHeight: '1.4'
                                        }}>{(product.name.length > 200 ? product.name.substring(0, 200) + "..." : product.name).replace(/&amp;/g, '&')}</h3>

                                        {user?.role && product.sku && (
                                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400, marginTop: '-0.2rem' }}>
                                                SKU: {product.sku}
                                            </p>
                                        )}

                                        <div style={{ marginTop: 'auto' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                                                {product.on_sale && product.regular_price && (
                                                    <span style={{ fontSize: '0.8rem', color: '#ef4444', textDecoration: 'line-through', fontWeight: 500 }}>
                                                        Rp {parseInt(product.regular_price).toLocaleString()}
                                                    </span>
                                                )}
                                                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                                                    Rp {parseInt(product.price).toLocaleString()}
                                                </span>
                                            </div>
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
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '1rem',
                                    background: page === 1 ? '#f1f5f9' : 'white',
                                    border: '1px solid var(--border)',
                                    color: page === 1 ? '#94a3b8' : '#1e293b',
                                    fontWeight: 700,
                                    cursor: page === 1 ? 'default' : 'pointer',
                                    transition: 'all 0.2s',
                                    fontSize: '0.95rem'
                                }}
                            >
                                <ChevronLeft size={20} /> Prev
                            </button>
                            <span style={{ fontWeight: 600, color: '#64748b' }}>Halaman {page}</span>
                            <button
                                disabled={!hasMore}
                                onClick={() => setPage(page + 1)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '1rem',
                                    background: !hasMore ? '#f1f5f9' : 'white',
                                    border: '1px solid var(--border)',
                                    color: !hasMore ? '#94a3b8' : '#1e293b',
                                    fontWeight: 700,
                                    cursor: !hasMore ? 'default' : 'pointer',
                                    transition: 'all 0.2s',
                                    fontSize: '0.95rem'
                                }}
                            >
                                Next <ChevronRight size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem' }} className="animate-fade-in">
                        <div style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <X size={40} color="#94a3b8" />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Produk tidak ditemukan</h3>
                        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Coba kata kunci lain atau kembali ke halaman utama.</p>
                        <button onClick={clearFilter} style={{ marginTop: '1.5rem', color: 'var(--primary)', fontWeight: 700 }}>Lihat Semua Produk</button>
                    </div>
                )}
            </div>

            {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />}

            {createdOrder && <CheckoutReceipt order={createdOrder} onClose={() => setCreatedOrder(null)} />}

            {/* Floating Cart Button */}
            {user?.role && (
                <button
                    onClick={() => setIsCartOpen(true)}
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                        zIndex: 100,
                        transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <ShoppingCart size={28} />
                    {cartCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            background: '#ef4444',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '1rem',
                            border: '3px solid white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            {cartCount}
                        </span>
                    )}
                </button>
            )}

            {/* Cart Drawer */}
            {isCartOpen && (
                <>
                    <div
                        onClick={() => setIsCartOpen(false)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 101, backdropFilter: 'blur(4px)' }}
                    />
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        height: '100%',
                        width: '100%',
                        maxWidth: '450px',
                        background: 'white',
                        zIndex: 102,
                        boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        animation: 'slide-in-right 0.3s ease-out'
                    }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <ShoppingCart size={24} color="var(--primary)" /> Keranjang Saya
                            </h2>
                            <button onClick={() => setIsCartOpen(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1.5rem' }}>
                            {cart.length === 0 ? (
                                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                                    <div style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                        <ShoppingCart size={40} color="#cbd5e1" />
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Keranjang Kosong</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Anda belum menambahkan produk apapun ke dalam keranjang.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {cart.map((item) => (
                                        <div key={item.id} style={{ display: 'flex', gap: '1rem' }}>
                                            <div style={{ width: '80px', height: '80px', borderRadius: '0.75rem', background: '#f1f5f9', overflow: 'hidden', flexShrink: 0 }}>
                                                {item.images?.[0] && <img src={item.images[0].src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                            </div>
                                            <div style={{ flexGrow: 1 }}>
                                                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.25rem' }}>{item.name}</h4>

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Harga: Rp</span>
                                                        <input
                                                            type="text"
                                                            value={item.price}
                                                            onChange={(e) => updatePrice(item.id, e.target.value.replace(/\D/g, ''))}
                                                            style={{
                                                                width: '100px',
                                                                padding: '0.2rem 0.5rem',
                                                                borderRadius: '0.4rem',
                                                                border: '1px solid #e2e8f0',
                                                                fontSize: '0.85rem',
                                                                fontWeight: 800,
                                                                color: 'var(--primary)',
                                                                outline: 'none',
                                                                textAlign: 'left'
                                                            }}
                                                        />
                                                    </div>

                                                    {item.on_sale && item.regular_price && (
                                                        <span style={{ fontSize: '0.75rem', color: '#ef4444', textDecoration: 'line-through', marginLeft: '3.5rem' }}>
                                                            Rp {parseInt(item.regular_price).toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '0.5rem' }}>
                                                        <button onClick={() => updateQuantity(item.id, -1)} style={{ width: '24px', height: '24px', borderRadius: '0.25rem', background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>-</button>
                                                        <span style={{ minWidth: '24px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700 }}>{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, 1)} style={{ width: '24px', height: '24px', borderRadius: '0.25rem', background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>+</button>
                                                    </div>

                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Subtotal</div>
                                                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)' }}>
                                                            Rp {(parseInt(item.price) * item.quantity).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>

                                                <button onClick={() => removeFromCart(item.id)} style={{ color: '#ef4444', background: 'none', border: 'none', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem', width: '100%', textAlign: 'right' }}>Hapus</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div style={{ padding: '1.5rem', borderTop: '1px solid #f1f5f9', background: '#fafafa' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ color: '#64748b', fontWeight: 600 }}>Total Pembayaran:</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>Rp {cartTotal.toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    disabled={isSubmitting}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: isSubmitting ? '#94a3b8' : 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '1rem',
                                        fontSize: '1rem',
                                        fontWeight: 800,
                                        cursor: isSubmitting ? 'default' : 'pointer',
                                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.75rem'
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} /> Memproses...
                                        </>
                                    ) : (
                                        "Lanjutkan Checkout"
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default function ProductList() {
    return (
        <Suspense fallback={<div className="container" style={{ minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" size={48} color="var(--primary)" /></div>}>
            <ProductListContent />
        </Suspense>
    );
}
