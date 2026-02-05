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
import Link from "next/link";
import ProfileMenu from "@/components/profile-menu";

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
                        <Link href="/" style={{ position: 'relative', width: '120px', height: '32px', display: 'block' }}>
                            <Image
                                src="/ichibot-logo.png"
                                alt="ICHIBOT"
                                fill
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                        </Link>
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

            </aside>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Top Bar / Header */}
                <header className="admin-top-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
                        <Calendar size={16} />
                        <span>{currentTime}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '2rem' }}>
                            <Bell size={18} color="#64748b" />
                        </div>
                        <ProfileMenu user={user} />
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
