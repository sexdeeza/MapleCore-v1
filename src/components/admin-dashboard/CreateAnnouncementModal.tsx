// src/components/admin-dashboard/CreateAnnouncementModal.tsx
'use client';

import React from 'react';
import { 
  X, Plus, Send, Sparkles, Zap, Settings
} from 'lucide-react';

interface FormData {
  type: 'event' | 'update' | 'maintenance';
  title: string;
  description: string;
  priority: number;
}

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isSubmitting
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-red-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create Announcement</h2>
                <p className="text-sm text-gray-600">Notify your community about important updates</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={onSubmit} className="p-6">
          {/* Announcement Type */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Announcement Type
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'event', label: 'Event', icon: Sparkles, color: 'from-purple-500 to-purple-600', bgColor: 'purple-50', borderColor: 'purple-500' },
                { value: 'update', label: 'Update', icon: Zap, color: 'from-blue-500 to-blue-600', bgColor: 'blue-50', borderColor: 'blue-500' },
                { value: 'maintenance', label: 'Maintenance', icon: Settings, color: 'from-orange-500 to-orange-600', bgColor: 'orange-50', borderColor: 'orange-500' }
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value as any })}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.type === type.value
                      ? `border-${type.borderColor} bg-${type.bgColor} scale-105 shadow-lg`
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <type.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className={`font-bold ${
                    formData.type === type.value ? `text-${type.borderColor.split('-')[0]}-700` : 'text-gray-700'
                  }`}>
                    {type.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="e.g., Double EXP Weekend Event!"
              maxLength={255}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
              placeholder="Provide details about the announcement..."
              rows={4}
              required
            />
          </div>

          {/* Priority */}
          <div className="mb-6">
            <label htmlFor="priority" className="block text-sm font-bold text-gray-700 mb-2">
              Priority (Optional)
            </label>
            <input
              type="number"
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="0"
              min="0"
              max="999"
            />
            <p className="text-xs text-gray-500 mt-1">Higher priority announcements appear first</p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Create Announcement
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAnnouncementModal;