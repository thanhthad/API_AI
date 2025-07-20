import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // <-- Import AuthContext để lấy userId

// Định nghĩa interface cho kiểu dữ liệu nhận từ backend (cập nhật để khớp với DomainAnalysisResult)
interface HistoryItem {
  id: number;
  domain: string;
  status: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS' | 'UNKNOWN' | 'ERROR' | 'INVALID_FORMAT'; // Các trạng thái từ Backend
  confidence: number;       // Tên trường khớp với backend (confidence)
  message: string;
  analysisDate: string;     // Dạng chuỗi ISO 8601 từ LocalDateTime
}

const AnalysisHistory: React.FC = () => {
  const { user } = useAuth(); // Lấy thông tin user từ AuthContext
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      // Đảm bảo có userId trước khi gọi API một cách an toàn
      if (!user || user.userId === null || user.userId === undefined) {
        setErrorMessage('Bạn cần đăng nhập để xem lịch sử phân tích domain.');
        setIsLoading(false);
        return;
      }

      try {
        // SỬA ĐỔI QUAN TRỌNG: Cập nhật URL để userId là path variable
        const response = await fetch(`http://62.146.236.71:8080/api/domain/history/${user.userId}`, {
          headers: {
            // 'X-User-Id': user.userId.toString(), // <-- XÓA DÒNG NÀY
            // Nếu có JWT, bạn sẽ thêm Authorization header ở đây:
            // 'Authorization': `Bearer ${user.token}`
          },
        });

        if (response.ok) {
          const data: HistoryItem[] = await response.json();
          setHistory(data);
        } else if (response.status === 401) {
            setErrorMessage('Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
        }
        else {
          setErrorMessage('Không thể tải lịch sử phân tích. Vui lòng thử lại.');
        }
      } catch (error) {
        console.error('Lỗi khi tải lịch sử:', error);
        setErrorMessage('Lỗi kết nối mạng. Không thể tải lịch sử phân tích.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
    // Thay đổi dependency array để chỉ re-fetch khi user.userId thay đổi
  }, [user?.userId]); // Sử dụng optional chaining để an toàn hơn

  // Hàm trợ giúp để định dạng màu sắc cho kết quả dựa trên 'status'
  const getStatusColor = (status: HistoryItem['status']) => {
    switch (status) {
      case 'MALICIOUS':
        return 'text-red-600 font-medium';
      case 'SUSPICIOUS':
        return 'text-yellow-600 font-medium';
      case 'SAFE':
        return 'text-green-600 font-medium';
      case 'INVALID_FORMAT':
      case 'ERROR':
      case 'UNKNOWN':
      default:
        return 'text-gray-600 font-medium';
    }
  };

  // Hàm để dịch trạng thái sang tiếng Việt
  const getStatusText = (status: HistoryItem['status']) => {
    switch (status) {
      case 'MALICIOUS':
        return 'Nguy hiểm';
      case 'SUSPICIOUS':
        return 'Đáng ngờ';
      case 'SAFE':
        return 'An toàn';
      case 'INVALID_FORMAT':
        return 'Định dạng không hợp lệ';
      case 'ERROR':
        return 'Lỗi';
      case 'UNKNOWN':
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl mt-10 mb-10">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        Lịch sử Phân tích Domain
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-xl">
        {isLoading && <p className="text-center text-blue-600">Đang tải lịch sử...</p>}
        {errorMessage && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
            {errorMessage}
          </div>
        )}

        {/* Cập nhật điều kiện hiển thị thông báo "Chưa có lịch sử" */}
        {!isLoading && history.length === 0 && !errorMessage && user?.userId && (
          <p className="text-center text-gray-600">Chưa có lịch sử phân tích nào cho người dùng này.</p>
        )}
        {/* Cập nhật điều kiện hiển thị thông báo "Vui lòng đăng nhập" */}
        {!isLoading && (!user || user.userId === null || user.userId === undefined) && !errorMessage && (
            <p className="text-center text-gray-600">Vui lòng đăng nhập để xem lịch sử phân tích.</p>
        )}

        {!isLoading && history.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Domain</th>
                  <th className="py-3 px-6 text-left">Trạng thái</th>
                  <th className="py-3 px-6 text-left">Độ tin cậy</th>
                  <th className="py-3 px-6 text-left">Thời gian</th>
                  <th className="py-3 px-6 text-left">Thông báo</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {history.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{item.domain}</td>
                    <td className="py-3 px-6 text-left">
                      <span className={getStatusColor(item.status)}>
                        {getStatusText(item.status)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">{(item.confidence * 100).toFixed(2)}%</td>
                    <td className="py-3 px-6 text-left">{new Date(item.analysisDate).toLocaleString()}</td>
                    <td className="py-3 px-6 text-left">{item.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisHistory;