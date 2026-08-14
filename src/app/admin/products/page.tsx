'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import ProductEditModal from '@/components/ProductEditModal';
import Toast from '@/components/Toast';
import { formatETB } from '@/lib/utils';
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  CheckCircle2,
  XCircle,
  Layers,
  RefreshCw,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?all=true');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load products');
      setProducts(data.products || []);
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete product');

      setToast({ message: `"${name}" was deleted successfully`, type: 'success' });
      fetchProducts();
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  return (
    <div className="flex-1 space-y-6">
      <AdminHeader
        title="Subscription & Product Management"
        subtitle="Configure available AI subscriptions, adjust ETB prices, and add new digital plans."
      >
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-google-blue hover:bg-google-blue-hover text-white text-xs font-bold rounded-xl shadow-google-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subscription</span>
        </button>
      </AdminHeader>

      <div className="px-6 space-y-6 max-w-7xl">
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl p-6 border border-gray-200 shadow-google-sm hover:shadow-google-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {prod.duration} ({prod.durationAm})
                  </span>
                  {prod.isActive ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      <XCircle className="w-3 h-3" />
                      Inactive
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-lg text-gray-900 leading-snug">
                  {prod.nameEn}
                </h3>
                <span className="text-xs text-gray-500 block -mt-1 font-amharic">
                  {prod.nameAm}
                </span>

                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                  {prod.descEn}
                </p>

                <div className="py-2 border-y border-gray-100 flex items-baseline justify-between">
                  <span className="text-xs text-gray-500">Configured Price:</span>
                  <span className="font-display font-black text-2xl text-google-blue font-mono">
                    {formatETB(prod.priceETB)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  onClick={() => setEditingProduct(prod)}
                  className="p-2 text-gray-600 hover:text-google-blue hover:bg-blue-50 rounded-xl transition-colors"
                  title="Edit product"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(prod.id, prod.nameEn)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Delete product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal for Creating or Editing */}
      {(isCreating || editingProduct) && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => {
            setIsCreating(false);
            setEditingProduct(null);
          }}
          onSave={() => {
            setIsCreating(false);
            setEditingProduct(null);
            fetchProducts();
          }}
          onShowToast={(msg, type) => setToast({ message: msg, type: type || 'success' })}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
