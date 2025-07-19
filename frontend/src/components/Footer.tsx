import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-8">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <Link to="/about-scams" className="hover:text-gray-300 transition-colors">About Scams</Link>
          <Link to="/how-to-identify" className="hover:text-gray-300 transition-colors">How to Identify</Link>
          <Link to="/protect-yourself" className="hover:text-gray-300 transition-colors">Protect Yourself</Link>
          <Link to="/report-scam" className="hover:text-gray-300 transition-colors">Report Scam</Link>
          <Link to="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} EmailShield. All rights reserved.</p>
        <p className="text-xs mt-2">Disclaimer: This tool is for informational purposes only and does not guarantee complete protection against all forms of email fraud.</p>
      </div>
    </footer>
  );
};

export default Footer;