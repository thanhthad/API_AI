// src/pages/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Để quay lại trang đăng nhập

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading để vô hiệu hóa nút/input

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(''); // Reset thông báo cũ
    setIsSuccess(false);
    setIsLoading(true); // Bắt đầu trạng thái loading

    if (!email) {
      setStatusMessage('Vui lòng nhập địa chỉ email của bạn.');
      setIsLoading(false);
      return;
    }

    try {
      // Gọi API backend để xử lý yêu cầu quên mật khẩu
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/forgot-password`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      // Backend của bạn hiện trả về MessageResponse JSON
      const data = await response.json(); 

      if (response.ok) {
        // Thông báo chung để tránh rò rỉ thông tin về việc email có tồn tại hay không.
        // Điều này là một thực hành bảo mật tốt.
        setStatusMessage(data.message || 'Nếu email tồn tại trong hệ thống, mật khẩu đã được gửi đến hộp thư của bạn. Vui lòng kiểm tra email và cả thư mục Spam/Junk.');
        setIsSuccess(data.success); // Dựa vào trường 'success' từ backend
        setEmail(''); // Xóa email khỏi ô nhập liệu sau khi gửi thành công
      } else {
        // Xử lý các lỗi từ backend (ví dụ: status 4xx, 5xx)
        setStatusMessage(data.message || 'Yêu cầu thất bại: Không xác định.');
        setIsSuccess(false);
      }
    } catch (error: any) {
      // Xử lý các lỗi mạng hoặc các vấn đề không liên quan đến phản hồi HTTP
      console.error('Lỗi khi gửi yêu cầu quên mật khẩu:', error);
      setStatusMessage('Lỗi kết nối mạng. Vui lòng thử lại sau.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false); // Kết thúc trạng thái loading dù thành công hay thất bại
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Quên Mật Khẩu</h2>
        <p className="text-gray-600 text-center mb-8">
          Vui lòng nhập địa chỉ email bạn đã đăng ký để nhận lại mật khẩu tài khoản.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
              placeholder="ví dụ: emailcuaban@example.com"
              required
              disabled={isLoading} // Vô hiệu hóa input khi đang loading
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors duration-200 ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={isLoading} // Vô hiệu hóa nút khi đang loading
          >
            {isLoading ? 'Đang gửi...' : 'Gửi Mật khẩu'}
          </button>

          {statusMessage && (
            <div className={`mt-4 p-3 rounded-md text-center text-sm ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {statusMessage}
            </div>
          )}
        </form>
        <p className="mt-8 text-center text-gray-500 text-sm">
          Nếu bạn nhớ mật khẩu của mình, <Link to="/auth" className="text-blue-600 hover:underline">Đăng nhập ngay</Link>. {/* <-- ĐÃ SỬA TỪ "/login" THÀNH "/auth" */}
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;