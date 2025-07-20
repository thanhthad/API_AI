import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ResultDisplay from './ResultDisplay';
import AnimateOnScroll from './AnimateOnScroll'; // Đảm bảo AnimateOnScroll đã được import
import { gsap } from 'gsap'; // Import gsap
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Import ScrollTrigger nếu bạn dùng cho cuộn

// Đăng ký ScrollTrigger nếu bạn có ý định dùng nó trong component này
gsap.registerPlugin(ScrollTrigger);

interface FormData {
  sender: string;
  subject: string;
  body: string;
}

interface AnalyzeResponse {
  primaryPredictionLabel: string;
  primaryPredictionScore: number;
  detailedPredictions: { label: string; score: number }[];
  message: string;
}

const EmailAnalysis: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    sender: '',
    subject: '',
    body: '',
  });
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Ref cho các phần tử để animate với GSAP
  const formRef = useRef(null);
  const headingRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Animation cho tiêu đề khi component mount
    gsap.fromTo(headingRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );

    // Animation cho form khi component mount
    gsap.fromTo(formRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.4 }
    );

    // Animation cho nút gửi
    gsap.fromTo(buttonRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 0.6 }
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    if (!user.userId) {
      setError('User not logged in. Please log in to analyze emails.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/analyze/${user.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || `HTTP error! status: ${response.status}`);
      } else {
        const resultData: AnalyzeResponse = await response.json();
        setResult(resultData);
        // Optional: clear form after successful analysis
        // setFormData({ sender: '', subject: '', body: '' });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending the request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 pt-25 mb-{-40}">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-500 hover:scale-[1.005]">
        <h2 ref={headingRef} className="text-4xl font-extrabold text-center text-blue-800 mb-8 tracking-tight">
          AI Email Analyzer
        </h2>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="sender" className="block text-sm font-medium text-gray-700 mb-1">
              Sender Email:
            </label>
            <input
              type="email"
              id="sender"
              name="sender"
              value={formData.sender}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., support@amazon-alert.com"
              required
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Email Subject:
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Urgent: Your account has been suspended!"
              required
            />
          </div>

          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
              Email Body Content:
            </label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y"
              placeholder="Paste the full content of the email here..."
              rows={8}
              required
            />
          </div>

          <button
            ref={buttonRef}
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Analyze Email'}
          </button>
        </form>

        <AnimateOnScroll delay={result || error ? 0 : 500}>
            <ResultDisplay result={result} error={error} loading={loading} />
        </AnimateOnScroll>
      </div>
    </div>
  );
};

export default EmailAnalysis;