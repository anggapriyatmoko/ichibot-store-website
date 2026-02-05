"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import ProfileMenu from "./profile-menu";
import { getSession } from "@/app/actions/auth";

export default function Header() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        setSearchTerm(searchParams.get("search") || "");
    }, [searchParams]);

    // Check session status on mount
    useEffect(() => {
        async function checkSession() {
            try {
                const session = await getSession();
                setUser(session);
            } catch (error) {
                setUser(null);
            }
        }
        checkSession();
    }, []);

    const isLoggedIn = !!user?.isAdmin || (user?.role && user.role !== '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm.trim()) {
            params.set("search", searchTerm.trim());
        } else {
            params.delete("search");
        }
        params.delete("page");
        router.push(`/?${params.toString()}`);
    };

    const clearSearch = () => {
        setSearchTerm("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("search");
        params.delete("page");
        router.push(`/?${params.toString()}`);
    };

    return (
        <nav className="glass" style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            padding: '0.75rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            gap: '2rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexShrink: 0 }}>
                <h1
                    onClick={() => router.push("/")}
                    style={{
                        fontSize: '1.4rem',
                        fontWeight: 800,
                        background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                    }}
                >
                    ICHIBOT STORE
                </h1>

                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <a href="/" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>Home</a>
                    {user?.isAdmin && (
                        <a href="/dashboard" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>Dashboard</a>
                    )}
                </div>
            </div>

            <div style={{ flex: 1, maxWidth: '600px' }}>
                <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%' }}>
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.6rem 3rem 0.6rem 2.5rem',
                            borderRadius: '0.75rem',
                            background: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            color: '#1e293b',
                            fontSize: '0.9rem',
                            outline: 'none',
                            transition: 'all 0.2s',
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--primary)';
                            e.currentTarget.style.background = 'white';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.background = '#f1f5f9';
                        }}
                    />
                    <Search style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', color: '#94a3b8' }} size={16} />

                    {searchTerm && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            style={{
                                position: 'absolute',
                                right: '0.75rem',
                                top: '0.75rem',
                                color: '#94a3b8',
                                cursor: 'pointer',
                                background: 'none',
                                border: 'none',
                                padding: 0
                            }}
                        >
                            <X size={16} />
                        </button>
                    )}
                </form>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                {isLoggedIn ? (
                    <ProfileMenu user={user} />
                ) : (
                    <a
                        href="/login"
                        style={{
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            color: 'white',
                            background: 'var(--primary)',
                            padding: '0.5rem 1.25rem',
                            borderRadius: '0.6rem'
                        }}
                    >
                        Login
                    </a>
                )}
            </div>
        </nav>
    );
}
