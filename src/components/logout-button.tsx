"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export default function LogoutButton() {
    return (
        <form action={logout}>
            <button
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    color: 'var(--destructive)',
                    transition: 'background 0.2s',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
                <LogOut size={20} />
                <span style={{ fontWeight: 500 }}>Logout</span>
            </button>
        </form>
    );
}
