"use client";

import { Settings as SettingsIcon, Bell, Shield, Key } from "lucide-react";

export default function SettingsPage() {
    return (
        <div style={{ padding: '0 1rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>Settings</h1>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Manage your application preferences</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="admin-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: '#eef2ff', borderRadius: '0.5rem', color: 'var(--primary)' }}>
                            <SettingsIcon size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>General</h3>
                            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Basic application settings</p>
                        </div>
                    </div>
                </div>

                <div className="admin-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: '#f0fdf4', borderRadius: '0.5rem', color: '#15803d' }}>
                            <Bell size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Notifications</h3>
                            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Manage alerts and emails</p>
                        </div>
                    </div>
                </div>

                <div className="admin-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: '#fef2f2', borderRadius: '0.5rem', color: '#b91c1c' }}>
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>Security</h3>
                            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>2FA and login sessions</p>
                        </div>
                    </div>
                </div>

                <div className="admin-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: '#fff7ed', borderRadius: '0.5rem', color: '#c2410c' }}>
                            <Key size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>API Keys</h3>
                            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Manage API access tokens</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
