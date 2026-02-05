"use client";

import { useState, useEffect } from "react";
import { getUsers, addUser, deleteUser, updateUser } from "@/app/actions/user-management";
import { Trash2, UserPlus, Search, User, Edit2, Loader2, Eye, EyeOff } from "lucide-react";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showModal]);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        const data = await getUsers();
        setUsers(data);
        setLoading(false);
    }

    async function handleFormSubmit(formData: FormData) {
        setSubmitting(true);
        let res;
        if (editingUser) {
            res = await updateUser(editingUser.id, formData);
        } else {
            res = await addUser(formData);
        }
        setSubmitting(false);
        if (res.success) {
            setShowModal(false);
            setEditingUser(null);
            loadUsers();
        } else {
            alert(res.error);
        }
    }

    function handleEdit(user: any) {
        setEditingUser(user);
        setShowModal(true);
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
                    onClick={() => {
                        setEditingUser(null);
                        setShowModal(true);
                    }}
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
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div className="animate-shimmer" style={{ width: '32px', height: '32px', borderRadius: '50%' }}></div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                    <div className="animate-shimmer" style={{ width: '120px', height: '0.8rem', borderRadius: '0.2rem' }}></div>
                                                    <div className="animate-shimmer" style={{ width: '80px', height: '0.6rem', borderRadius: '0.2rem' }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div className="animate-shimmer" style={{ width: '60px', height: '1.2rem', borderRadius: '1rem' }}></div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div className="animate-shimmer" style={{ width: '150px', height: '0.8rem', borderRadius: '0.2rem' }}></div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div className="animate-shimmer" style={{ width: '32px', height: '32px', borderRadius: '0.5rem', marginLeft: 'auto' }}></div>
                                        </td>
                                    </tr>
                                ))
                            ) :
                                users.map((user) => (
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
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    style={{
                                                        padding: '0.4rem',
                                                        borderRadius: '0.4rem',
                                                        color: 'var(--primary)',
                                                        background: '#eef2ff',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                {user.username !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        style={{
                                                            padding: '0.4rem',
                                                            borderRadius: '0.4rem',
                                                            color: '#ef4444',
                                                            background: '#fef2f2',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
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
                    background: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(8px)',
                    padding: '1rem'
                }} onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setShowModal(false);
                        setEditingUser(null);
                    }
                }}>
                    <div className="animate-slide-up" style={{
                        background: 'white',
                        width: '100%',
                        maxWidth: '450px',
                        maxHeight: '90vh',
                        borderRadius: '1.25rem',
                        padding: '2rem',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        overflowY: 'auto'
                    }} onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1e293b' }}>
                            {editingUser ? 'Edit User' : 'Add New User'}
                        </h3>
                        <form action={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Username</label>
                                <input
                                    name="username"
                                    required
                                    placeholder="johndoe"
                                    defaultValue={editingUser?.username}
                                    disabled={!!editingUser}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', background: editingUser ? '#f8fafc' : 'white' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                                <input
                                    name="displayName"
                                    required
                                    placeholder="John Doe"
                                    defaultValue={editingUser?.displayName}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="john@ichibot.id"
                                    defaultValue={editingUser?.email}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Role</label>
                                <select
                                    name="role"
                                    defaultValue={editingUser?.role || 'user'}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', background: 'white' }}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>
                                    {editingUser ? 'New Password (Optional)' : 'Password'}
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required={!editingUser}
                                        placeholder={editingUser ? 'Leave blank to keep current' : '••••••••'}
                                        style={{ width: '100%', padding: '0.75rem', paddingRight: '2.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none' }}
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
                                            right: '0.75rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: '#94a3b8',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>
                                    {editingUser ? 'New PIN (Optional)' : 'PIN (6 Digit)'}
                                </label>
                                <input
                                    name="pin"
                                    type="text"
                                    maxLength={6}
                                    placeholder={editingUser ? 'Leave blank to keep current' : '123456'}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none' }}
                                    onChange={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingUser(null);
                                    }}
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 600, color: '#64748b', background: '#f1f5f9' }}
                                >
                                    Cancel
                                </button>
                                <button disabled={submitting} type="submit" style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 600, color: 'white', background: 'var(--primary)' }}>
                                    {submitting ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
