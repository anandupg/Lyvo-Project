'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Home, 
  Shield, 
  DollarSign, 
  Settings, 
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Star,
  MapPin,
  MessageCircle,
  FileText,
  BarChart3,
  Activity,
  UserCheck,
  UserX,
  Building,
  CreditCard
} from 'lucide-react';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { useLoading } from '../../hooks/useLoading';
import LoadingOverlay from '../../components/LoadingOverlay';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function AdminDashboard() {
  const { isLoading, withLoading } = useLoading();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Total Users', value: '2,847', icon: Users, change: '+156', color: 'text-blue-600' },
    { title: 'Active Properties', value: '1,234', icon: Home, change: '+23', color: 'text-green-600' },
    { title: 'Platform Revenue', value: '₹45.2L', icon: DollarSign, change: '+18%', color: 'text-purple-600' },
    { title: 'Verification Rate', value: '94%', icon: Shield, change: '+2%', color: 'text-orange-600' }
  ];

  const pendingVerifications = [
    { id: 1, type: 'Property Owner', name: 'Rajesh Kumar', email: 'rajesh@email.com', status: 'Pending', date: '2 hours ago' },
    { id: 2, type: 'Property', name: 'Sunshine PG', owner: 'Priya Sharma', status: 'Under Review', date: '4 hours ago' },
    { id: 3, type: 'Property Owner', name: 'Amit Patel', email: 'amit@email.com', status: 'Pending', date: '6 hours ago' },
    { id: 4, type: 'Property', name: 'Green Valley', owner: 'Rahul Singh', status: 'Under Review', date: '1 day ago' }
  ];

  const recentActivities = [
    { user: 'New property listed', action: 'Sunshine PG by Priya Sharma', time: '2 hours ago', type: 'success' },
    { user: 'Payment processed', action: '₹12,000 for Sunrise PG', time: '4 hours ago', type: 'success' },
    { user: 'Dispute reported', action: 'Maintenance issue at Green Valley', time: '6 hours ago', type: 'warning' },
    { user: 'User banned', action: 'Spam account removed', time: '1 day ago', type: 'error' }
  ];

  const platformMetrics = [
    { metric: 'User Growth', value: '+12%', trend: 'up', period: 'This month' },
    { metric: 'Property Listings', value: '+8%', trend: 'up', period: 'This month' },
    { metric: 'Booking Success', value: '89%', trend: 'up', period: 'This month' },
    { metric: 'Support Tickets', value: '-15%', trend: 'down', period: 'This month' }
  ];

  const topPerformingAreas = [
    { area: 'Koramangala, Bangalore', properties: 156, bookings: 234, revenue: '₹12.5L' },
    { area: 'HSR Layout, Bangalore', properties: 98, bookings: 167, revenue: '₹8.9L' },
    { area: 'Indiranagar, Bangalore', properties: 87, bookings: 145, revenue: '₹7.2L' },
    { area: 'Whitefield, Bangalore', properties: 76, bookings: 123, revenue: '₹6.8L' }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        {/* Dashboard Header */}
        <div className="pt-16 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">Platform overview and management</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Reports</span>
              </button>
              <button className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Verifications */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Pending Verifications</h2>
                <Link href="/dashboard/admin/verifications" className="text-red-600 hover:text-red-700 text-sm font-medium">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {pendingVerifications.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          item.type === 'Property Owner' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          {item.type === 'Property Owner' ? (
                            <UserCheck className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Building className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            {item.type === 'Property Owner' ? item.email : `Owner: ${item.owner}`}
                          </p>
                          <p className="text-xs text-gray-500">{item.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.status}
                        </span>
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-400 hover:text-green-600">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600">
                            <XCircle className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 border border-gray-100 rounded-lg">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'success' ? 'bg-green-100' :
                      activity.type === 'warning' ? 'bg-yellow-100' :
                      'bg-red-100'
                    }`}>
                      {activity.type === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : activity.type === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Platform Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Metrics</h2>
              <div className="space-y-4">
                {platformMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{metric.metric}</p>
                      <p className="text-xs text-gray-500">{metric.period}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">{metric.value}</span>
                      <TrendingUp className={`h-4 w-4 ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Areas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Areas</h2>
              <div className="space-y-4">
                {topPerformingAreas.map((area, index) => (
                  <div key={index} className="p-3 border border-gray-100 rounded-lg">
                    <h3 className="font-medium text-gray-900 text-sm">{area.area}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs text-gray-600">
                        <p>{area.properties} properties</p>
                        <p>{area.bookings} bookings</p>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">{area.revenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 text-left">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-gray-900">Review Verifications</span>
                  </div>
                </button>
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 text-left">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-gray-900">Support Tickets</span>
                  </div>
                </button>
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 text-left">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-gray-900">Financial Reports</span>
                  </div>
                </button>
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 text-left">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-gray-900">User Management</span>
                  </div>
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Healthy</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payment Gateway</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Service</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Running</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        <Footer />
        
        {/* Global Loading Overlay */}
        <LoadingOverlay 
          isVisible={isLoading} 
          message="Processing..." 
        />
      </div>
    </ProtectedRoute>
  );
} 