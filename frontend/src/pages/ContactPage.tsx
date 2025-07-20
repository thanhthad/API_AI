import React, { useState } from 'react';
// Đã bỏ AnimateOnScroll vì bạn không muốn hiệu ứng này
// import AnimateOnScroll from '../components/AnimateOnScroll'; // Không cần nữa

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Sending message...');
    setIsSuccess(false);

    try {
      const response = await fetch('http://62.146.236.71:8080/api/contact/send', { // URL của API Spring Boot
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatusMessage('Message sent successfully!');
        setIsSuccess(true);
        setFormData({ name: '', email: '', message: '' }); // Clear form
      } else {
        const errorText = await response.text();
        setStatusMessage(`Failed to send message: ${errorText}`);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatusMessage('Network error. Please try again later.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Tiêu đề trang */}
        <h2 className="text-5xl font-extrabold text-center text-blue-800 mb-12 drop-shadow-lg">
          Contact Us
        </h2>

        {/* Phần thông tin liên hệ */}
        <section className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl mb-12 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-4xl font-bold text-gray-900 mb-6 text-center">We're Here to Help</h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center max-w-2xl mx-auto">
            If you have questions, feedback, or need assistance, please don't hesitate to reach out. We're always happy to hear from you!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Email */}
            <div className="flex flex-col items-center">
              <svg className="w-10 h-10 text-blue-600 mb-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Email Us</h4>
              <p className="text-md text-gray-600">
                <a href="mailto:support@emailshield.com" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">
                  support@emailshield.com
                </a>
              </p>
            </div>
            {/* Phone */}
            <div className="flex flex-col items-center">
              <svg className="w-10 h-10 text-blue-600 mb-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 1.48a1 1 0 01-.542 1.353l-1.765.881a1 1 0 00-.5.501l.034.067a.999.999 0 00.418.529l.067.034a1 1 0 00.501-.5l.881-1.765a1 1 0 011.353-.542l1.48.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 6 16.18 6 13.82V9.5a1 1 0 011-1h.5"></path></svg>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Call Us</h4>
              <p className="text-md text-gray-600">+1 (555) 123-4567</p>
            </div>
            {/* Address */}
            <div className="flex flex-col items-center">
              <svg className="w-10 h-10 text-blue-600 mb-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 110-4 2 2 0 010 4z" clipRule="evenodd"></path></svg>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Our Location</h4>
              <p className="text-md text-gray-600">123 Cyber Security Lane, InfoCity, IS 12345</p>
            </div>
          </div>
        </section>

        {/* Phần gửi tin nhắn */}
        <section className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
          <h3 className="text-4xl font-bold text-gray-900 mb-8 text-center">Send Us a Message</h3>
          <form className="max-w-xl mx-auto space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-gray-700 text-lg font-medium mb-2">Your Name:</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-200" 
                placeholder="Enter your name"
                required 
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-lg font-medium mb-2">Your Email:</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-200" 
                placeholder="Enter your email address"
                required 
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 text-lg font-medium mb-2">Message:</label>
              <textarea 
                id="message" 
                name="message" 
                rows={6} // Tăng số hàng để có không gian viết nhiều hơn
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-200 resize-y" // resize-y cho phép thay đổi chiều cao
                placeholder="Type your message here..."
                required
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Send Message
            </button>
            {statusMessage && (
              <p className={`mt-4 text-center text-lg font-medium ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                {statusMessage}
              </p>
            )}
          </form>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;