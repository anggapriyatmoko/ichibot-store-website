"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

export default function HeaderWrapper() {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/dashboard") || pathname === "/login";

    if (isDashboard) return null;

    return (
        <>
            <Header />
            <div style={{ padding: '0 2rem 0 2rem', maxWidth: '1300px', margin: '0 auto' }} />
        </>
    );
}
