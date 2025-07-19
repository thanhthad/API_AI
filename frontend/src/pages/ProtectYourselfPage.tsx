import React from 'react';
import AnimateOnScroll from '../components/AnimateOnScroll';

// Import necessary React Icons
import {
  FaShieldAlt,
  FaLightbulb,
  FaUserCheck,
  FaLock,
  FaSyncAlt,
  FaMailBulk,
  FaCloudDownloadAlt,
  FaGraduationCap,
  FaArrowRight // Dùng cho các liên kết hoặc điểm nhấn
} from 'react-icons/fa';

const ProtectYourselfPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-20 text-gray-800 min-h-screen">

      {/* Main Title Section */}
      <AnimateOnScroll from={{ opacity: 0, y: -30 }} to={{ opacity: 1, y: 0 }} duration={0.8} delay={0} start="top 90%">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-blue-800 mb-12 flex items-center justify-center gap-4">
          <FaShieldAlt className="text-blue-500 text-5xl sm:text-6xl" /> Strengthen Your Email Defenses
        </h2>
        <p className="text-center text-lg max-w-3xl mx-auto mb-16 leading-relaxed">
          Proactive steps are crucial to staying safe online. Here's a comprehensive guide to help you protect yourself from email scams.
        </p>
      </AnimateOnScroll>

      {/* Grid of Protection Tips */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* 1. Be Skeptical and Verify */}
        <AnimateOnScroll from={{ opacity: 0, y: 50, scale: 0.9 }} to={{ opacity: 1, y: 0, scale: 1 }} delay={100} duration={0.8} ease="back.out(1.2)" start="top 90%">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
            <FaUserCheck className="text-green-500 text-4xl mb-4 mx-auto block" />
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">1. Be Skeptical & Verify</h3>
            <p className="text-base leading-relaxed text-gray-700 flex-grow">
              Always approach unexpected emails with **skepticism**. Independently **verify legitimacy** if an email asks for action or sensitive info. Don't use contact details from the suspicious email; find official ones separately.
            </p>
          </div>
        </AnimateOnScroll>

        {/* 2. Use Strong, Unique Passwords and 2FA */}
        <AnimateOnScroll from={{ opacity: 0, y: 50, scale: 0.9 }} to={{ opacity: 1, y: 0, scale: 1 }} delay={250} duration={0.8} ease="back.out(1.2)" start="top 90%">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
            <FaLock className="text-blue-500 text-4xl mb-4 mx-auto block" />
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">2. Strong Passwords & 2FA</h3>
            <p className="text-base leading-relaxed text-gray-700 flex-grow">
              Create **long, complex, unique passwords** for each account (consider a password manager). Enable **two-factor authentication (2FA)** wherever possible for an extra security layer.
            </p>
          </div>
        </AnimateOnScroll>

        {/* 3. Keep Software Updated */}
        <AnimateOnScroll from={{ opacity: 0, y: 50, scale: 0.9 }} to={{ opacity: 1, y: 0, scale: 1 }} delay={400} duration={0.8} ease="back.out(1.2)" start="top 90%">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
            <FaSyncAlt className="text-purple-500 text-4xl mb-4 mx-auto block" />
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">3. Keep Software Updated</h3>
            <p className="text-base leading-relaxed text-gray-700 flex-grow">
              Regularly **update your OS, browser, antivirus**, and all applications. Updates often include **security patches** that fix vulnerabilities scammers exploit.
            </p>
          </div>
        </AnimateOnScroll>

        {/* 4. Use Email Security Features */}
        <AnimateOnScroll from={{ opacity: 0, y: 50, scale: 0.9 }} to={{ opacity: 1, y: 0, scale: 1 }} delay={550} duration={0.8} ease="back.out(1.2)" start="top 90%">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
            <FaMailBulk className="text-red-500 text-4xl mb-4 mx-auto block" />
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">4. Use Email Security Features</h3>
            <p className="text-base leading-relaxed text-gray-700 flex-grow">
              Familiarize yourself with your **email provider's security features** (spam filters, phishing warnings). Our **AI Email Analyzer** can also be your first line of defense.
            </p>
          </div>
        </AnimateOnScroll>

        {/* 5. Back Up Your Data */}
        <AnimateOnScroll from={{ opacity: 0, y: 50, scale: 0.9 }} to={{ opacity: 1, y: 0, scale: 1 }} delay={700} duration={0.8} ease="back.out(1.2)" start="top 90%">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
            <FaCloudDownloadAlt className="text-yellow-500 text-4xl mb-4 mx-auto block" />
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">5. Back Up Your Data</h3>
            <p className="text-base leading-relaxed text-gray-700 flex-grow">
              Regularly **back up important files** to external drives or cloud storage. If your system is compromised by malware, you can easily restore your data.
            </p>
          </div>
        </AnimateOnScroll>

        {/* 6. Educate Yourself and Others */}
        <AnimateOnScroll from={{ opacity: 0, y: 50, scale: 0.9 }} to={{ opacity: 1, y: 0, scale: 1 }} delay={850} duration={0.8} ease="back.out(1.2)" start="top 90%">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
            <FaGraduationCap className="text-orange-500 text-4xl mb-4 mx-auto block" />
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">6. Educate Yourself & Others</h3>
            <p className="text-base leading-relaxed text-gray-700 flex-grow">
              Stay **informed about the latest scam tactics**. Share what you learn with family, friends, and colleagues. A well-informed community is your best defense.
            </p>
          </div>
        </AnimateOnScroll>

      </div>

      {/* Call to Action or Concluding Section */}
      <AnimateOnScroll from={{ opacity: 0, y: 50 }} to={{ opacity: 1, y: 0 }} duration={1} delay={1000} start="top 85%">
        <section className="my-16 text-center bg-blue-50 p-8 rounded-xl shadow-inner border border-blue-200">
          <h3 className="text-3xl font-bold text-blue-800 mb-6 flex items-center justify-center gap-3">
            <FaLightbulb className="text-blue-600" /> Stay Alert, Stay Safe!
          </h3>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            By consistently applying these protective measures, you significantly reduce your risk of falling victim to email scams.
            Your digital security is in your hands!
          </p>
          {/* Optional: Add a button to go to the analysis page or home */}
          {/* <Link
            to="/analyze"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
          >
            Analyze an Email Now <FaArrowRight className="ml-2" />
          </Link> */}
        </section>
      </AnimateOnScroll>

    </div>
  );
};

export default ProtectYourselfPage;