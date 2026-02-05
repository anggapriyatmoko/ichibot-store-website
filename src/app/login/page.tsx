"use client";

import { useState, useEffect, useCallback } from "react";
import { login, loginWithPin } from "@/app/actions/auth";
import { Lock, User, Loader2, Key, Delete, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<'password' | 'pin'>('password');
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [pin, setPin] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handlePinInput = useCallback((val: string) => {
        if (pin.length < 6) {
            setPin(prev => prev + val);
        }
    }, [pin]);

    const handlePinDelete = useCallback(() => {
        setPin(prev => prev.slice(0, -1));
    }, []);

    // Keyboard support for PIN
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (mode !== 'pin') return;
            if (/^\d$/.test(e.key)) {
                handlePinInput(e.key);
            } else if (e.key === 'Backspace') {
                handlePinDelete();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mode, handlePinInput, handlePinDelete]);

    async function handlePasswordSubmit(formData: FormData) {
        setLoading(true);
        setError("");
        try {
            await login(formData);
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan");
            setLoading(false);
        }
    }

    async function handlePinLogin() {
        if (pin.length !== 6) return;
        setLoading(true);
        setError("");
        try {
            const res = await loginWithPin(pin);
            if (res.success) {
                router.push(res.redirect);
            }
        } catch (err: any) {
            setError(err.message || "PIN salah");
            setLoading(false);
            setPin(""); // Clear PIN on error
        }
    }

    // Auto-submit PIN when 6 digits are reached
    useEffect(() => {
        if (pin.length === 6 && !loading) {
            handlePinLogin();
        }
    }, [pin, loading]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            animation: 'fadeIn 0.5s ease',
            padding: '1rem'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '440px',
                background: 'white',
                padding: '2rem',
                borderRadius: '1.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f1f5f9'
            }}>
                {/* Mode Toggles */}
                <div style={{
                    display: 'flex',
                    background: '#f1f5f9',
                    padding: '0.4rem',
                    borderRadius: '1rem',
                    marginBottom: '2.5rem'
                }}>
                    <button
                        onClick={() => { setMode('password'); setError(""); }}
                        style={{
                            flex: 1,
                            padding: '0.8rem',
                            borderRadius: '0.75rem',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: mode === 'password' ? 'var(--primary)' : 'transparent',
                            color: mode === 'password' ? 'white' : '#64748b',
                            boxShadow: mode === 'password' ? '0 4px 12px rgba(37, 99, 235, 0.2)' : 'none'
                        }}
                    >
                        <Lock size={18} /> Password
                    </button>
                    <button
                        onClick={() => { setMode('pin'); setError(""); }}
                        style={{
                            flex: 1,
                            padding: '0.8rem',
                            borderRadius: '0.75rem',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: mode === 'pin' ? 'var(--primary)' : 'transparent',
                            color: mode === 'pin' ? 'white' : '#64748b',
                            boxShadow: mode === 'pin' ? '0 4px 12px rgba(37, 99, 235, 0.2)' : 'none'
                        }}
                    >
                        <Key size={18} /> PIN
                    </button>
                </div>

                {mode === 'password' ? (
                    <form action={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.6rem' }}>Email address</label>
                            <input
                                name="username"
                                type="text"
                                placeholder="user@ichibot.id"
                                required
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0.75rem',
                                    color: '#1e293b',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.6rem' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        paddingRight: '3rem',
                                        background: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '0.75rem',
                                        color: '#1e293b',
                                        outline: 'none',
                                        fontSize: '1rem'
                                    }}
                                />
                                <button
                                    type="button"
                                    onMouseDown={() => setShowPassword(true)}
                                    onMouseUp={() => setShowPassword(false)}
                                    onMouseLeave={() => setShowPassword(false)}
                                    onTouchStart={() => setShowPassword(true)}
                                    onTouchEnd={() => setShowPassword(false)}
                                    style={{
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: '#94a3b8',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '0.25rem'
                                    }}
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', fontWeight: 600 }}>{error}</p>}

                        <button
                            disabled={loading}
                            style={{
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                fontWeight: 800,
                                fontSize: '1rem',
                                marginTop: '1rem',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : "Sign in"}
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Kode PIN</p>

                        {/* PIN Dots */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '0.75rem',
                                    border: '2px solid #e2e8f0',
                                    background: '#f8fafc',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {pin.length > i && (
                                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#94a3b8' }} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '2rem' }}>{pin.length}/6 digit</p>

                        {/* Numeric Keypad */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', maxWidth: '300px', margin: '0 auto' }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <button
                                    key={num}
                                    onClick={() => handlePinInput(num.toString())}
                                    style={{
                                        padding: '1.25rem',
                                        background: '#f8fafc',
                                        border: 'none',
                                        borderRadius: '0.75rem',
                                        fontSize: '1.5rem',
                                        fontWeight: 800,
                                        color: '#1e293b',
                                        cursor: 'pointer',
                                        transition: 'all 0.1s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    {num}
                                </button>
                            ))}
                            <div />
                            <button
                                onClick={() => handlePinInput("0")}
                                style={{
                                    padding: '1.25rem',
                                    background: '#f8fafc',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    fontSize: '1.5rem',
                                    fontWeight: 800,
                                    color: '#1e293b',
                                    cursor: 'pointer'
                                }}
                            >
                                0
                            </button>
                            <button
                                onClick={handlePinDelete}
                                style={{
                                    padding: '1.25rem',
                                    background: '#f8fafc',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    fontSize: '1.5rem',
                                    color: '#1e293b',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Delete size={24} />
                            </button>
                        </div>

                        {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '1.5rem', fontWeight: 600 }}>{error}</p>}

                        <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                            💡 Desktop: Klik keypad atau ketik langsung dengan keyboard
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
