// src/pages/ReportScamPage.tsx
import React from 'react';
import AnimateOnScroll from '../components/AnimateOnScroll';

// Import necessary React Icons
import {
  FaExclamationCircle,   // Main title icon
  FaBullhorn,            // Changed from FaMegaphone to FaBullhorn
  FaArrowRight,          // For list items/links
  FaLightbulb,           // How to Report a Scam
  FaExclamationTriangle, // What to do if compromised
  FaExternalLinkAlt,     // For external links
  FaCheckCircle          // For confirmation steps
} from 'react-icons/fa';

const ReportScamPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-20 text-gray-800 min-h-screen">

      {/* Main Title Section */}
      <AnimateOnScroll from={{ opacity: 0, y: -30 }} to={{ opacity: 1, y: 0 }} duration={0.8} delay={0} start="top 90%">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center text-red-700 mb-12 flex items-center justify-center gap-4">
          <FaExclamationCircle className="text-red-500 text-5xl sm:text-6xl" /> Report an Email Scam
        </h2>
        <p className="text-center text-base sm:text-lg max-w-3xl mx-auto mb-16 leading-relaxed">
          Reporting suspicious emails is a crucial step in combating cybercrime. Your action helps protect not only yourself but also countless others.
        </p>
      </AnimateOnScroll>

      {/* Section: Why Reporting Matters */}
      <AnimateOnScroll from={{ opacity: 0, x: -50 }} to={{ opacity: 1, x: 0 }} duration={1} delay={100} start="top 85%">
        <section className="my-10 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FaBullhorn className="text-blue-600" /> Why Reporting Matters
          </h3>
          <p className="text-base sm:text-lg leading-relaxed mb-4 text-gray-700">
            Reporting email scams is vital for several key reasons:
          </p>
          <ul className="list-disc pl-8 text-base sm:text-lg leading-relaxed space-y-3">
            <li>Helps **law enforcement** track down cybercriminals.</li>
            <li>Contributes to databases, **improving spam and phishing filters** for everyone.</li>
            <li>**Protects others** from falling victim to the same scams.</li>
          </ul>
        </section>
      </AnimateOnScroll>

      {/* Section: How to Report a Scam Email */}
      <AnimateOnScroll from={{ opacity: 0, y: 50 }} to={{ opacity: 1, y: 0 }} duration={1} delay={200} start="top 85%">
        <section className="my-10 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FaLightbulb className="text-yellow-600" /> How to Report a Scam Email
          </h3>
          <ol className="list-decimal pl-8 text-base sm:text-lg leading-relaxed space-y-4">
            <li>
              <strong>DO NOT click links or download attachments:</strong> This is the most crucial step to prevent further compromise.
            </li>
            <li>
              <strong>Forward to your Email Provider:</strong> Most services have dedicated reporting methods.
              <ul className="list-disc pl-6 mt-2 text-sm sm:text-base space-y-1">
                <li>**Gmail:** Use the "Report Phishing" button or forward to <a href="mailto:reportphishing@apwg.org" className="text-blue-600 hover:underline">`reportphishing@apwg.org`</a></li>
                <li>**Outlook/Hotmail:** Use the "Report Phishing" or "Junk" button.</li>
                <li>**Yahoo Mail:** Use the "Spam" or "Phishing" button.</li>
              </ul>
            </li>
            <li>
              <strong>Report to the Anti-Phishing Working Group (APWG):</strong> Forward the suspicious email to <a href="mailto:reportphishing@apwg.org" className="text-blue-600 hover:underline">`reportphishing@apwg.org`</a>. This organization collects global data.
            </li>
            <li>
              <strong>Report to Government Agencies (if applicable):</strong>
              <ul className="list-disc pl-6 mt-2 text-sm sm:text-base space-y-1">
                <li>
                  **In the U.S.:** Internet Crime Complaint Center (IC3) at <a href="https://www.ic3.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">ic3.gov <FaExternalLinkAlt className="text-xs" /></a>
                </li>
                <li>
                  **In the U.K.:** Action Fraud at <a href="https://www.actionfraud.police.uk/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">actionfraud.police.uk <FaExternalLinkAlt className="text-xs" /></a>
                </li>
                <li>
                  **Other Countries:** Search for your national cybercrime reporting agency.
                </li>
              </ul>
            </li>
            <li>
              <strong>Delete the Email:</strong> Once reported, remove the email from your inbox and trash.
            </li>
          </ol>
        </section>
      </AnimateOnScroll>

      {/* Section: What to do if you clicked a link or provided information */}
      <AnimateOnScroll from={{ opacity: 0, y: 50 }} to={{ opacity: 1, y: 0 }} duration={1} delay={300} start="top 85%">
        <section className="my-10 bg-red-50 p-8 rounded-xl shadow-lg border border-red-200">
          <h3 className="text-2xl sm:text-3xl font-bold text-red-800 mb-6 flex items-center gap-3">
            <FaExclamationTriangle className="text-red-600" /> If You Clicked or Provided Info
          </h3>
          <p className="text-base sm:text-lg leading-relaxed mb-4 text-gray-700">
            Act fast if you've accidentally interacted with a scam email:
          </p>
          <ul className="list-disc pl-8 text-base sm:text-lg leading-relaxed space-y-3">
            <li>**Change Passwords Immediately:** Update any compromised accounts.</li>
            <li>**Enable 2FA:** Activate two-factor authentication on all accounts for extra security.</li>
            <li>**Monitor Financial Statements:** Watch bank and credit card activity for unauthorized transactions.</li>
            <li>**Run Antivirus Scan:** Perform a full system scan with reputable antivirus software.</li>
            <li>**Notify Bank/Credit Card Company:** Contact them if you suspect financial fraud.</li>
          </ul>
        </section>
      </AnimateOnScroll>

      {/* Concluding Section / Call to Action */}
      <AnimateOnScroll from={{ opacity: 0, y: 50 }} to={{ opacity: 1, y: 0 }} duration={1} delay={400} start="top 85%">
        <section className="my-16 text-center bg-blue-50 p-8 rounded-xl shadow-inner border border-blue-200">
          <h3 className="text-3xl font-bold text-blue-800 mb-6 flex items-center justify-center gap-3">
            <FaCheckCircle className="text-blue-600" /> Your Action Makes a Difference!
          </h3>
          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-8">
            Every report contributes to a safer online environment. Thank you for doing your part!
          </p>
          {/* Optional: Button to return to home or analyze page */}
          {/* <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
          >
            Back to Home <FaArrowRight className="ml-2" />
          </Link> */}
        </section>
      </AnimateOnScroll>

    </div>
  );
};

export default ReportScamPage;