import React, { useState, useEffect } from 'react';
import apiService from '../../api/apiService';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal'; // Import Modal component
import { PhotoIcon } from '@heroicons/react/24/solid';

export default function OrchidForm({ orchid, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        imageUrl: '',
        description: '',
        price: '',
        isNatural: false,
        categoryId: '',
    });
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    const isEditMode = orchid !== null;

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                name: orchid.name || '',
                imageUrl: orchid.orchidUrl || '', 
                description: orchid.orchidDecription || '',
                price: orchid.price || '',
                isNatural: orchid.natural || false,
                categoryId: categories.find(c => c.categoryName === orchid.categoryName)?.categoryId || ''
            });
            setImagePreview(orchid.orchidUrl || '');
        }
    }, [orchid, isEditMode, categories]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiService.get('/api/v1/categories');
                setCategories(response.data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const localImageUrl = URL.createObjectURL(file);
            setImagePreview(localImageUrl);
            // Chúng ta không lưu file vào state, chỉ dùng để xem trước
            // Đường dẫn thật sự sẽ được lưu vào formData.imageUrl
            setFormData(prev => ({ ...prev, imageUrl: '' })); // Xóa link URL cũ nếu có
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const requestData = {
            name: formData.name,
            imageUrl: formData.imageUrl,
            description: formData.description,
            price: parseFloat(formData.price),
            isNatural: formData.isNatural,
            categoryId: parseInt(formData.categoryId),
        };

        try {
            if (isEditMode) {
                await apiService.put(`/api/v1/orchids/${orchid.id}`, requestData);
                toast.success('Orchid updated successfully!');
            } else {
                await apiService.post('/api/v1/orchids', requestData);
                toast.success('Orchid added successfully!');
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal onClose={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl mx-auto max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white p-6">
                    <h2 className="text-3xl font-bold text-center">
                        {isEditMode ? '🌺 Edit Orchid' : '🌸 Add New Orchid'}
                    </h2>
                    <p className="text-pink-100 text-center text-sm mt-2">
                        {isEditMode ? 'Update orchid information' : 'Add a beautiful orchid to your collection'}
                    </p>
                </div>

                {/* Scrollable Content */}
<div className="overflow-y-auto max-h-[calc(80vh-180px)] p-6">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl">
                            <div className="flex items-center">
                                <span className="text-red-500 mr-2 text-lg">⚠️</span>
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Preview Section */}
                        {imagePreview && (
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="w-48 h-48 object-cover rounded-2xl shadow-lg border-4 border-pink-200"
                                    />
                                    <div className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full p-2">
                                        🌺
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form Fields Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Orchid Name */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-bold text-gray-700">
                                    🌸 Orchid Name
                                </label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    placeholder="Enter orchid name" 
                                    className="w-full p-4 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 outline-none" 
                                    required 
                                />
                            </div>

                            {/* Image URL */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-bold text-gray-700">
                                    📸 Image URL
                                </label>
                                <input 
                                    type="text" 
                                    name="imageUrl" 
                                    value={formData.imageUrl} 
                                    onChange={handleChange} 
                                    placeholder="/images/my-orchid.jpg" 
                                    className="w-full p-4 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 outline-none" 
                                />
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">
                                    💰 Price
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold"></span>
                                    <input 
                                        type="number" 
                                        name="price" 
                                        value={formData.price} 
                                        onChange={handleChange} 
                                        placeholder="0.00" 
                                        className="w-full pl-8 pr-4 py-4 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 outline-none" 
                                        required 
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">
                                    🏷️ Category
                                </label>
                                <select 
                                    name="categoryId" 
                                    value={formData.categoryId} 
                                    onChange={handleChange} 
                                    className="w-full p-4 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 outline-none bg-white" 
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.categoryId} value={cat.categoryId}>
                                            {cat.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700">
                                📝 Description
                            </label>
                            <textarea 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                placeholder="Describe this beautiful orchid..." 
                                rows="4" 
                                className="w-full p-4 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 outline-none resize-none" 
                                required 
                            />
                        </div>

                        {/* Natural Checkbox */}
                        <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                            <input 
                                type="checkbox" 
                                name="isNatural" 
                                id="isNatural"
                                checked={formData.isNatural} 
                                onChange={handleChange} 
                                className="h-5 w-5 rounded text-green-600 focus:ring-green-500 border-green-300" 
                            />
                            <label htmlFor="isNatural" className="ml-3 flex items-center cursor-pointer">
                                <span className="text-lg mr-2">🌿</span>
                                <span className="text-sm font-semibold text-green-800">
                                    This is a natural orchid
                                </span>
                            </label>
                        </div>
                    </form>
                </div>

                {/* Sticky Footer with Buttons */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex-1 py-3 px-6 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200 border-2 border-gray-200"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            onClick={handleSubmit}
                            disabled={isSubmitting} 
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:via-purple-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : (
                                <span>🌸 Save Orchid</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}