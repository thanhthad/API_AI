// src/pages/AboutScamsPage.tsx
import React from 'react';
import AnimateOnScroll from '../components/AnimateOnScroll';

// Import necessary React Icons
import {
  FaShieldAlt,           // Main title icon
  FaQuestionCircle,      // What is Email Fraud?
  FaExclamationTriangle, // Common Types of Scams
  FaLightbulb,           // Why effective?
  FaHandPointRight,      // For general list items
  FaUserSecret,          // Spear Phishing / Whaling
  FaBriefcase,           // BEC
  FaMoneyBillAlt,        // Nigerian / Lottery Scams
  FaLaptopCode,          // Tech Support Scams
  FaInfoCircle,          // For additional tips or summaries
  FaUserShield,          // For proactive tips
  FaLock                  // For security points
} from 'react-icons/fa';

const AboutScamsPage: React.FC = () => {
  return (
    // Main container của trang, thêm padding-top để tránh bị header cố định che mất
    <div className="container mx-auto px-4 py-20 text-gray-800 min-h-screen">

      {/* Main Title Section */}
      <AnimateOnScroll from={{ opacity: 0, y: -30 }} to={{ opacity: 1, y: 0 }} duration={0.8} delay={0} start="top 90%">
        {/* Giảm text-5xl xuống text-4xl hoặc text-3xl tùy độ ưu tiên */}
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-blue-800 mb-12 flex items-center justify-center gap-4">
          <FaShieldAlt className="text-blue-500 text-2l sm:text-2xl" /> Understanding Email Scams
        </h2>
      </AnimateOnScroll>

      {/* Section: What is Email Fraud (Phishing)? */}
      <AnimateOnScroll from={{ opacity: 0, x: -50 }} to={{ opacity: 1, x: 0 }} duration={1} delay={100} start="top 85%">
        <section className="my-10 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          {/* Giảm text-3xl xuống text-2xl hoặc text-3xl tùy độ ưu tiên */}
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FaQuestionCircle className="text-blue-600" /> What is Email Fraud (Phishing)?
          </h3>
          {/* Giảm text-lg xuống text-base */}
          <p className="text-base sm:text-lg leading-relaxed mb-4 text-gray-700">
            **Email fraud**, also known as **phishing**, is a cybercrime using deceptive emails. Attackers aim to **trick you into revealing sensitive information** like logins, credit card details, or personal data.
          </p>
          {/* Giảm text-lg xuống text-base */}
          <p className="text-base sm:text-lg leading-relaxed text-gray-700">
            These emails often **mimic legitimate sources** (banks, government, etc.). Their ultimate goal: gain unauthorized access, commit identity theft, or install malware. It's a prevalent and damaging cybercrime.
          </p>
        </section>
      </AnimateOnScroll>

      {/* Section: Common Types of Email Scams */}
      <AnimateOnScroll from={{ opacity: 0, y: 50 }} to={{ opacity: 1, y: 0 }} duration={1} delay={200} start="top 85%">
        <section className="my-10 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          {/* Giảm text-3xl xuống text-2xl hoặc text-3xl tùy độ ưu tiên */}
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FaExclamationTriangle className="text-red-500" /> Common Types of Email Scams
          </h3>
          <ul className="list-none pl-0 text-base sm:text-lg leading-relaxed space-y-4">
            {/* Mỗi mục được bọc trong AnimateOnScroll để tạo hiệu ứng staggered */}
            <AnimateOnScroll from={{ opacity: 0, x: -20 }} to={{ opacity: 1, x: 0 }} delay={50} duration={0.6} ease="power2.out" start="top 95%">
              <li className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg shadow-sm">
                <FaHandPointRight className="text-blue-500 text-xl sm:text-2xl mt-1 flex-shrink-0" /> {/* Icon size adjusted */}
                <div>
                  <strong>Phishing:</strong> Impersonating trusted entities to steal credentials or data.
                </div>
              </li>
            </AnimateOnScroll>
            <AnimateOnScroll from={{ opacity: 0, x: -20 }} to={{ opacity: 1, x: 0 }} delay={150} duration={0.6} ease="power2.out" start="top 95%">
              <li className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg shadow-sm">
                <FaUserSecret className="text-blue-500 text-xl sm:text-2xl mt-1 flex-shrink-0" /> {/* Icon size adjusted */}
                <div>
                  <strong>Spear Phishing & Whaling:</strong> Highly targeted attacks on specific individuals or high-profile executives.
                </div>
              </li>
            </AnimateOnScroll>
            <AnimateOnScroll from={{ opacity: 0, x: -20 }} to={{ opacity: 1, x: 0 }} delay={250} duration={0.6} ease="power2.out" start="top 95%">
              <li className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg shadow-sm">
                <FaBriefcase className="text-blue-500 text-xl sm:text-2xl mt-1 flex-shrink-0" /> {/* Icon size adjusted */}
                <div>
                  <strong>Business Email Compromise (BEC):</strong> Impersonating executives or vendors to trick employees into fraudulent money transfers.
                </div>
              </li>
            </AnimateOnScroll>
            <AnimateOnScroll from={{ opacity: 0, x: -20 }} to={{ opacity: 1, x: 0 }} delay={350} duration={0.6} ease="power2.out" start="top 95%">
              <li className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg shadow-sm">
                <FaMoneyBillAlt className="text-blue-500 text-xl sm:text-2xl mt-1 flex-shrink-0" /> {/* Icon size adjusted */}
                <div>
                  <strong>Nigerian Scams & Lottery Scams:</strong> Promises of large sums for upfront "fees" that never materialize.
                </div>
              </li>
            </AnimateOnScroll>
            <AnimateOnScroll from={{ opacity: 0, x: -20 }} to={{ opacity: 1, x: 0 }} delay={450} duration={0.6} ease="power2.out" start="top 95%">
              <li className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg shadow-sm">
                <FaLaptopCode className="text-blue-500 text-xl sm:text-2xl mt-1 flex-shrink-0" /> {/* Icon size adjusted */}
                <div>
                  <strong>Tech Support Scams:</strong> Impersonating tech support (e.g., Microsoft) to gain remote access or demand payment for fake services.
                </div>
              </li>
            </AnimateOnScroll>
          </ul>
        </section>
      </AnimateOnScroll>

      {/* Section: Why are Scams so Effective? */}
      <AnimateOnScroll from={{ opacity: 0, y: 50 }} to={{ opacity: 1, y: 0 }} duration={1} delay={300} start="top 85%">
        <section className="my-10 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          {/* Giảm text-3xl xuống text-2xl hoặc text-3xl tùy độ ưu tiên */}
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FaLightbulb className="text-yellow-500" /> Why Are Email Scams So Effective?
          </h3>
          {/* Giảm text-lg xuống text-base */}
          <p className="text-base sm:text-lg leading-relaxed mb-4 text-gray-700">
            Scammers are masters of **human psychology**. They exploit emotions like **fear, urgency, greed, or curiosity**. Their tactics bypass critical thinking, prompting immediate, unthinking reactions.
          </p>
          {/* Giảm text-lg xuống text-base */}
          <p className="text-base sm:text-lg leading-relaxed mb-4 text-gray-700">
            They create **highly convincing fakes** (websites, emails with legitimate logos). This makes fraud incredibly hard to spot. The sheer **volume of daily emails** also adds to the detection challenge.
          </p>
          {/* Giảm text-lg xuống text-base */}
          <p className="text-base sm:text-lg leading-relaxed text-gray-700">
            Understanding these tactics is key to building your personal defense.
          </p>
        </section>
      </AnimateOnScroll>

      {/* New Section: Proactive Protection - Emphasizing what users can do */}
      <AnimateOnScroll from={{ opacity: 0, y: 50 }} to={{ opacity: 1, y: 0 }} duration={1} delay={400} start="top 85%">
        <section className="my-10 bg-green-50 p-8 rounded-xl shadow-inner border border-green-200">
          {/* Giảm text-3xl xuống text-2xl hoặc text-3xl tùy độ ưu tiên */}
          <h3 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6 flex items-center justify-center gap-3">
            <FaUserShield className="text-green-600" /> Your Proactive Protection Steps
          </h3>
          {/* Giảm text-lg xuống text-base */}
          <ul className="list-disc pl-8 text-base sm:text-lg leading-relaxed space-y-3 text-gray-700">
            <li>**Always Verify Sender:** Check email addresses for subtle misspellings or unusual domains.</li>
            <li>**Hover Before Clicking:** Preview links by hovering your mouse over them. Don't click suspicious URLs.</li>
            <li>**Beware of Urgency:** Scammers often pressure you to act fast. Pause and verify any urgent requests.</li>
            <li>**Report & Delete:** If suspicious, report the email to your provider and delete it immediately. Never engage.</li>
            <li>**Use Reliable Tools:** Leverage services like EmailShield to analyze suspicious emails before interacting.</li>
          </ul>
        </section>
      </AnimateOnScroll>

      {/* Key Takeaways Section - A summary for quick understanding */}
      <AnimateOnScroll from={{ opacity: 0, y: 50 }} to={{ opacity: 1, y: 0 }} duration={1} delay={500} start="top 85%">
        <section className="my-10 bg-blue-50 p-8 rounded-xl shadow-inner border border-blue-200">
          {/* Giảm text-3xl xuống text-2xl hoặc text-3xl tùy độ ưu tiên */}
          <h3 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-6 flex items-center justify-center gap-3">
            <FaInfoCircle className="text-blue-600" /> Key Takeaways
          </h3>
          {/* Giảm text-lg xuống text-base */}
          <ul className="list-disc pl-8 text-base sm:text-lg leading-relaxed space-y-3 text-gray-700">
            <li>Email fraud is **diverse** and constantly evolving.</li>
            <li>Scammers rely on **deception and emotional manipulation**.</li>
            <li>**Vigilance** and **education** are your strongest defenses.</li>
            <li>EmailShield provides **tools and knowledge** to help you stay safe.</li>
          </ul>
        </section>
      </AnimateOnScroll>

    </div>
  );
};

export default AboutScamsPage;