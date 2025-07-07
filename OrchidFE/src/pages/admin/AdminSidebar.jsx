import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    ChartBarIcon,
    ShoppingBagIcon,
    UsersIcon,
    TagIcon,
    CogIcon,
    ArrowLeftOnRectangleIcon // <<--- 1. Import icon cho nút Logout
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

const navigation = [
    { name: 'Overview', href: '/admin/overview', icon: ChartBarIcon },
    { name: 'Manage Orders', href: '/admin/orders', icon: ShoppingBagIcon },
    { name: 'Manage Orchids', href: '/admin/orchids', icon: CogIcon },
    { name: 'Manage Accounts', href: '/admin/accounts', icon: UsersIcon },
    { name: 'Manage Categories', href: '/admin/categories', icon: TagIcon },
];

export default function AdminSidebar() {
    const navigate = useNavigate(); // Dùng để chuyển hướng sau khi logout

    // --- 2. Thêm hàm xử lý đăng xuất ---
    const handleLogout = async () => {
    const result = await Swal.fire({
        title: 'Confirm Logout',
        text: "Are you sure you want to log out?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event('storage'));
        navigate("/login");
    }
};

    return (
        <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 shadow-md">
            <div className="h-full flex flex-col p-4">
                <div className="text-2xl font-bold text-indigo-600 mb-8 p-2 flex items-center gap-2">
                    <span className="text-3xl">🌸</span>
                    <span>Admin Panel</span>
                </div>
                
                {/* Các link điều hướng chính */}
                <nav className="flex-1 space-y-2">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                isActive ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`
                            }
                        >
                            <item.icon className="h-6 w-6 mr-3" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
                
                {/* --- 3. Thêm khu vực Logout ở dưới cùng --- */}
                <div className="mt-auto pt-4 border-t border-gray-200">
                     <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    >
                        <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-3" />
                        Log Out
                    </button>
                </div>
            </div>
        </aside>
    );
}
