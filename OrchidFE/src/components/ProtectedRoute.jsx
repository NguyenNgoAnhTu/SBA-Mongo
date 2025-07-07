import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Lấy token từ localStorage để kiểm tra trạng thái đăng nhập
  const token = localStorage.getItem('token');

  // Nếu không có token (chưa đăng nhập), chuyển hướng về trang login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có token (đã đăng nhập), hiển thị component con (trang được bảo vệ)
  return <Outlet />;
};

export default ProtectedRoute;