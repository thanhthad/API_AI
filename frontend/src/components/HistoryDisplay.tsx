import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import ResultDisplay from './ResultDisplay';
import { gsap } from 'gsap';

// Import React Icons
import {
  FaHistory,
  FaSpinner,
  FaExclamationTriangle,
  FaInfoCircle,
  FaEye,
  FaTimes,
} from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';

// --- Interfaces ---
interface HistoryEmailDTO {
  id: number;
  sender: string;
  subject: string;
  body: string;
  primaryPredictionLabel: string;
  primaryPredictionScore: number;
  detailedPredictions: { label: string; score: number }[];
  analysisTime: string; // ISO 8601 string
  userId: number;
}

// --- Component ---
const HistoryDisplay: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryEmailDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<HistoryEmailDTO | null>(null);

  // Refs for GSAP animations
  const mainContentRef = useRef<HTMLDivElement>(null);
  const tableRowsRef = useRef<HTMLTableRowElement[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  // --- Effect: Fetch History Data ---
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user.userId) {
        setError('Please log in to view history.');
        setHistory([]); // Clear history if not logged in
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/analyze/history/${user.userId}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch history: ${response.status} ${errorText}`);
        }
        const data: HistoryEmailDTO[] = await response.json();
        setHistory(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching history.');
        setHistory([]); // Clear history on error
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    // Cleanup ref array on unmount or before re-fetch
    return () => {
        tableRowsRef.current = [];
    };
  }, [user.userId]);

  // --- Effect: GSAP Animation for Main Content Load ---
  useEffect(() => {
    if (!loading && !error && history.length > 0 && mainContentRef.current) {
      // Animate the main card container
      gsap.fromTo(mainContentRef.current,
        { opacity: 0, y: 30 }, // Start slightly below and transparent
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      // Staggered animation for table rows
      gsap.fromTo(tableRowsRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.08,
          delay: 0.4, // Delay slightly after main container animates
        }
      );
    }
  }, [loading, error, history]);

  // --- Effect: GSAP Animation for Modal Open/Close ---
  useEffect(() => {
    if (selectedEmail && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.8, y: -20 }, // Start smaller, transparent, and slightly up
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, [selectedEmail]); // This effect runs whenever selectedEmail changes

  // Helper to add ref to each table row
  const addRowRef = (el: HTMLTableRowElement) => {
    if (el && !tableRowsRef.current.includes(el)) {
      tableRowsRef.current.push(el);
    }
  };

  return (
    // Main container with padding-top to account for fixed header
    // pt-20 (80px) should match your header's height
    <div className="min-h-screen bg-gray-100 pt-20 pb-10 flex flex-col items-center justify-start">
      <div
        ref={mainContentRef} // Ref for main content animation
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-5xl mx-auto border border-blue-200"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-8 flex items-center justify-center gap-3">
          <FaHistory className="text-blue-500" /> Your Analysis History
        </h2>

        {loading && (
          <p className="text-center text-gray-600 flex items-center justify-center gap-2 text-lg animate-pulse">
            <FaSpinner className="animate-spin text-blue-500" /> Loading history...
          </p>
        )}
        {error && (
          <p className="text-red-600 text-center flex items-center justify-center gap-2 text-lg">
            <FaExclamationTriangle /> {error}
          </p>
        )}

        {!loading && !error && history.length === 0 && (
          <p className="text-center text-gray-600 flex items-center justify-center gap-2 text-lg">
            <FaInfoCircle /> No analysis history found. Start by analyzing an email!
          </p>
        )}

        {!loading && !error && history.length > 0 && (
          <div className="overflow-x-auto rounded-lg shadow-inner border border-gray-200">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sender</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Subject</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Primary Label</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Score</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Time</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((email) => (
                  <tr
                    key={email.id}
                    className="hover:bg-blue-50 transition-colors duration-200"
                    ref={addRowRef}
                  >
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900 max-w-[150px] truncate flex items-center gap-2">
                      <MdOutlineEmail className="text-blue-500" /> {email.sender}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900 max-w-[200px] truncate">{email.subject}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">{email.primaryPredictionLabel}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {(email.primaryPredictionScore * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(email.analysisTime).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedEmail(email)}
                        className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1 transition-all duration-300 transform hover:scale-105 group" // Added group for hover effect
                      >
                        <FaEye className="group-hover:scale-110 transition-transform duration-200" /> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Email Details Modal --- */}
      {selectedEmail && (
        <div
          // This fixed container starts below the header and spans the rest of the viewport
          className="fixed top-15 bottom-0 left-0 right-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50 animate-fade-in"
          onClick={() => setSelectedEmail(null)} // Close modal when clicking outside
        >
          <div
            ref={modalRef} // Ref for modal animation
            className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full max-h-[calc(100vh-160px)] overflow-y-auto relative border border-blue-300"
            onClick={(e) => e.stopPropagation()} // Prevent modal closing when clicking inside
          >
            <button
              onClick={() => setSelectedEmail(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-3xl font-bold transition-all duration-200 transform hover:rotate-90 group" // Added group for hover effect
            >
              <FaTimes className="group-hover:scale-110 transition-transform duration-200" />
            </button>
            <h3 className="text-2xl font-bold text-blue-700 mb-6 border-b pb-3">Email Details</h3>

            <div className="space-y-4 text-gray-700">
              <p><strong>Sender:</strong> <span className="font-medium text-blue-600">{selectedEmail.sender}</span></p>
              <p><strong>Subject:</strong> <span className="font-medium">{selectedEmail.subject}</span></p>
              <div>
                <strong>Body:</strong>
                <div className="block border border-gray-200 p-4 rounded-lg bg-gray-50 text-sm whitespace-pre-wrap break-words mt-2 max-h-48 overflow-y-auto">
                  {selectedEmail.body}
                </div>
              </div>
              <p><strong>Analysis Time:</strong> {new Date(selectedEmail.analysisTime).toLocaleString()}</p>
              <ResultDisplay
                result={{
                  primaryPredictionLabel: selectedEmail.primaryPredictionLabel,
                  primaryPredictionScore: selectedEmail.primaryPredictionScore,
                  detailedPredictions: selectedEmail.detailedPredictions,
                  message: "This is a historical analysis result."
                }}
                error={null}
                loading={false}
              />
            </div>
            <div className="mt-8 text-right">
              <button
                onClick={() => setSelectedEmail(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryDisplay;