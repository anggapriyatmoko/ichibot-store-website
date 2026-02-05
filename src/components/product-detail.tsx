"use client";

import { X, ShoppingCart, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface ProductDetailProps {
    product: any;
    onClose: () => void;
}

export default function ProductDetail({ product, onClose }: ProductDetailProps) {
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

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
                maxWidth: '1400px',
                height: '95vh',
                maxHeight: '1000px',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'row',
                position: 'relative',
                background: 'white',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }} onClick={(e) => e.stopPropagation()}>

                <button onClick={onClose} style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    zIndex: 100,
                    background: 'white',
                    color: '#475569',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    <X size={24} />
                </button>

                {/* Image Section */}
                <div className="product-detail-image" style={{
                    width: '60%',
                    background: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                }}>
                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
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
                            gap: '1rem',
                            padding: '1.5rem 3rem 3rem 3rem',
                            background: 'white',
                            overflowX: 'auto',
                            justifyContent: 'center'
                        }}>
                            {product.images.map((img: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    style={{
                                        width: '72px',
                                        height: '72px',
                                        borderRadius: '0.75rem',
                                        overflow: 'hidden',
                                        border: activeImage === idx ? '2px solid var(--primary)' : '2px solid #f1f5f9',
                                        background: 'white',
                                        padding: '2px',
                                        transition: 'all 0.2s',
                                        flexShrink: 0,
                                        cursor: 'pointer',
                                        opacity: activeImage === idx ? 1 : 0.6
                                    }}
                                >
                                    <img src={img.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem' }} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="product-detail-content" style={{
                    width: '40%',
                    padding: '4rem 3rem',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    background: '#fcfcfc',
                    borderLeft: '1px solid #f1f5f9'
                }}>
                    <div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            {product.categories?.map((cat: any) => (
                                <span key={cat.id} style={{
                                    background: 'var(--accent)',
                                    color: 'var(--primary)',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    padding: '0.3rem 0.8rem',
                                    borderRadius: '2rem',
                                    letterSpacing: '0.05em'
                                }}>
                                    {cat.name}
                                </span>
                            ))}
                        </div>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: '1.2', color: '#1e293b' }}>{product.name}</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.5rem 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                            <span style={{ fontSize: '2.75rem', fontWeight: 900, color: 'var(--primary)' }}>
                                Rp {parseInt(product.price).toLocaleString()}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: product.stock_status === 'instock' ? '#10b981' : '#ef4444' }}></div>
                            <span style={{ color: product.stock_status === 'instock' ? '#10b981' : '#ef4444', fontWeight: 700, fontSize: '1rem' }}>
                                {product.stock_status === 'instock' ? (product.stock_quantity ? `Tersedia ${product.stock_quantity} unit` : 'Ready Stock') : 'Stok Habis'}
                            </span>
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '4px', height: '1.2rem', background: 'var(--primary)', borderRadius: '2px' }}></div>
                            Deskripsi Produk
                        </h3>
                        <div
                            style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.7' }}
                            dangerouslySetInnerHTML={{ __html: product.description || product.short_description || 'Tidak ada deskripsi tersedia untuk produk ini.' }}
                        />
                    </div>

                    <div style={{ marginTop: '2.5rem', position: 'sticky', bottom: 0, background: '#fcfcfc', paddingTop: '1rem' }}>
                        <a
                            href={product.on_sale ? product.permalink : `https://wa.me/6281234567890?text=Halo%20Ichibot,%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(product.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                width: '100%',
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '1.25rem',
                                borderRadius: '1rem',
                                fontWeight: 800,
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                cursor: 'pointer',
                                boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(37, 99, 235, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(37, 99, 235, 0.4)';
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
