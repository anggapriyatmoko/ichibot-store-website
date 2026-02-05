"use client";

import { useState, useEffect } from "react";
import { getUsers, addUser, deleteUser } from "@/app/actions/user-management";
import { Trash2, UserPlus, Search, User } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        const data = await getUsers();
        setUsers(data);
        setLoading(false);
    }

    async function handleAddUser(formData: FormData) {
        setSubmitting(true);
        const res = await addUser(formData);
        setSubmitting(false);
        if (res.success) {
            setShowModal(false);
            loadUsers();
        } else {
            alert(res.error);
        }
    }

    async function handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this user?")) {
            await deleteUser(id);
            loadUsers();
        }
    }

    return (
        <div style={{ padding: '0 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>Users</h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Manage system users and access</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="admin-btn-primary"
                >
                    <UserPlus size={18} />
                    Add User
                </button>
            </div>

            <div className="admin-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <Search size={18} color="#94a3b8" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', color: '#1e293b' }}
                    />
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User</th>
                                <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</th>
                                <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</th>
                                <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}>
                                        <Loader2 className="animate-spin" style={{ margin: '0 auto', color: '#94a3b8' }} />
                                    </td>
                                </tr>
                            ) : users.map((user) => (
                                <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                background: user.role === 'admin' ? 'var(--primary)' : '#e2e8f0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: user.role === 'admin' ? 'white' : '#64748b'
                                            }}>
                                                <User size={16} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{user.displayName}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>@{user.username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '2rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            background: user.role === 'admin' ? '#eef2ff' : '#f1f5f9',
                                            color: user.role === 'admin' ? 'var(--primary)' : '#64748b'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#64748b' }}>{user.email}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        {user.username !== 'admin' && (
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                style={{
                                                    padding: '0.5rem',
                                                    borderRadius: '0.5rem',
                                                    color: '#ef4444',
                                                    background: '#fef2f2',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    backdropFilter: 'blur(4px)'
                }} onClick={(e) => {
                    if (e.target === e.currentTarget) setShowModal(false);
                }}>
                    <div style={{
                        background: 'white',
                        width: '100%',
                        maxWidth: '400px',
                        borderRadius: '1rem',
                        padding: '2rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1e293b' }}>Add New User</h3>
                        <form action={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Username</label>
                                <input name="username" required placeholder="johndoe" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                                <input name="displayName" required placeholder="John Doe" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Email</label>
                                <input name="email" type="email" required placeholder="john@ichibot.id" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Role</label>
                                <select name="role" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', background: 'white' }}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 600, color: '#64748b', background: '#f1f5f9' }}>Cancel</button>
                                <button disabled={submitting} type="submit" style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 600, color: 'white', background: 'var(--primary)' }}>
                                    {submitting ? 'Saving...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
