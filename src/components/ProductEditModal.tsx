'use client';

import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Sparkles } from 'lucide-react';

interface ProductEditModalProps {
  product?: any;
  onClose: () => void;
  onSave: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function ProductEditModal({
  product,
  onClose,
  onSave,
  onShowToast,
}: ProductEditModalProps) {
  const isEditing = !!product?.id;

  const [nameEn, setNameEn] = useState(product?.nameEn || 'Gemini AI Pro');
  const [nameAm, setNameAm] = useState(product?.nameAm || 'Gemini AI Pro');
  const [descEn, setDescEn] = useState(
    product?.descEn || 'Official Google AI Pro activation with 2M token context window.'
  );
  const [descAm, setDescAm] = useState(
    product?.descAm || 'ይፋዊ የ Google AI Pro አክቲቬሽን ለስራ እና ለፈጠራ አገልግሎት።'
  );
  const [duration, setDuration] = useState(product?.duration || '1 Month');
  const [durationAm, setDurationAm] = useState(product?.durationAm || '1 ወር');
  const [priceETB, setPriceETB] = useState<number>(product?.priceETB || 300);
  const [badge, setBadge] = useState(product?.badge || '');
  const [isActive, setIsActive] = useState(product?.isActive !== false);

  // Features list
  let initialFeaturesEn: string[] = ['Gemini AI access', 'Activation link delivery', 'Telegram delivery', 'Customer support', 'Simple ETB payment'];
  let initialFeaturesAm: string[] = ['የ Gemini AI ሙሉ አጠቃቀም', 'የአክቲቬሽን ሊንክ ማድረሻ', 'የቴሌግራም ፈጣን ማድረሻ', 'የደንበኞች ድጋፍ', 'ቀላል የኢትዮጵያ ብር ክፍያ'];

  if (product?.featuresEn) {
    try {
      initialFeaturesEn = typeof product.featuresEn === 'string' ? JSON.parse(product.featuresEn) : product.featuresEn;
    } catch (e) {}
  }
  if (product?.featuresAm) {
    try {
      initialFeaturesAm = typeof product.featuresAm === 'string' ? JSON.parse(product.featuresAm) : product.featuresAm;
    } catch (e) {}
  }

  const [featuresEn, setFeaturesEn] = useState<string[]>(initialFeaturesEn);
  const [featuresAm, setFeaturesAm] = useState<string[]>(initialFeaturesAm);
  const [loading, setLoading] = useState(false);

  const handleAddFeature = () => {
    setFeaturesEn([...featuresEn, 'New Feature']);
    setFeaturesAm([...featuresAm, 'አዲስ አገልግሎት']);
  };

  const handleRemoveFeature = (index: number) => {
    setFeaturesEn(featuresEn.filter((_, i) => i !== index));
    setFeaturesAm(featuresAm.filter((_, i) => i !== index));
  };

  const handleUpdateFeature = (index: number, valEn: string, valAm: string) => {
    const updatedEn = [...featuresEn];
    updatedEn[index] = valEn;
    setFeaturesEn(updatedEn);

    const updatedAm = [...featuresAm];
    updatedAm[index] = valAm;
    setFeaturesAm(updatedAm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn || !nameAm || priceETB <= 0) {
      onShowToast('Please fill in product name and valid ETB price', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nameEn,
        nameAm,
        descEn,
        descAm,
        duration,
        durationAm,
        priceETB: Number(priceETB),
        badge: badge.trim() || null,
        isActive,
        featuresEn: JSON.stringify(featuresEn.filter(Boolean)),
        featuresAm: JSON.stringify(featuresAm.filter(Boolean)),
      };

      const url = isEditing ? `/api/products/${product.id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product');

      onShowToast(isEditing ? 'Product updated successfully!' : 'Product created successfully!', 'success');
      onSave();
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-slide-up my-8">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-google-blue" />
            <h2 className="font-bold text-base text-gray-900">
              {isEditing ? 'Edit Subscription Plan' : 'Create New Subscription'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* English & Amharic Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Product Name (English)</label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">የምርት ስም (አማርኛ)</label>
              <input
                type="text"
                value={nameAm}
                onChange={(e) => setNameAm(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue"
              />
            </div>
          </div>

          {/* Price ETB & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Price in ETB</label>
              <input
                type="number"
                value={priceETB}
                onChange={(e) => setPriceETB(Number(e.target.value))}
                required
                min={1}
                step="any"
                className="w-full px-3.5 py-2 text-xs font-bold text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Duration (EN)</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="1 Month"
                required
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">የቆይታ ጊዜ (አማርኛ)</label>
              <input
                type="text"
                value={durationAm}
                onChange={(e) => setDurationAm(e.target.value)}
                placeholder="1 ወር"
                required
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue"
              />
            </div>
          </div>

          {/* Badge & Active Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Badge (Optional)</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Popular / Best Value"
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-google-blue rounded focus:ring-google-blue"
              />
              <label htmlFor="isActive" className="text-xs font-bold text-gray-800 cursor-pointer">
                Product is Active & Visible in Store
              </label>
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Description (English)</label>
              <textarea
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">መግለጫ (አማርኛ)</label>
              <textarea
                value={descAm}
                onChange={(e) => setDescAm(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-google-blue"
              />
            </div>
          </div>

          {/* Features Editor */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Plan Features Checklist (EN / AM)
              </span>
              <button
                type="button"
                onClick={handleAddFeature}
                className="inline-flex items-center gap-1 text-xs font-bold text-google-blue hover:text-google-blue-hover"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Feature</span>
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {featuresEn.map((fEn, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={fEn}
                    onChange={(e) => handleUpdateFeature(idx, e.target.value, featuresAm[idx] || '')}
                    placeholder="Feature in English"
                    className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={featuresAm[idx] || ''}
                    onChange={(e) => handleUpdateFeature(idx, fEn, e.target.value)}
                    placeholder="አገልግሎት በአማርኛ"
                    className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-google-blue hover:bg-google-blue-hover text-white text-xs font-bold rounded-xl shadow-google-sm transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Subscription'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
