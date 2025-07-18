import React, { useState } from 'react';
import EmailForm from './components/EmailForm';
import ResultDisplay from './components/ResultDisplay';

function App() {
  const [result, setResult] = useState<any | null>(null); // Lưu trữ kết quả phân tích
  const [error, setError] = useState<string | null>(null); // Lưu trữ thông báo lỗi
  const [loading, setLoading] = useState<boolean>(false); // Lưu trữ trạng thái loading

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          Email AI Analyzer
        </h1>
        {/* Component Form gửi email */}
        <EmailForm onResult={setResult} onError={setError} setLoading={setLoading} />

        {/* Component hiển thị kết quả */}
        <ResultDisplay result={result} error={error} loading={loading} />
      </div>
    </div>
  );
}

export default App;