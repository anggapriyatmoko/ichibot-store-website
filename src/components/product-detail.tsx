"use client";

import { X, ShoppingCart, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

interface ProductDetailProps {
    product: any;
    onClose: () => void;
}

export default function ProductDetail({ product, onClose }: ProductDetailProps) {
    const [activeImage, setActiveImage] = useState(0);

    if (!product) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
        }} onClick={onClose} className="animate-fade-in">
            <div className="animate-slide-up product-detail-modal" style={{
                width: '100%',
                maxWidth: '1100px',
                maxHeight: '90vh',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'row',
                position: 'relative',
                background: 'white',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
            }} onClick={(e) => e.stopPropagation()}>

                <button onClick={onClose} style={{
                    position: 'absolute',
                    top: '1.25rem',
                    right: '1.25rem',
                    zIndex: 100,
                    background: 'rgba(241, 245, 249, 0.8)',
                    color: '#475569',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer'
                }}>
                    <X size={20} />
                </button>

                {/* Image Section */}
                <div className="product-detail-image" style={{ width: '55%', background: '#f8fafc', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e2e8f0' }}>
                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                        {product.images?.[activeImage] ? (
                            <img
                                src={product.images[activeImage].src}
                                alt={product.name}
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShoppingCart size={80} color="#e2e8f0" />
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div style={{
                            display: 'flex',
                            gap: '0.75rem',
                            padding: '1rem 2rem 2rem 2rem',
                            background: '#f8fafc',
                            overflowX: 'auto',
                        }}>
                            {product.images.map((img: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '0.5rem',
                                        overflow: 'hidden',
                                        border: activeImage === idx ? '2px solid var(--primary)' : '2px solid #e2e8f0',
                                        background: 'white',
                                        padding: '2px',
                                        transition: 'all 0.2s',
                                        flexShrink: 0,
                                        cursor: 'pointer',
                                        opacity: activeImage === idx ? 1 : 0.7
                                    }}
                                >
                                    <img src={img.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.3rem' }} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="product-detail-content" style={{ width: '45%', padding: '3rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                            {product.categories?.map((cat: any) => (
                                <span key={cat.id} style={{
                                    color: 'var(--primary)',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {cat.name}
                                </span>
                            ))}
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: '1.3', color: '#1e293b' }}>{product.name}</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                            Rp {parseInt(product.price).toLocaleString()}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {product.stock_status === 'instock' ? (
                                <>
                                    <CheckCircle size={18} color="#10b981" />
                                    <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>
                                        Tersedia {product.stock_quantity ? `(${product.stock_quantity} unit)` : ''}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle size={18} color="#ef4444" />
                                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>Stok Habis</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1e293b' }}>Deskripsi Produk</h3>
                        <div
                            style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}
                            dangerouslySetInnerHTML={{ __html: product.description || product.short_description || 'Tidak ada deskripsi tersedia untuk produk ini.' }}
                        />
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '2.5rem' }}>
                        <a
                            href={product.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                width: '100%',
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '1.1rem',
                                borderRadius: '0.75rem',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
                            }}
                        >
                            <ShoppingCart size={22} />
                            Beli Sekarang
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
