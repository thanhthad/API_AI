import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

interface RegisterApiResponse {
  message: string;
  success?: boolean;
}

interface LoginApiResponse {
  userId: number;
  username: string;
  message: string;
  success: boolean;
}

const AuthForm: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;

  const { login } = useAuth();
  const navigate = useNavigate();

  const titleRef = useRef<HTMLHeadingElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(titleRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    }
    if (toggleButtonRef.current) {
      gsap.fromTo(toggleButtonRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 0.3 });
    }
    if (message && messageRef.current) {
      gsap.fromTo(messageRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    }
  }, [isRegister, message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const url = isRegister
      ? `${baseUrl}/api/auth/register`
      : `${baseUrl}/api/auth/login`;

    const body = isRegister
      ? JSON.stringify({ username, password, email })
      : JSON.stringify({ username, password });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });

      const data: RegisterApiResponse | LoginApiResponse = await response.json();

      if (response.ok) {
        if (!isRegister) {
          const loginData = data as LoginApiResponse;
          if (loginData.success) {
            login(loginData.userId, loginData.username);
            setMessage(loginData.message);
            navigate('/analyze'); // ✅ dùng điều hướng React SPA
          } else {
            setMessage(loginData.message || 'Đăng nhập thất bại.');
          }
        } else {
          const registerData = data as RegisterApiResponse;
          setMessage(registerData.message + '. Vui lòng đăng nhập.');
          setIsRegister(false);
        }
      } else {
        const errorData = data as RegisterApiResponse | LoginApiResponse;
        setMessage(errorData.message || 'Có lỗi xảy ra trên máy chủ.');
      }
    } catch (error: any) {
      console.error("Lỗi mạng hoặc phân tích JSON:", error);
      setMessage(`Lỗi kết nối hoặc phản hồi không hợp lệ từ máy chủ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
        <h2 ref={titleRef} className="text-3xl sm:text-4xl font-extrabold text-center text-blue-700 mb-8">
          {isRegister ? 'Tạo tài khoản mới' : 'Chào mừng trở lại!'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Tên người dùng:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập tên người dùng"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Mật khẩu:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập mật khẩu của bạn"
              required
            />
          </div>

          {!isRegister && (
            <div className="text-right text-sm">
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Nhập địa chỉ email của bạn"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : isRegister ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </form>

        {message && (
          <p ref={messageRef} className={`mt-6 text-center font-medium ${message.includes('thành công') || message.includes('Vui lòng đăng nhập') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        <p className="mt-8 text-center text-sm text-gray-600">
          {isRegister ? 'Bạn đã có tài khoản?' : 'Bạn chưa có tài khoản?'}{' '}
          <button
            ref={toggleButtonRef}
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage('');
              setUsername('');
              setPassword('');
              setEmail('');
            }}
            className="text-blue-600 hover:underline font-bold focus:outline-none"
          >
            {isRegister ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
