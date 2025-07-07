import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const token = localStorage.getItem('token');
    let userRole = null;

    try {
        const user = JSON.parse(localStorage.getItem('user'));
        userRole = user?.role || null;
    } catch (e) {
        console.error("Could not parse user data from localStorage");
    }

    // Nếu không có token hoặc vai trò không phải ADMIN, chuyển hướng về trang chủ
    if (!token || userRole !== 'ROLE_ADMIN') {
        return <Navigate to="/home" />;
    }

    // Nếu đúng là admin, cho phép truy cập
    return <Outlet />;
};

export default AdminRoute;