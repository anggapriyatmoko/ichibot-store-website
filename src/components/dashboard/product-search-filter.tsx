"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

export default function ProductSearchFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [perPage, setPerPage] = useState(searchParams.get("per_page") || "10");

    useEffect(() => {
        setSearchTerm(searchParams.get("search") || "");
        setPerPage(searchParams.get("per_page") || "10");
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updatePath(searchTerm, perPage);
    };

    const updatePath = (search: string, limit: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (search.trim()) {
            params.set("search", search.trim());
        } else {
            params.delete("search");
        }

        if (limit !== "10") {
            params.set("per_page", limit);
        } else {
            params.delete("per_page");
        }

        params.delete("page"); // Reset page when filtering
        router.push(`/dashboard/products?${params.toString()}`);
    };

    const clearSearch = () => {
        setSearchTerm("");
        updatePath("", perPage);
    };

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
            <form onSubmit={handleSearch} style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                <input
                    type="text"
                    placeholder="Cari nama produk atau SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.65rem 3rem 0.65rem 2.75rem',
                        borderRadius: '0.75rem',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        color: '#1e293b',
                        fontSize: '0.9rem',
                        outline: 'none',
                    }}
                />
                <Search style={{ position: 'absolute', left: '0.85rem', top: '0.75rem', color: '#94a3b8' }} size={18} />

                {searchTerm && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        style={{
                            position: 'absolute',
                            right: '0.85rem',
                            top: '0.75rem',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                        }}
                    >
                        <X size={18} />
                    </button>
                )}
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>Tampilkan:</span>
                <select
                    value={perPage}
                    onChange={(e) => {
                        setPerPage(e.target.value);
                        updatePath(searchTerm, e.target.value);
                    }}
                    style={{
                        padding: '0.6rem 2rem 0.6rem 1rem',
                        borderRadius: '0.75rem',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.9rem',
                        color: '#1e293b',
                        fontWeight: 600,
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23a0aec0\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.7rem center',
                        backgroundSize: '1rem'
                    }}
                >
                    <option value="10">10 Produk</option>
                    <option value="50">50 Produk</option>
                    <option value="100">100 Produk</option>
                </select>
            </div>
        </div>
    );
}
