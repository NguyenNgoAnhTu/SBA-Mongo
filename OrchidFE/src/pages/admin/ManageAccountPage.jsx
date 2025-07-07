import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../api/apiService';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2'; // Import SweetAlert2
import AccountForm from './AccountForm'; // Import form component

export default function ManageAccounts() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const fetchAccounts = useCallback(async () => {
        try {
            setLoading(true);
            // SỬA LỖI: Thêm /api/v1/ vào trước đường dẫn
            const response = await apiService.get('/accounts');
            if (Array.isArray(response.data)) {
                setAccounts(response.data);
            } else {
                setAccounts([]);
            }
            setError(null);
        } catch (err) {
            setError("Failed to fetch accounts.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    const handleAddNew = () => {
        setSelectedAccount(null);
        setIsModalOpen(true);
    };

    const handleEdit = (account) => {
        setSelectedAccount(account);
        setIsModalOpen(true);
    };

    const handleDelete = (accountId) => {
        // THAY THẾ: Dùng SweetAlert2 thay cho window.confirm
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // SỬA LỖI: Thêm /api/v1/ vào trước đường dẫn
                    await apiService.delete(`/accounts/${accountId}`);
                    Swal.fire(
                        'Deleted!',
                        'The account has been deleted.',
                        'success'
                    );
                    fetchAccounts(); // Tải lại danh sách
                } catch (err) {
                    Swal.fire(
                        'Error!',
                        'Failed to delete the account.',
                        'error'
                    );
                    console.error(err);
                }
            }
        });
    };

    if (loading) return <div className="text-center p-8 font-semibold">Loading Accounts...</div>;
    if (error) return <div className="text-center p-8 text-red-500 bg-red-50 rounded-lg">{error}</div>;

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manage Accounts</h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add New Account
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {accounts.map((account) => (
                            <tr key={account.email}>
                                {/* SỬA LỖI: Dùng account.accountName từ response */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{account.accountName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        account.role === 'ROLE_ADMIN' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                        {account.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-4">
                                        <button onClick={() => handleEdit(account)} className="text-blue-600 hover:text-blue-900"><PencilIcon className="h-5 w-5" /></button>
                                        {/* SỬA LỖI: Dùng account.accountId */}
                                        <button onClick={() => handleDelete(account.accountId)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <AccountForm
                    account={selectedAccount}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => { setIsModalOpen(false); fetchAccounts(); }}
                />
            )}
        </div>
    );
}
