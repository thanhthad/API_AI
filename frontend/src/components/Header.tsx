import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';

// Import Headless UI components for Mobile Menu
import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const headerRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLLIElement[]>([]); // Ref cho các nav links
  const logoRef = useRef<HTMLAnchorElement>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // GSAP Animation cho Header (Logo và Nav Links)
    gsap.fromTo(headerRef.current, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
    gsap.fromTo(logoRef.current, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6, delay: 0.3, ease: 'power2.out' });

    // Staggered animation cho các nav links
    gsap.fromTo(navLinksRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.1, // Hiệu ứng trễ giữa mỗi link
        delay: 0.5,
      }
    );
  }, []);

  // Hàm để thêm ref vào mỗi item trong map
  const addLinkRef = (el: HTMLLIElement) => {
    if (el && !navLinksRef.current.includes(el)) {
      navLinksRef.current.push(el);
    }
  };

  const navItems = [
    { name: 'About Scams', path: '/about-scams' },
    { name: 'Identify Scams', path: '/how-to-identify' },
    { name: 'Protect Yourself', path: '/protect-yourself' },
    { name: 'Report Scam', path: '/report-scam' },
    { name: 'Contact', path: '/contact' },
  ];

  const loggedInNavItems = [
    { name: 'Analyze Email', path: '/analyze' },
    { name: 'History', path: '/history' },
    // --- START: Domain Links Added ---
    { name: 'Analyze Domain', path: '/analyze-domain' },
    { name: 'Domain History', path: '/domain-history' },
    // --- END: Domain Links Added ---
  ];

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 shadow-lg z-50"
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold flex items-center gap-2 hover:text-blue-200 transition-colors duration-300"
          ref={logoRef}
        >
          EmailShield
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6 items-center">
            {navItems.map((item, index) => (
              <li key={index} ref={addLinkRef}>
                <Link
                  to={item.path}
                  className="hover:text-blue-200 transition-all duration-300 transform hover:scale-105"
                >
                  {item.name}
                </Link>
              </li>
            ))}

            {user.userId ? (
              <>
                {loggedInNavItems.map((item, index) => (
                  <li key={`logged-${index}`} ref={addLinkRef}>
                    <Link
                      to={item.path}
                      className="hover:text-blue-200 transition-all duration-300 transform hover:scale-105"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li className="text-blue-200" ref={addLinkRef}>
                  Hello, {user.username}!
                </li>
                <li ref={addLinkRef}>
                  <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
                    onMouseEnter={() => gsap.to(".logout-btn", { scale: 1.05, duration: 0.2 })}
                    onMouseLeave={() => gsap.to(".logout-btn", { scale: 1, duration: 0.2 })}
                  >
                    <span className="logout-btn">Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <li ref={addLinkRef}>
                <Link
                  to="/auth"
                  className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
                  onMouseEnter={() => gsap.to(".login-btn", { scale: 1.05, duration: 0.2 })}
                  onMouseLeave={() => gsap.to(".login-btn", { scale: 1, duration: 0.2 })}
                >
                  <span className="login-btn">Login / Register</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile Navigation (using Headless UI Popover) */}
        <div className="md:hidden flex items-center">
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button
                  className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-100 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="sr-only">Open main menu</span>
                  {/* Sử dụng text hoặc SVG icon đơn giản thay vì React Icons */}
                  {open ? (
                    <svg className="block h-8 w-8 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="block h-8 w-8 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </Popover.Button>

                <Transition
                  as={Fragment}
                  enter="duration-200 ease-out"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="duration-100 ease-in"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Popover.Panel className="absolute right-0 mt-3 w-64 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none bg-blue-800 p-4">
                    <div className="flex flex-col space-y-4">
                      {navItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.path}
                          className="text-white hover:text-blue-200 hover:bg-blue-700 px-3 py-2 rounded-md transition-colors duration-300"
                          onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                        >
                          {item.name}
                        </Link>
                      ))}

                      {user.userId ? (
                        <>
                          {loggedInNavItems.map((item, index) => (
                            <Link
                              key={`mobile-logged-${index}`}
                              to={item.path}
                              className="text-white hover:text-blue-200 hover:bg-blue-700 px-3 py-2 rounded-md transition-colors duration-300"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          ))}
                          <div className="text-blue-200 px-3 py-2">
                            Hello, {user.username}!
                          </div>
                          <button
                            onClick={() => {
                              logout();
                              setIsMobileMenuOpen(false); // Close menu after logout
                            }}
                            className="w-full text-left bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
                          >
                            Logout
                          </button>
                        </>
                      ) : (
                        <Link
                          to="/auth"
                          className="w-full text-center bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Login / Register
                        </Link>
                      )}
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default Header;