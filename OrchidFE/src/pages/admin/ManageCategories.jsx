import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../api/apiService';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import CategoryForm from './CategoryForm'; // Import form component
import Swal from 'sweetalert2';

export default function ManageCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiService.get('/api/v1/categories');
            const sorted = response.data.sort((a, b) => a.categoryId - b.categoryId);
        setCategories(sorted);
            setError(null);
        } catch (err) {
            setError("Failed to fetch categories.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);
    
    const handleAddNew = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

       const handleDelete = async (categoryId) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This may affect existing orchids.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
        try {
            await apiService.delete(`/api/v1/categories/${categoryId}`);
            toast.success('Category deleted successfully!');
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete the category.');
            console.error(err);
        }
    }
};

    if (loading) return <div className="text-center p-8 font-semibold">Loading Categories...</div>;
    if (error) return <div className="text-center p-8 text-red-500 bg-red-50 rounded-lg">{error}</div>;

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manage Categories</h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add New Category
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((category) => (
                            <tr key={category.categoryId}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.categoryId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.categoryName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-4">
                                        <button onClick={() => handleEdit(category)} className="text-blue-600 hover:text-blue-900" title="Edit">
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleDelete(category.categoryId)} className="text-red-600 hover:text-red-900" title="Delete">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <CategoryForm
                    category={selectedCategory}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => { setIsModalOpen(false); fetchCategories(); }}
                />
            )}
        </div>
    );
}
