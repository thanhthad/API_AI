import React, { useState } from 'react';

// Định nghĩa kiểu dữ liệu cho dữ liệu form
interface FormData {
  sender: string;
  subject: string;
  body: string;
}

// Định nghĩa kiểu dữ liệu cho response từ backend
interface AnalyzeResponse {
  primaryPredictionLabel: string;
  primaryPredictionScore: number;
  detailedPredictions: { label: string; score: number }[];
  message: string;
}

// Định nghĩa props cho component EmailForm
interface EmailFormProps {
  onResult: (result: AnalyzeResponse | null) => void; // Hàm callback khi có kết quả
  onError: (error: string | null) => void; // Hàm callback khi có lỗi
  setLoading: (loading: boolean) => void; // Hàm callback để cập nhật trạng thái loading
}

const EmailForm: React.FC<EmailFormProps> = ({ onResult, onError, setLoading }) => {
  const [formData, setFormData] = useState<FormData>({
    sender: '',
    subject: '',
    body: '',
  });

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý gửi form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    setLoading(true); // Bắt đầu loading
    onResult(null); // Xóa kết quả cũ
    onError(null); // Xóa lỗi cũ

    try {
      const response = await fetch('http://62.146.236.71:8080/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Chuyển đổi dữ liệu form sang JSON
      });

      if (!response.ok) {
        // Nếu response không OK (ví dụ: 4xx, 5xx)
        const errorData = await response.json(); // Đọc body lỗi
        onError(errorData.message || `HTTP error! status: ${response.status}`);
      } else {
        // Nếu response OK
        const result: AnalyzeResponse = await response.json(); // Đọc kết quả JSON
        onResult(result); // Cập nhật kết quả
      }
    } catch (error: any) {
      // Xử lý lỗi mạng hoặc lỗi khác
      onError(error.message || 'An error occurred while sending the request.');
    } finally {
      setLoading(false); // Kết thúc loading dù thành công hay thất bại
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="sender" className="block text-gray-700 text-sm font-bold mb-2">
          Sender:
        </label>
        <input
          type="email"
          id="sender"
          name="sender"
          value={formData.sender}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div>
        <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">
          Subject:
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div>
        <label htmlFor="body" className="block text-gray-700 text-sm font-bold mb-2">
          Body:
        </label>
        <textarea
          id="body"
          name="body"
          value={formData.body}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows={5}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Analyze Email
      </button>
    </form>
  );
};

export default EmailForm;