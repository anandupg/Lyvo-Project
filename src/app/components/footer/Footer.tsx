'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base">L</span>
              </div>
              <span className="text-lg font-bold">Lyvo+</span>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">
              Empowering communities through innovative co-living solutions. 
              Join us in creating meaningful connections and sustainable living spaces.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-200">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/" className="text-gray-300 hover:text-red-500 transition-colors duration-200 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-red-500 transition-colors duration-200 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-red-500 transition-colors duration-200 text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-red-500 transition-colors duration-200 text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-gray-300 hover:text-red-500 transition-colors duration-200 text-sm">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Services</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/services/co-living" className="text-gray-300 hover:text-red-500 transition-colors duration-200 text-sm">
                  Co-Living Spaces
                </Link>
              </li>
              <li>
                <Link href="/services/community" className="text-gray-300 hover:text-red-500 transition-colors duration-200 text-sm">
                  Community Building
                </Link>
              </li>
              <li>
                <Link href="/services/events" className="text-gray-300 hover:text-red-500 transition-colors duration-200 text-sm">
                  Events & Activities
                </Link>
              </li>
              <li>
                <Link href="/services/support" className="text-gray-300 hover:text-red-500 transition-colors duration-200 text-sm">
                  24/7 Support
                </Link>
              </li>
              <li>
                <Link href="/services/amenities" className="text-gray-300 hover:text-red-500 transition-colors duration-200 text-sm">
                  Premium Amenities
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-red-500" />
                <span className="text-gray-300 text-sm">hello@lyvoplus.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-red-500" />
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  123 Innovation Street<br />
                  Tech City, TC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Lyvo+. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-red-500 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-red-500 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-red-500 transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 