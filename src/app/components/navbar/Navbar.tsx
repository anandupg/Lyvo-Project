'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, User, Settings, Home, Info, Briefcase, Phone, Search, Bell, LogOut } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { signOut } from '@/lib/firebase';
import { useJWT } from '@/hooks/useJWT';

export default function Navbar() {
  const { user, loading } = useAuth();
  const { logout: jwtLogout } = useJWT();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent body scroll when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Clean up body scroll
      document.body.style.overflow = 'unset';
    };
  }, []);

  const menuItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About', icon: Info },
    { href: '/services', label: 'Services', icon: Briefcase },
    { href: '/contact', label: 'Contact', icon: Phone },
  ];

  const handleSignOut = async () => {
    try {
      // Sign out from Firebase
      await signOut();
      
      // Also logout from JWT
      await jwtLogout();
      
      // The AuthContext will automatically update the user state
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-white/90 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <span className="text-white font-bold text-lg lg:text-xl">L</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">Lyvo+</span>
                  <span className="text-xs text-gray-500 font-medium hidden sm:block">Co-Living Platform</span>
                </div>
              </Link>
            </div>

            {/* Mobile Profile Section - Only show when user is authenticated */}
            {!loading && user && (
              <div className="lg:hidden flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-2 py-1.5 bg-gray-50 rounded-lg">
                  <div className="w-7 h-7 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">
                      {(user.displayName || user.email)?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="block">
                    <p className="text-xs font-medium text-gray-900 truncate max-w-20">
                      {user.displayName || user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="relative px-4 py-2 text-gray-700 hover:text-red-600 transition-all duration-300 font-medium group"
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className="absolute inset-0 bg-red-50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                </Link>
              ))}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search Button */}
              <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                <Search className="h-5 w-5" />
              </button>
              
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                <Bell className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </button>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-3 ml-4">
                {!loading && !user ? (
                  <>
                    <Link 
                      href="/auth/login"
                      className="px-4 py-2 text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/auth/register"
                      className="relative px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <span className="relative z-10">Get Started</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  </>
                ) : user ? (
                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={toggleProfileDropdown}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {(user.displayName || user.email)?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="hidden sm:block">{user.displayName || user.email}</span>
                    </button>
                    
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.displayName || user.email}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            handleSignOut();
                            setIsProfileDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-8 h-8">
                    <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="relative z-50 p-2 text-gray-700 hover:text-red-600 transition-all duration-300 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-6">
                  <span 
                    className={`absolute top-1/2 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ease-out ${
                      isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1'
                    }`}
                  />
                  <span 
                    className={`absolute top-1/2 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ease-out ${
                      isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                    }`}
                  />
                  <span 
                    className={`absolute top-1/2 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ease-out ${
                      isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
        isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={closeMenu}
        />
        
        {/* Mobile Menu */}
        <div className={`absolute inset-y-0 right-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">L</span>
                </div>
                <div>
                  <span className="text-lg font-semibold text-gray-900">Lyvo+</span>
                </div>
              </div>
              <button
                onClick={closeMenu}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 px-4 py-3 overflow-y-auto">
              <div className="space-y-1">
                {menuItems.map((item, index) => (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium group"
                    onClick={closeMenu}
                  >
                    <item.icon className="h-4 w-4 text-gray-500 group-hover:text-red-500" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="my-4 border-t border-gray-100"></div>

              {/* Quick Actions */}
              <div className="space-y-1">
                <button className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium group w-full">
                  <Search className="h-4 w-4 text-gray-500 group-hover:text-red-500" />
                  <span className="text-sm">Search</span>
                </button>
                
                <button className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium group w-full">
                  <div className="relative">
                    <Bell className="h-4 w-4 text-gray-500 group-hover:text-red-500" />
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-sm">Notifications</span>
                </button>
              </div>

              {/* Divider */}
              <div className="my-4 border-t border-gray-100"></div>

              {/* Auth Section */}
              <div className="space-y-2">
                {!loading && !user ? (
                  <>
                    <Link 
                      href="/auth/login"
                      className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium group"
                      onClick={closeMenu}
                    >
                      <User className="h-4 w-4 text-gray-500 group-hover:text-red-500" />
                      <span className="text-sm">Sign In</span>
                    </Link>
                    
                    <Link 
                      href="/auth/register"
                      className="flex items-center justify-center px-3 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm"
                      onClick={closeMenu}
                    >
                      <span className="text-sm">Get Started</span>
                    </Link>
                  </>
                ) : user ? (
                  <>
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.displayName || user.email}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium group"
                      onClick={closeMenu}
                    >
                      <Settings className="h-4 w-4 text-gray-500 group-hover:text-red-500" />
                      <span className="text-sm">Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        closeMenu();
                      }}
                      className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium group w-full"
                    >
                      <LogOut className="h-4 w-4 text-gray-500 group-hover:text-red-500" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500">© 2024 Lyvo+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}