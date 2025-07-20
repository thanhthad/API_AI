// src/components/DomainAnalysis.tsx (Hoặc tên file của bạn)
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
// import { useNavigate } from 'react-router-dom'; // <-- Thêm import này nếu bạn muốn tự động chuyển hướng

interface DomainCheckResponse {
  domain: string;
  status: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS' | 'UNKNOWN' | 'ERROR' | 'INVALID_FORMAT';
  confidence: number;
  message: string;
}

const DomainAnalysis: React.FC = () => {
  const { user } = useAuth();
  // const navigate = useNavigate(); // Khởi tạo navigate

  const [domain, setDomain] = useState('');
  const [analysisResult, setAnalysisResult] = useState<DomainCheckResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalysisResult(null);
    setErrorMessage('');
    setIsLoading(true);

    if (!domain.trim()) {
      setErrorMessage('Vui lòng nhập một domain hoặc URL.');
      setIsLoading(false);
      return;
    }

    if (!user || user.userId === null || user.userId === undefined) {
      setErrorMessage('Bạn cần đăng nhập để sử dụng tính năng này.');
      setIsLoading(false);
      // Optional: Chuyển hướng người dùng đến trang đăng nhập nếu chưa đăng nhập
      // navigate('/auth'); 
      return;
    }

    try {
      const response = await fetch('http://62.146.236.71:8080/api/domain/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${user.token}` // Nếu có JWT
        },
        body: JSON.stringify({ domain, userId: user.userId }),
      });

      const data: DomainCheckResponse = await response.json(); 

      if (response.ok) {
        setAnalysisResult(data);
      } else {
        setErrorMessage(data.message || `Có lỗi xảy ra (mã ${response.status}). Vui lòng thử lại.`);
        setAnalysisResult(null);
      }

    } catch (error) {
      console.error('Lỗi khi gọi API phân tích domain:', error);
      setErrorMessage('Không thể kết nối đến máy chủ phân tích. Vui lòng kiểm tra kết nối mạng hoặc máy chủ backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: DomainCheckResponse['status']) => {
    switch (status) {
      case 'MALICIOUS': return 'text-red-600 font-bold';
      case 'SUSPICIOUS': return 'text-yellow-600 font-bold';
      case 'SAFE': return 'text-green-600 font-bold';
      case 'INVALID_FORMAT':
      case 'ERROR':
      case 'UNKNOWN':
      default: return 'text-gray-600 font-bold';
    }
  };

  const getStatusText = (status: DomainCheckResponse['status']) => {
    switch (status) {
      case 'MALICIOUS': return 'Nguy hiểm (Malicious)';
      case 'SUSPICIOUS': return 'Đáng ngờ (Suspicious)';
      case 'SAFE': return 'An toàn (Safe)';
      case 'INVALID_FORMAT': return 'Định dạng không hợp lệ';
      case 'ERROR': return 'Lỗi';
      case 'UNKNOWN': default: return 'Không xác định';
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl mt-10 mb-10">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        Công cụ Phân tích Domain Nguy hiểm
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-xl">
        <p className="text-gray-700 text-lg mb-6 text-center">
          Nhập một domain hoặc URL vào ô dưới đây để kiểm tra xem nó có dấu hiệu lừa đảo hay nguy hiểm hay không.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="domainInput" className="block text-sm font-medium text-gray-700 mb-2">
              Domain/URL cần phân tích:
            </label>
            <input
              type="text"
              id="domainInput"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
              placeholder="ví dụ: example.com hoặc https://malicious-site.net/login"
              required
              disabled={isLoading || !user || user.userId === null || user.userId === undefined}
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors duration-200 ${
              isLoading || !user || user.userId === null || user.userId === undefined ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={isLoading || !user || user.userId === null || user.userId === undefined}
          >
            {isLoading ? 'Đang phân tích...' : 'Phân tích Domain'}
          </button>
        </form>

        {errorMessage && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
            {errorMessage}
          </div>
        )}
        {(!user || user.userId === null || user.userId === undefined) && !errorMessage && (
            <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md text-center">
              Vui lòng đăng nhập để sử dụng tính năng phân tích domain.
            </div>
        )}

        {analysisResult && (
          <div className="mt-8 p-6 border rounded-lg bg-gray-50">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Kết quả Phân tích</h3>
            <p className="text-lg mb-2">
              <span className="font-medium">Domain:</span> {analysisResult.domain}
            </p>
            <p className="text-lg mb-2">
              <span className="font-medium">Trạng thái:</span>{' '}
              <span className={getStatusColor(analysisResult.status)}>
                {getStatusText(analysisResult.status)}
              </span>
            </p>
            {analysisResult.status !== 'ERROR' && analysisResult.status !== 'INVALID_FORMAT' && (
              <p className="text-lg mb-2">
                <span className="font-medium">Độ tin cậy:</span> {(analysisResult.confidence * 100).toFixed(2)}%
              </p>
            )}
            <p className="text-lg">
              <span className="font-medium">Thông báo:</span> {analysisResult.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainAnalysis;