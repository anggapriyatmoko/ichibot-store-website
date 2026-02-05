"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminNavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    const pathname = usePathname();
    const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

    return (
        <Link
            href={href}
            className={`admin-nav-item ${isActive ? 'active' : ''}`}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}
