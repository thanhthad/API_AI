// src/pages/HomePage.tsx
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AnimateOnScroll from '../components/AnimateOnScroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import phishingConcept from '../assets/phishing.webp'; // Assuming you have an image for phishing concept

import {
  FaShieldAlt,
  FaQuestionCircle,
  FaBrain,
  FaTags,
  FaHistory,
  FaLightbulb,
  FaUserShield,
  FaRegLightbulb,
  FaLock
} from 'react-icons/fa';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HomePage: React.FC = () => {
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroText1Ref = useRef<HTMLParagraphElement>(null);
  const heroText2Ref = useRef<HTMLParagraphElement>(null);
  const heroButtonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (heroTitleRef.current && heroText1Ref.current && heroText2Ref.current && heroButtonRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(heroTitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 })
        .fromTo(heroText1Ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '<0.3')
        .fromTo(heroText2Ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '<0.2')
        .fromTo(heroButtonRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }, '<0.3');
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-20 text-gray-800">

      {/* Hero Section */}
      <section className="text-center my-16">
        <div ref={heroTitleRef}>
          <h2 className="text-5xl font-extrabold text-blue-800 mb-6 flex items-center justify-center gap-3">
            <FaShieldAlt className="text-blue-500" /> Shield Your Inbox from Scams
          </h2>
        </div>
        <p ref={heroText1Ref} className="text-xl max-w-3xl mx-auto mb-4 leading-relaxed">
          Welcome to **EmailShield**, your ultimate fortress against the ever-evolving landscape of email fraud. Your inbox is often the first line of defense against cybercriminals.
        </p>
        <p ref={heroText2Ref} className="text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
          Our cutting-edge, **AI-powered analysis tool** meticulously examines suspicious emails, offering you clarity and peace of mind.
        </p>
        <Link
          to="/analyze"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
          ref={heroButtonRef}
        >
          Analyze Your Email Now <FaRegLightbulb className="ml-2" />
        </Link>
      </section>

      {/* What is Email Fraud? Section */}
      <AnimateOnScroll from={{ opacity: 0, x: -50 }} to={{ opacity: 1, x: 0 }} duration={1} delay={100} start="top 85%">
        <section className="my-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <FaQuestionCircle className="text-gray-600" /> What is Email Fraud?
            </h3>
            <p className="text-lg leading-relaxed mb-4">
              **Email fraud**, also known as **phishing**, is a deceptive cybercrime where attackers send fraudulent emails to trick individuals into revealing sensitive information like login credentials, credit card details, or personal data.
            </p>
            <p className="text-lg leading-relaxed">
              These emails often mimic legitimate sources (banks, government agencies) and aim to gain unauthorized access to your accounts, commit identity theft, or install malware.
            </p>
            <Link to="/about-scams" className="text-blue-600 hover:underline font-semibold text-lg flex items-center gap-1 mt-4">
              Learn More About Scams &rarr;
            </Link>
          </div>
          <div className="flex justify-center">
            <img src={phishingConcept} alt="Phishing Concept" className="rounded-lg shadow-xl max-w-full h-auto" />
          </div>
        </section>
      </AnimateOnScroll>

      {/* How Our AI Helps Section */}
      <section className="my-16 text-center">
        <AnimateOnScroll from={{ opacity: 0, y: 50 }} to={{ opacity: 1, y: 0 }} duration={0.9} delay={0} start="top 85%">
            <h3 className="text-4xl font-bold text-gray-900 mb-8">How Our AI Helps</h3>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-3 gap-8">
          <AnimateOnScroll from={{ opacity: 0, y: 50, scale: 0.9 }} to={{ opacity: 1, y: 0, scale: 1 }} delay={100} duration={0.8} ease="back.out(1.2)" start="top 90%">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between">
              <div>
                <FaBrain className="text-blue-500 text-4xl mb-3 mx-auto block" />
                <h4 className="text-xl font-bold text-blue-700 mb-3">Intelligent Analysis</h4>
                <p className="text-gray-700">
                  Our advanced AI model scans email content, headers, and links for patterns indicative of spam, phishing, or suspicious activity.
                </p>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll from={{ opacity: 0, y: 50, scale: 0.9 }} to={{ opacity: 1, y: 0, scale: 1 }} delay={250} duration={0.8} ease="back.out(1.2)" start="top 90%">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between">
              <div>
                <FaTags className="text-blue-500 text-4xl mb-3 mx-auto block" />
                <h4 className="text-xl font-bold text-blue-700 mb-3">Multi-Label Detection</h4>
                <p className="text-gray-700">
                  Get detailed insights with multi-label predictions like **SPAM**, **PHISHING**, **PROMOTIONAL**, and **SUSPICIOUS**.
                </p>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll from={{ opacity: 0, y: 50, scale: 0.9 }} to={{ opacity: 1, y: 0, scale: 1 }} delay={400} duration={0.8} ease="back.out(1.2)" start="top 90%">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between">
              <div>
                <FaHistory className="text-blue-500 text-4xl mb-3 mx-auto block" />
                <h4 className="text-xl font-bold text-blue-700 mb-3">History Tracking</h4>
                <p className="text-gray-700">
                  Keep a record of all your analyzed emails to learn and track potential threats over time.
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Ready to Protect Yourself? Section */}
      <AnimateOnScroll from={{ opacity: 0, y: 50 }} to={{ opacity: 1, y: 0 }} duration={1} ease="power2.out" delay={0} start="top 85%">
        <section className="my-16 text-center">
          <h3 className="text-4xl font-bold text-gray-900 mb-8">Ready to Protect Yourself?</h3>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Start by analyzing your first email, or explore our guides to become an expert at identifying and avoiding email fraud.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/how-to-identify"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <FaLightbulb /> How to Identify
            </Link>
            <Link
              to="/protect-yourself"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <FaUserShield /> Protect Yourself
            </Link>
          </div>
        </section>

        {/* Essential Tips for Staying Safe Section */}
        <section className="my-16">
          <h3 className="text-4xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-3">
            <FaRegLightbulb className="text-yellow-500" /> Essential Tips for Staying Safe
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimateOnScroll from={{ opacity: 0, y: 50 }} to={{ opacity: 1, y: 0 }} delay={100} duration={0.7} start="top 90%">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-left h-full">
                <h4 className="text-xl font-bold text-blue-700 mb-3 flex items-center gap-2"><FaLock className="text-xl" /> Verify Sender Identity</h4>
                <p className="text-gray-700">
                  Always **double-check the sender's email address** for misspellings or unusual domains. Scammers often use very similar-looking addresses.
                </p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll from={{ opacity: 0, y: 50 }} to={{ opacity: 1, y: 0 }} delay={200} duration={0.7} start="top 90%">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-left h-full">
                <h4 className="text-xl font-bold text-blue-700 mb-3 flex items-center gap-2"><FaLock className="text-xl" /> Hover Over Links</h4>
                <p className="text-gray-700">
                  Before clicking, **hover your mouse over any link** to see the actual URL. If it doesn't match the sender's apparent domain, it's likely a scam.
                </p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll from={{ opacity: 0, y: 50 }} to={{ opacity: 1, y: 0 }} delay={300} duration={0.7} start="top 90%">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-left h-full">
                <h4 className="text-xl font-bold text-blue-700 mb-3 flex items-center gap-2"><FaLock className="text-xl" /> Beware of Urgency</h4>
                <p className="text-gray-700">
                  Scammers often create a **sense of urgency or threat** to pressure you into acting without thinking. Take a moment to verify any urgent requests.
                </p>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll from={{ opacity: 0, y: 50 }} to={{ opacity: 1, y: 0 }} delay={400} duration={0.7} start="top 90%">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-left h-full">
                <h4 className="text-xl font-bold text-blue-700 mb-3 flex items-center gap-2"><FaLock className="text-xl" /> Report & Delete</h4>
                <p className="text-gray-700">
                  If you receive a suspicious email, **report it** to your email provider and then **delete it immediately**. Never engage with scammers.
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </AnimateOnScroll>
    </div>
  );
};

export default HomePage;