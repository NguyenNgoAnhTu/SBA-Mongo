import React, { useState, useEffect } from 'react';
import apiService from '../../api/apiService';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal'; // Import Modal component

export default function CategoryForm({ category, onClose, onSuccess }) {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const isEditMode = category !== null;

    useEffect(() => {
        if (isEditMode) {
            setName(category.categoryName || '');
        }
    }, [category, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const requestData = { name };

        try {
            if (isEditMode) {
                await apiService.put(`/api/v1/categories/${category.categoryId}`, requestData);
                toast.success('Category updated successfully!');
            } else {
                await apiService.post('/api/v1/categories', requestData);
                toast.success('Category created successfully!');
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Bọc toàn bộ form trong component Modal
    return (
    <Modal onClose={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-md mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-center">
                    {isEditMode ? '✏️ Edit Category' : '➕ Add New Category'}
                </h2>
                <p className="text-indigo-100 text-center text-sm mt-1">
                    {isEditMode ? 'Update orchid category name' : 'Create a new orchid category'}
                </p>
            </div>

            {/* Form Content */}
            <div className="p-6">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                        <div className="flex items-center">
                            <span className="text-red-500 mr-2">⚠️</span>
                            <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Category Name Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            🌸 Category Name
                        </label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="e.g., Vanda Orchid" 
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none" 
                            required 
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-6">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 border border-gray-200"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            {isSubmitting ? 'Saving...' : '💾 Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </Modal>
);
}