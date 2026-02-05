"use client";

import { X, Printer, CheckCircle, Package } from "lucide-react";

interface CheckoutReceiptProps {
    order: any;
    onClose: () => void;
}

import React, { useEffect } from 'react';

export default function CheckoutReceipt({ order, onClose }: CheckoutReceiptProps) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    if (!order) return null;

    const handlePrint = () => {
        const frame = document.createElement('iframe');
        frame.style.display = 'none';
        document.body.appendChild(frame);

        const doc = frame.contentWindow?.document;
        if (!doc) return;

        const receiptEl = document.getElementById('printable-receipt');
        if (!receiptEl) return;

        const content = receiptEl.innerHTML;

        doc.open();
        doc.write(`
            <html>
                <head>
                    <title>Cetak Struk Ichibot</title>
                    <style>
                        @page { margin: 0; size: auto; }
                        body { 
                            margin: 0; 
                            padding: 10mm; 
                            font-family: 'Inter', sans-serif;
                            color: #000;
                            background: #fff;
                        }
                        .print-wrapper { width: 100%; max-width: 80mm; margin: 0 auto; }
                        h1 { font-size: 2.5rem !important; margin: 0 0 0.5rem 0 !important; }
                        p { font-size: 0.9rem !important; margin: 0 0 0.2rem 0 !important; }
                        center { display: block; text-align: center; }
                        .order-meta { font-size: 0.9rem !important; margin-bottom: 1rem !important; }
                        .table-header { font-size: 0.9rem !important; border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 5px 0; margin-bottom: 10px; display: flex; font-weight: bold; }
                        .item-row { font-size: 0.9rem !important; margin-bottom: 8px; display: flex; }
                        .summary { border-top: 1px solid #ccc; padding-top: 8px; margin-top: 8px; font-size: 1rem !important; }
                        .footer-section { border-top: 1px solid #eee; padding-top: 10px; margin-top: 15px; text-align: center; }
                        b { font-weight: bold; }
                        i { font-style: italic; }
                    </style>
                </head>
                <body>
                    <div class="print-wrapper">${content}</div>
                    <script>
                        window.onload = () => {
                            setTimeout(() => {
                                window.print();
                                setTimeout(() => {
                                    window.parent.document.body.removeChild(window.frameElement);
                                }, 100);
                            }, 500);
                        };
                    </script>
                </body>
            </html>
        `);
        doc.close();
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backdropFilter: 'blur(8px)'
        }} onClick={onClose}>
            <div className="animate-slide-up" style={{
                background: 'white',
                width: '100%',
                maxWidth: '500px',
                maxHeight: '90vh',
                borderRadius: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                fontFamily: "'Inter', sans-serif"
            }} onClick={(e) => e.stopPropagation()}>

                {/* Header Action */}
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#475569' }}>Pratinjau Struk Belanja</h2>
                    <button onClick={onClose} style={{ background: '#e2e8f0', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Printable Content */}
                <div id="printable-receipt" style={{ flexGrow: 1, overflowY: 'auto', padding: '2.5rem 2rem', color: '#000' }}>
                    {/* Brand Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '0.4rem', letterSpacing: '-2px', color: '#000', lineHeight: 1 }}>ICHIBOT</h1>
                        <p style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 0.2rem 0' }}>Electronics and Robotic Store</p>
                        <p style={{ fontSize: '0.95rem', margin: '0 0 0.2rem 0' }}>Jln. Dworowati no.11 Sleman, Yogyakarta</p>
                        <p style={{ fontSize: '1.05rem', fontWeight: 900, margin: '0 0 0.2rem 0' }}>www.store.ichibot.id</p>
                        <p style={{ fontSize: '0.95rem', margin: 0 }}>0877-6348-4384</p>
                    </div>

                    {/* Order Metadata */}
                    <div className="order-meta" style={{ marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.4' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <span style={{ minWidth: '100px' }}>No Nota:</span>
                            <span style={{ fontWeight: 900 }}>{order.id}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <span style={{ minWidth: '100px' }}>Tanggal:</span>
                            <span style={{ fontWeight: 900 }}>{new Date(order.date_created).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}, {new Date(order.date_created).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <span style={{ minWidth: '100px' }}>Kasir:</span>
                            <span style={{ fontWeight: 900 }}>{order.billing?.first_name || 'kasir'}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <span style={{ minWidth: '100px' }}>Pembayaran:</span>
                            <span style={{ fontWeight: 900 }}>Cash</span>
                        </div>
                    </div>

                    {/* Table Header */}
                    <div style={{ borderTop: '3px solid #000', borderBottom: '3px solid #000', padding: '0.5rem 0', marginBottom: '1rem', display: 'flex', fontWeight: 900, fontSize: '1.1rem' }}>
                        <div style={{ flex: 1, textAlign: 'center' }}>Produk</div>
                        <div style={{ width: '40px', textAlign: 'center' }}>✓</div>
                        <div style={{ width: '120px', textAlign: 'right' }}>Total</div>
                    </div>

                    {/* Table Body */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                        {order.line_items?.map((item: any) => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', fontSize: '1.1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 900, margin: 0 }}>{item.quantity} x Rp{parseInt(item.price).toLocaleString('id-ID')}</p>
                                    <p style={{ margin: '0.2rem 0', lineHeight: '1.3' }}>{item.name}</p>
                                    {item.sku && <p style={{ fontWeight: 900, margin: 0 }}>{item.sku}</p>}
                                </div>
                                <div style={{ width: '40px', display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
                                    <div style={{ width: '18px', height: '18px', border: '1.5px solid #000', borderRadius: '2px' }}></div>
                                </div>
                                <div style={{ width: '120px', textAlign: 'right', fontWeight: 900, paddingTop: '0.2rem' }}>
                                    Rp{(item.quantity * parseInt(item.price)).toLocaleString('id-ID')}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div style={{ borderTop: '1px solid #ccc', paddingTop: '1rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 900 }}>Total</span>
                            <span style={{ fontWeight: 900, minWidth: '120px', textAlign: 'right' }}>Rp{parseInt(order.total).toLocaleString('id-ID')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', fontSize: '1.2rem' }}>
                            <span style={{ fontWeight: 900 }}>Dibayarkan</span>
                            <span style={{ fontWeight: 900, minWidth: '120px', textAlign: 'right' }}>Rp{parseInt(order.total).toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}></div>

                    {/* Footer Messages */}
                    <div style={{ borderTop: '2px solid #000', paddingTop: '1.2rem', textAlign: 'center', fontSize: '1rem', fontWeight: 600, lineHeight: '1.4', marginBottom: '1.2rem' }}>
                        <p style={{ margin: 0 }}>Terimakasih sudah berbelanja di ICHIBOT Store.</p>
                        <p style={{ margin: 0 }}>Cek katalog dan stock produk di <b style={{ fontWeight: 900 }}>www.store.ichibot.id</b></p>
                    </div>

                    <div style={{ borderTop: '2px solid #000', paddingTop: '1.2rem', textAlign: 'center', fontSize: '1rem', fontWeight: 600, lineHeight: '1.4', marginBottom: '1.2rem' }}>
                        <p style={{ margin: 0 }}>Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan</p>
                    </div>

                    {/* Social Media Footer */}
                    <div style={{ borderTop: '2px solid #000', paddingTop: '1.2rem', textAlign: 'center', fontSize: '1.05rem', lineHeight: '1.5' }}>
                        <p style={{ margin: 0 }}>Instagram : @team.ichibot</p>
                        <p style={{ margin: 0 }}>Tokopedia : ICHIBOT</p>
                        <p style={{ margin: 0 }}>Shopee : ichibot</p>
                        <p style={{ margin: 0 }}>Youtube : ICHIBOT</p>
                        <p style={{ margin: 0 }}>Tiktok : @team.ichibot</p>
                    </div>

                    <div style={{ borderBottom: '2px solid #000', marginTop: '1.2rem' }}></div>
                </div>

                {/* Bottom Actions */}
                <div style={{ padding: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '1rem', background: 'white' }}>
                    <button
                        onClick={handlePrint}
                        style={{
                            flex: 1,
                            padding: '1.1rem',
                            background: '#000',
                            color: 'white',
                            border: 'none',
                            borderRadius: '1rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        <Printer size={20} /> Cetak Struk
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '1.1rem 2rem',
                            background: '#f1f5f9',
                            color: '#475569',
                            border: 'none',
                            borderRadius: '1rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
