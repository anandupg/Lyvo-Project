'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  Users, 
  Calendar, 
  DollarSign, 
  Settings, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Star,
  MapPin,
  Wifi,
  Car,
  Utensils,
  MessageCircle,
  FileText,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { useLoading } from '../../hooks/useLoading';
import LoadingOverlay from '../../components/LoadingOverlay';

export default function OwnerDashboard() {
  const { isLoading, withLoading } = useLoading();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Total Properties', value: '8', icon: Home, change: '+2', color: 'text-blue-600' },
    { title: 'Active Tenants', value: '24', icon: Users, change: '+3', color: 'text-green-600' },
    { title: 'Monthly Revenue', value: '₹2.4L', icon: DollarSign, change: '+15%', color: 'text-purple-600' },
    { title: 'Occupancy Rate', value: '92%', icon: TrendingUp, change: '+5%', color: 'text-orange-600' }
  ];

  const properties = [
    {
      id: 1,
      name: "Sunrise PG - Koramangala",
      location: "Koramangala, Bangalore",
      type: "PG/Hostel",
      occupancy: "18/20",
      revenue: "₹85,000",
      status: "Active",
      rating: "4.6",
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      name: "Green Valley Co-living",
      location: "HSR Layout, Bangalore",
      type: "Co-living",
      occupancy: "12/15",
      revenue: "₹65,000",
      status: "Active",
      rating: "4.8",
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      name: "Student Hub - Indiranagar",
      location: "Indiranagar, Bangalore",
      type: "Student Housing",
      occupancy: "8/10",
      revenue: "₹45,000",
      status: "Active",
      rating: "4.4",
      image: "/api/placeholder/300/200"
    }
  ];

  const recentBookings = [
    { tenant: 'Rahul Kumar', property: 'Sunrise PG', date: 'Dec 15, 2024', amount: '₹12,000', status: 'Confirmed' },
    { tenant: 'Priya Sharma', property: 'Green Valley', date: 'Dec 14, 2024', amount: '₹15,000', status: 'Pending' },
    { tenant: 'Amit Patel', property: 'Student Hub', date: 'Dec 13, 2024', amount: '₹10,000', status: 'Confirmed' }
  ];

  const maintenanceRequests = [
    { id: 1, property: 'Sunrise PG', issue: 'AC not working', priority: 'High', status: 'In Progress' },
    { id: 2, property: 'Green Valley', issue: 'Water leakage', priority: 'Medium', status: 'Pending' },
    { id: 3, property: 'Student Hub', issue: 'WiFi issue', priority: 'Low', status: 'Resolved' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Dashboard Header */}
      <div className="pt-16 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">Manage your properties and track performance</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
              <button className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Property</span>
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
          {/* Properties List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">My Properties</h2>
                <Link href="/dashboard/owner/properties" className="text-red-600 hover:text-red-700 text-sm font-medium">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {properties.map((property) => (
                  <div key={property.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg"></div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{property.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-600">{property.location}</span>
                          </div>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-600">{property.type}</span>
                            <span className="text-sm text-gray-600">• {property.occupancy} occupied</span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-sm text-gray-600">{property.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{property.revenue}/month</p>
                        <p className="text-sm text-green-600">{property.status}</p>
                        <div className="flex space-x-2 mt-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
              <div className="space-y-3">
                {recentBookings.map((booking, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{booking.tenant}</p>
                      <p className="text-sm text-gray-600">{booking.property}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{booking.amount}</p>
                      <p className="text-sm text-gray-600">{booking.date}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 text-left">
                  <div className="flex items-center space-x-3">
                    <Plus className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-gray-900">Add New Property</span>
                  </div>
                </button>
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 text-left">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-gray-900">Manage Tenants</span>
                  </div>
                </button>
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 text-left">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-gray-900">View Earnings</span>
                  </div>
                </button>
                <button className="w-full p-3 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 text-left">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-gray-900">Schedule Viewing</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Maintenance Requests */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Requests</h2>
              <div className="space-y-3">
                {maintenanceRequests.map((request) => (
                  <div key={request.id} className="p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{request.property}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        request.priority === 'High' ? 'bg-red-100 text-red-800' :
                        request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {request.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{request.issue}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      request.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                      request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <span className="font-semibold text-gray-900">4.6/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="font-semibold text-gray-900">2.3 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Renewal Rate</span>
                  <span className="font-semibold text-gray-900">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Vacancy Rate</span>
                  <span className="font-semibold text-gray-900">8%</span>
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
  );
} 