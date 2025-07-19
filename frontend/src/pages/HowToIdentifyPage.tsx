import React from 'react';
import AnimateOnScroll from '../components/AnimateOnScroll';

const HowToIdentifyPage: React.FC = () => {
  return (
    <div className="container mx-auto p-8 text-gray-800">
      <AnimateOnScroll>
        <h2 className="text-4xl font-bold text-center text-blue-800 mb-8">How to Identify Email Scams</h2>
      </AnimateOnScroll>

      <AnimateOnScroll delay={200}>
        <section className="my-10 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-3xl font-semibold text-gray-900 mb-4">1. Check the Sender's Email Address</h3>
          <p className="text-lg leading-relaxed mb-4">
            This is often the easiest way to spot a fake. Scammers frequently use email addresses that are similar to legitimate ones but have subtle differences (e.g., `support@paypa1.com` instead of `support@paypal.com`). Always hover over the sender's name to reveal the actual email address, or inspect the full email headers.
          </p>
          <img src="/src/assets/sender-check.png" alt="Check Sender Email" className="my-4 rounded-lg shadow-md max-w-full h-auto" />
        </section>
      </AnimateOnScroll>

      <AnimateOnScroll delay={400}>
        <section className="my-10 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-3xl font-semibold text-gray-900 mb-4">2. Look for Generic Greetings</h3>
          <p className="text-lg leading-relaxed mb-4">
            Legitimate companies usually address you by your name. Phishing emails often use generic greetings like "Dear Customer," "Dear User," or "To Our Valued Member."
          </p>
        </section>
      </AnimateOnScroll>

      <AnimateOnScroll delay={600}>
        <section className="my-10 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-3xl font-semibold text-gray-900 mb-4">3. Beware of Urgency or Threats</h3>
          <p className="text-lg leading-relaxed mb-4">
            Scammers often create a sense of urgency or fear to pressure you into acting quickly without thinking. Phrases like "Your account will be suspended," "Immediate action required," or "Failure to respond will result in..." are red flags.
          </p>
        </section>
      </AnimateOnScroll>

      <AnimateOnScroll delay={800}>
        <section className="my-10 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-3xl font-semibold text-gray-900 mb-4">4. Hover Over Links (Don't Click!)</h3>
          <p className="text-lg leading-relaxed mb-4">
            Before clicking any link, hover your mouse over it (on desktop) or long-press it (on mobile) to see the actual URL. If the URL doesn't match the sender's legitimate website, it's likely a scam.
          </p>
          <img src="/src/assets/hover-link.png" alt="Hover Over Link" className="my-4 rounded-lg shadow-md max-w-full h-auto" />
        </section>
      </AnimateOnScroll>

      <AnimateOnScroll delay={1000}>
        <section className="my-10 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-3xl font-semibold text-gray-900 mb-4">5. Poor Grammar and Spelling</h3>
          <p className="text-lg leading-relaxed mb-4">
            While not always present, many phishing emails contain noticeable grammatical errors, typos, or awkward phrasing. Legitimate organizations typically proofread their communications carefully.
          </p>
        </section>
      </AnimateOnScroll>

      <AnimateOnScroll delay={1200}>
        <section className="my-10 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-3xl font-semibold text-gray-900 mb-4">6. Requests for Personal Information</h3>
          <p className="text-lg leading-relaxed mb-4">
            Legitimate companies will almost never ask for sensitive information (like passwords, PINs, or full credit card numbers) via email. Be suspicious of any email requesting this data.
          </p>
        </section>
      </AnimateOnScroll>

      <AnimateOnScroll delay={1400}>
        <section className="my-10 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-3xl font-semibold text-gray-900 mb-4">7. Unexpected Attachments</h3>
          <p className="text-lg leading-relaxed mb-4">
            Be cautious of unexpected attachments, especially if they are `.zip`, `.exe`, or other executable files. These can contain malware.
          </p>
        </section>
      </AnimateOnScroll>
    </div>
  );
};

export default HowToIdentifyPage;