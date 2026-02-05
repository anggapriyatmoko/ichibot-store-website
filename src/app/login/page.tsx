"use client";

import { useState } from "react";
import { login } from "@/app/actions/auth";
import { Lock, User, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError("");
        try {
            await login(formData);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
            setLoading(false);
        }
    }

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            animation: 'fadeIn 0.5s ease'
        }}>
            <div className="glass" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '2.5rem',
                borderRadius: 'var(--radius)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem auto'
                    }}>
                        <Lock color="var(--primary)" size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Admin Login</h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>Secure access to dashboard</p>
                </div>

                <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                            name="username"
                            type="text"
                            placeholder="Username"
                            required
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem 0.8rem 3rem',
                                background: 'rgba(15, 23, 42, 0.5)',
                                border: '1px solid var(--border)',
                                borderRadius: '0.5rem',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem 0.8rem 3rem',
                                background: 'rgba(15, 23, 42, 0.5)',
                                border: '1px solid var(--border)',
                                borderRadius: '0.5rem',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {error && <p style={{ color: 'var(--destructive)', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}

                    <button
                        disabled={loading}
                        style={{
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '0.8rem',
                            borderRadius: '0.5rem',
                            fontWeight: 600,
                            marginTop: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
