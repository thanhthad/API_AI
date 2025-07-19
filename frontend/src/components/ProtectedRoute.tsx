import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();

  // Nếu người dùng chưa đăng nhập (userId là null), chuyển hướng về trang đăng nhập
  if (!user.userId) {
    return <Navigate to="/auth" replace />;
  }

  // Nếu đã đăng nhập, hiển thị nội dung của route con
  return <Outlet />;
};

export default ProtectedRoute;