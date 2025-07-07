import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../api/apiService';
import toast from 'react-hot-toast';

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const response = await apiService.get('/api/v1/orders/my-orders');
                setOrders(response.data);
            } catch (error) {
                toast.error("Could not fetch order history.");
                console.error("Error fetching order history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderHistory();
    }, []);

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
    }).format(price || 0);
    
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB');

    const getStatusColor = (status) => {
        const statusColors = {
            'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'processing': 'bg-blue-100 text-blue-800 border-blue-200',
            'shipped': 'bg-purple-100 text-purple-800 border-purple-200',
            'delivered': 'bg-green-100 text-green-800 border-green-200',
            'cancelled': 'bg-red-100 text-red-800 border-red-200',
            'completed': 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
        return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusIcon = (status) => {
        const icons = {
            'pending': '⏳',
            'processing': '⚙️',
            'shipped': '🚚',
            'delivered': '✅',
            'cancelled': '❌',
            'completed': '🎉'
        };
        return icons[status?.toLowerCase()] || '📦';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 font-medium">Loading your order history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                            My Order History
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Track and manage all your orders in one place
                        </p>
                        {orders.length > 0 && (
                            <div className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-50 rounded-full">
                                <span className="text-indigo-600 font-semibold">
                                    {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Found
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {orders.length > 0 ? (
                    <div className="grid gap-6 md:gap-8">
                        {orders.map((order, index) => (
                            <Link 
                                key={order.orderId} 
                                to={`/orders/${order.orderId}`} 
                                className="group block transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                            >
                                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 group-hover:border-indigo-300 transition-all duration-300 overflow-hidden">
                                    {/* Order Header */}
                                    <div className="bg-gradient-to-r from-gray-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                                    <span className="text-xl">{getStatusIcon(order.orderStatus)}</span>
                                                </div>
                                                <div>
                                                    <h2 className="font-bold text-xl text-gray-900">
                                                        Order #{order.orderId}
                                                    </h2>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <span>📅</span>
                                                        Placed on {formatDate(order.orderDate)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:items-end gap-2">
                                                <span className={`inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-full border ${getStatusColor(order.orderStatus)}`}>
                                                    {order.orderStatus}
                                                </span>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500">Total Amount</p>
                                                    <p className="font-bold text-2xl text-indigo-600">
                                                        {formatPrice(order.totalAmount)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Body */}
                                    <div className="px-6 py-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                {/* Progress indicator based on status */}
                                                <div className="flex items-center gap-2">
                                                    {['pending', 'processing', 'shipped', 'delivered'].map((step, stepIndex) => {
                                                        const currentStatusIndex = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.orderStatus?.toLowerCase());
                                                        const isActive = stepIndex <= currentStatusIndex;
                                                        const isCurrent = stepIndex === currentStatusIndex;
                                                        
                                                        return (
                                                            <div key={step} className="flex items-center">
                                                                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                                    isCurrent ? 'bg-indigo-500 ring-4 ring-indigo-200' :
                                                                    isActive ? 'bg-indigo-400' : 'bg-gray-200'
                                                                }`}></div>
                                                                {stepIndex < 3 && (
                                                                    <div className={`w-8 h-0.5 mx-1 ${isActive ? 'bg-indigo-300' : 'bg-gray-200'}`}></div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center text-indigo-600 font-semibold group-hover:text-indigo-700 transition-colors">
                                                <span className="mr-2">View Details</span>
                                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover effect gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none rounded-3xl"></div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-6xl">📦</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h2>
                            <p className="text-gray-600 mb-8">
                                You haven't placed any orders yet. Start shopping to see your order history here.
                            </p>
                            <Link 
                                to="/shop" 
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <span>Start Shopping</span>
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}