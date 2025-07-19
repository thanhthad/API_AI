import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthForm from './components/AuthForm';
import EmailAnalysis from './components/EmailAnalysis';
import HistoryDisplay from './components/HistoryDisplay';
import ProtectedRoute from './components/ProtectedRoute';

// Import các trang tĩnh
import HomePage from './pages/HomePage';
import AboutScamsPage from './pages/AboutScamsPage';
import HowToIdentifyPage from './pages/HowToIdentifyPage';
import ProtectYourselfPage from './pages/ProtectYourselfPage';
import ReportScamPage from './pages/ReportScamPage';
import ContactPage from './pages/ContactPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage'; // <-- IMPORT TRANG QUÊN MẬT KHẨU

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Trang chủ (Public) */}
              <Route path="/" element={<HomePage />} />

              {/* Trang đăng ký / đăng nhập (Public) */}
              <Route path="/auth" element={<AuthForm onSuccess={() => window.location.href = '/analyze'} />} />

              {/* TRANG QUÊN MẬT KHẨU (Public) */}
              <Route path="/forgot-password" element={<ForgotPasswordPage />} /> {/* <-- THÊM ROUTE NÀY */}

              {/* Nhóm các Protected Routes (yêu cầu đăng nhập để truy cập) */}
              <Route element={<ProtectedRoute />}>
                {/* Các trang tĩnh bây giờ đã được bảo vệ */}
                <Route path="/about-scams" element={<AboutScamsPage />} />
                <Route path="/how-to-identify" element={<HowToIdentifyPage />} />
                <Route path="/protect-yourself" element={<ProtectYourselfPage />} />
                <Route path="/report-scam" element={<ReportScamPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Các trang tính năng đã có từ trước cũng nằm trong đây */}
                <Route path="/analyze" element={<EmailAnalysis />} />
                <Route path="/history" element={<HistoryDisplay />} />
              </Route>

              {/* Catch-all route for 404 Not Found */}
              <Route path="*" element={
                <div className="flex justify-center items-center h-full">
                  <h2 className="text-center text-3xl font-bold mt-20">404 - Page Not Found</h2>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;