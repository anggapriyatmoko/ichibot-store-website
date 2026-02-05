"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, ChevronDown, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/actions/auth";

export default function ProfileMenu({ user }: { user: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div style={{ position: 'relative' }} ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '2rem',
                    background: isOpen ? '#f1f5f9' : 'transparent',
                    border: '1px solid ' + (isOpen ? '#e2e8f0' : 'transparent'),
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                    if (!isOpen) e.currentTarget.style.background = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                    if (!isOpen) e.currentTarget.style.background = 'transparent';
                }}
            >
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: user?.role === 'admin' ? 'var(--primary)' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <User size={18} />
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                    {user?.username || 'Guest'}
                </span>
                <ChevronDown size={14} color="#64748b" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    width: '200px',
                    background: 'white',
                    borderRadius: '1rem',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    padding: '0.5rem',
                    zIndex: 200,
                    animation: 'fadeIn 0.2s ease'
                }}>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.5rem' }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                            {user?.username || 'Guest'}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            {user?.email || (user?.role === 'admin' ? 'admin@ichibot.id' : 'guest@ichibot.id')}
                        </p>
                    </div>

                    {user && (
                        <Link
                            href="/dashboard"
                            onClick={() => setIsOpen(false)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.6rem 1rem',
                                borderRadius: '0.5rem',
                                color: '#475569',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                textAlign: 'left',
                                textDecoration: 'none'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <LayoutDashboard size={16} />
                            Dashboard
                        </Link>
                    )}

                    <Link
                        href="/dashboard/profile"
                        onClick={() => setIsOpen(false)}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.6rem 1rem',
                            borderRadius: '0.5rem',
                            color: '#475569',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            textAlign: 'left',
                            textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <Settings size={16} />
                        Edit Profil
                    </Link>

                    <form action={logout}>
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.6rem 1rem',
                                borderRadius: '0.5rem',
                                color: '#ef4444',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                textAlign: 'left'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
