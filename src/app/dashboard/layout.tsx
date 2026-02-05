"use client";

import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    Bell,
    ChevronDown,
    Calendar,
    LogOut,
    PanelLeftClose,
    PanelLeft
} from "lucide-react";
import AdminNavLink from "@/components/admin-nav-link";
import { useEffect, useState } from "react";
import { getSession, logout } from "@/app/actions/auth";
import Image from "next/image";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [currentTime, setCurrentTime] = useState("");
    const [user, setUser] = useState<any>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

            const dayName = days[now.getDay()];
            const day = now.getDate();
            const month = months[now.getMonth()];
            const year = now.getFullYear();
            const time = now.toLocaleTimeString('id-ID', { hour12: false });

            setCurrentTime(`${dayName}, ${day} ${month} ${year}, ${time}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        async function fetchSession() {
            const session = await getSession();
            setUser(session);
        }
        fetchSession();
    }, []);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            {/* Sidebar */}
            <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="admin-sidebar-header">
                    {!isCollapsed && (
                        <div style={{ position: 'relative', width: '120px', height: '32px' }}>
                            <Image
                                src="/ichibot-logo.png"
                                alt="ICHIBOT"
                                fill
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        style={{
                            color: '#64748b',
                            padding: '0.4rem',
                            borderRadius: '0.4rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        title={isCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
                    >
                        {isCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
                    </button>
                </div>

                <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                    <AdminNavLink href="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />

                    <div className="admin-sidebar-divider" />
                    <div className="admin-sidebar-category">Barang</div>
                    <AdminNavLink href="/dashboard/products" icon={<Package size={20} />} label="Product" />
                    <AdminNavLink href="/dashboard/orders" icon={<ShoppingCart size={20} />} label="Order" />

                    {user?.role === 'admin' && (
                        <>
                            <div className="admin-sidebar-divider" />
                            <div className="admin-sidebar-category">Admin</div>
                            <AdminNavLink href="/dashboard/users" icon={<Users size={20} />} label="User" />
                            <AdminNavLink href="/dashboard/setting" icon={<Settings size={20} />} label="Setting" />
                        </>
                    )}
                </div>

                <div style={{ marginTop: 'auto', padding: '1rem 0', borderTop: '1px solid #f1f5f9' }}>
                    <form action={logout}>
                        <button
                            type="submit"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: isCollapsed ? '0' : '0.75rem',
                                color: '#ef4444',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                padding: isCollapsed ? '0.8rem 0' : '0.75rem 1.25rem',
                                margin: '0.15rem 0.75rem',
                                borderRadius: '0.5rem',
                                width: isCollapsed ? 'auto' : 'calc(100% - 1.5rem)',
                                transition: 'all 0.2s',
                                justifyContent: isCollapsed ? 'center' : 'flex-start'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <LogOut size={18} />
                            {!isCollapsed && <span>Logout</span>}
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Top Bar / Header */}
                <header className="admin-top-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
                        <Calendar size={16} />
                        <span>{currentTime}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'right', borderRight: '1px solid #f1f5f9', paddingRight: '1.5rem' }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{user?.username || 'Guest'}</p>
                            <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                                {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                            </p>
                        </div>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: '#eef2ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#2563eb',
                            fontWeight: 700,
                            fontSize: '0.9rem'
                        }}>
                            {user?.username?.charAt(0).toUpperCase() || 'A'}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="admin-content-area">
                    {children}
                </main>
            </div>
        </div>
    );
}
