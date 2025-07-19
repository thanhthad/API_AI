import React, { createContext, useState, useContext, ReactNode } from 'react';

// Định nghĩa kiểu dữ liệu cho người dùng đã đăng nhập
interface AuthUser {
  userId: number | null;
  username: string | null;
}

// Định nghĩa kiểu dữ liệu cho AuthContext
interface AuthContextType {
  user: AuthUser;
  login: (userId: number, username: string) => void;
  logout: () => void;
}

// Tạo AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props cho AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Component Provider cung cấp AuthContext cho các con
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Lấy trạng thái từ localStorage khi khởi tạo
  const [user, setUser] = useState<AuthUser>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : { userId: null, username: null };
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return { userId: null, username: null };
    }
  });

  // Hàm đăng nhập
  const login = (userId: number, username: string) => {
    const newUser = { userId, username };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser)); // Lưu vào localStorage
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser({ userId: null, username: null });
    localStorage.removeItem('user'); // Xóa khỏi localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};