'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Home, 
  Shield, 
  ArrowRight,
  Building,
  Settings,
  BarChart3,
  UserCheck
} from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

export default function DashboardSelection() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const dashboardOptions = [
    {
      id: 'seeker',
      title: 'Room Seeker',
      description: 'Find and book your perfect co-living space',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      features: [
        'Browse verified properties',
        'Smart roommate matching',
        'Easy booking process',
        '24/7 support'
      ],
      link: '/'
    },
    {
      id: 'owner',
      title: 'Property Owner',
      description: 'Manage your properties and maximize earnings',
      icon: Building,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      features: [
        'Property management',
        'Tenant management',
        'Revenue tracking',
        'Maintenance requests'
      ],
      link: '/dashboard/owner'
    },
    {
      id: 'admin',
      title: 'Platform Admin',
      description: 'Oversee platform operations and user management',
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      features: [
        'User verification',
        'Platform analytics',
        'Support management',
        'System monitoring'
      ],
      link: '/dashboard/admin'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header Section */}
      <div className="pt-16 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the dashboard that best fits your role and start managing your co-living experience
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Options */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dashboardOptions.map((option) => (
            <div
              key={option.id}
              className={`relative bg-white rounded-xl shadow-sm border-2 ${option.borderColor} p-8 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                selectedRole === option.id ? 'ring-2 ring-red-500 ring-opacity-50' : ''
              }`}
              onClick={() => setSelectedRole(option.id)}
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center mb-6`}>
                <option.icon className="h-8 w-8 text-white" />
              </div>

              {/* Content */}
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{option.title}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{option.description}</p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {option.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <Link
                href={option.link}
                className={`inline-flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r ${option.color} text-white font-medium rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105`}
              >
                <span>Access Dashboard</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              {/* Selection Indicator */}
              {selectedRole === option.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Access Links */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/"
              className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-red-600" />
                <span className="font-medium text-gray-900 group-hover:text-red-700">Browse Properties</span>
              </div>
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <UserCheck className="h-5 w-5 text-red-600" />
                <span className="font-medium text-gray-900 group-hover:text-red-700">Sign In</span>
              </div>
            </Link>
            <Link
              href="/auth/register"
              className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-red-600" />
                <span className="font-medium text-gray-900 group-hover:text-red-700">Create Account</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 