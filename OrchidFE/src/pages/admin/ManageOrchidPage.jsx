import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../api/apiService';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import OrchidForm from './OrchidForm';
import toast from 'react-hot-toast'; // Thêm toast để có thông báo đẹp hơn

export default function ManageOrchidPage() {
    const [orchids, setOrchids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrchid, setSelectedOrchid] = useState(null);

    const fetchOrchids = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiService.get('/api/v1/orchids');
            setOrchids(response.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch orchids. Please try again later.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrchids();
    }, [fetchOrchids]);

    const handleAddNew = () => {
        setSelectedOrchid(null);
        setIsModalOpen(true);
    };

    const handleEdit = (orchid) => {
        setSelectedOrchid(orchid);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this orchid?')) {
            try {
                await apiService.delete(`/api/v1/orchids/${id}`);
                toast.success('Orchid deleted successfully!');
                fetchOrchids(); // Tải lại danh sách
            } catch (err) {
                toast.error('Failed to delete the orchid.');
                console.error(err);
            }
        }
    };
    
    const handleFormSuccess = () => {
        setIsModalOpen(false);
        fetchOrchids();
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

    return (
        <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Manage Orchids</h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add New Orchid
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                        <tr>
                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Is Natural</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orchids.map((orchid) => (
                            <tr key={orchid.id} className="border-b hover:bg-gray-50">
                                <td className="p-4"><img src={orchid.orchidUrl} alt={orchid.name} className="h-16 w-16 object-cover rounded-md" /></td>
                                <td className="p-4 font-medium text-gray-800">{orchid.name}</td>
                                {/* === SỬA LẠI Ở ĐÂY === */}
                                <td className="p-4">{orchid.natural ? 'Yes' : 'No'}</td>
                                <td className="p-4">{formatPrice(orchid.price)}</td>
                                <td className="p-4">
                                    <div className="flex gap-4">
                                        <button onClick={() => handleEdit(orchid)} className="text-blue-500 hover:text-blue-700"><PencilIcon className="h-5 w-5" /></button>
                                        <button onClick={() => handleDelete(orchid.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {isModalOpen && (
                <OrchidForm 
                    orchid={selectedOrchid} 
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={handleFormSuccess} 
                />
            )}
        </div>
    );
}