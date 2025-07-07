import React, { useState, useEffect } from 'react';
import apiService from '../../api/apiService';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal'; // Import Modal component

export default function AccountForm({ account, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'ROLE_USER',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const isEditMode = account !== null;

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                username: account.accountName || '',
                email: account.email || '',
                password: '', // Luôn để trống khi edit
                role: account.role || 'ROLE_USER',
            });
        }
    }, [account, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            if (isEditMode) {
                const updateData = {
                    accountName: formData.username,
                    email: formData.email,
                    role: formData.role,
                };
                await apiService.put(`/accounts/${account.accountId}`, updateData);
                toast.success('Account updated successfully!');
            } else {
                const createData = {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                };
                await apiService.post('/accounts/create', createData);
                toast.success('Account created successfully!');
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || 'An error occurred.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal onClose={onClose}>
            {/* Toàn bộ nội dung form giờ nằm trong Modal */}
            <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Account' : 'Add New Account'}</h2>
            
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4 text-sm">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" className="w-full p-3 border rounded-md" required />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-3 border rounded-md" required />
                
                {!isEditMode && (
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full p-3 border rounded-md" required />
                )}
                
                {isEditMode && (
                     <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                        <select name="role" id="role" value={formData.role} onChange={handleChange} className="w-full mt-1 p-3 border rounded-md">
                            <option value="ROLE_USER">USER</option>
                            <option value="ROLE_ADMIN">ADMIN</option>
                        </select>
                    </div>
                )}

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onClose} className="py-2 px-6 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="py-2 px-6 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-300">
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
