"use client";

import { useState, useEffect } from "react";
import { User, Mail, Lock, Save, Loader2, ArrowLeft, Key } from "lucide-react";
import { getSession } from "@/app/actions/auth";
import { updateProfile } from "@/app/actions/profile";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        async function fetchUser() {
            const session = await getSession();
            setUser(session);
            setLoading(false);
        }
        fetchUser();
    }, []);

    async function handleSubmit(formData: FormData) {
        setSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await updateProfile(formData);
            if (res.success) {
                setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
                // Re-fetch user to update UI
                const session = await getSession();
                setUser(session);
            } else {
                setMessage({ type: 'error', text: res.error || 'Gagal memperbarui profil.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan sistem.' });
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => router.back()}
                    style={{
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        padding: '0.5rem',
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        color: '#64748b'
                    }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>Edit Profil</h1>
                    <p style={{ color: '#64748b' }}>Kelola informasi akun Anda</p>
                </div>
            </div>

            <div className="admin-card" style={{ padding: '2.5rem' }}>
                {message.text && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        marginBottom: '2rem',
                        background: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                        color: message.type === 'success' ? '#059669' : '#dc2626',
                        border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
                        fontWeight: 600,
                        fontSize: '0.9rem'
                    }}>
                        {message.text}
                    </div>
                )}

                <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <User size={16} /> Nama Lengkap
                            </label>
                            <input
                                name="displayName"
                                required
                                defaultValue={user?.username}
                                placeholder="Masukkan nama lengkap"
                                style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', transition: 'border-color 0.2s' }}
                                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <Mail size={16} /> Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                defaultValue={user?.email}
                                placeholder="name@example.com"
                                style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', transition: 'border-color 0.2s' }}
                                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <Lock size={16} /> Ganti Password (Opsional)
                        </label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Biarkan kosong jika tidak ingin mengubah"
                            style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', transition: 'border-color 0.2s' }}
                            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                        />
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>Minimal 8 karakter dengan kombinasi angka dan huruf.</p>
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <Key size={16} /> PIN (6 Digit)
                        </label>
                        <input
                            name="pin"
                            type="text"
                            maxLength={6}
                            placeholder="Masukkan 6 digit angka"
                            style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', transition: 'border-color 0.2s' }}
                            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                            onChange={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                        />
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>Digunakan untuk login cepat via PIN.</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button
                            disabled={submitting}
                            type="submit"
                            style={{
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '1rem 2.5rem',
                                borderRadius: '1rem',
                                fontWeight: 800,
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                border: 'none',
                                cursor: submitting ? 'default' : 'pointer',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                                transition: 'all 0.2s',
                                opacity: submitting ? 0.7 : 1
                            }}
                        >
                            {submitting ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <Save size={20} />
                            )}
                            {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
