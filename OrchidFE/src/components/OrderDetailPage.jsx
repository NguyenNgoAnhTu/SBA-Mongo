import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../api/apiService';
import toast from 'react-hot-toast';
import { ChevronRight, Package, MapPin, User, Calendar, FileText, ArrowLeft, Truck, CreditCard } from 'lucide-react';

export default function OrderDetailsPage() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { orderId } = useParams(); // Lấy orderId từ URL

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) return;
            try {
                // Chỉ cần gọi API lấy chi tiết của một đơn hàng
                const response = await apiService.get(`/api/v1/orders/${orderId}`);
                setOrder(response.data);
            } catch (error) {
                toast.error("Could not fetch order details.");
                console.error("Error fetching order details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    const formatDate = (dateString) => new Date(dateString).toLocaleString('en-GB');

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-xl font-medium text-gray-700">Loading Order Details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl font-medium text-gray-700">Order not found.</p>
                    <Link 
                        to="/order-history" 
                        className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Enhanced Breadcrumb */}
                <nav className="mb-8" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2 text-sm">
                        <li>
                            <Link 
                                to="/home" 
                                className="flex items-center text-gray-500 hover:text-indigo-600 font-medium transition-colors"
                            >
                                Home
                            </Link>
                        </li>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <li>
                            <Link 
                                to="/order-history" 
                                className="flex items-center text-gray-500 hover:text-indigo-600 font-medium transition-colors"
                            >
                                Order History
                            </Link>
                        </li>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <li className="text-indigo-600 font-semibold">Order #{order.orderId}</li>
                    </ol>
                </nav>

                {/* Main Content Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                        <div className="flex flex-col sm:flex-row justify-between items-start">
                            <div>
                                <h1 className="font-bold text-4xl mb-2">Order #{order.orderId}</h1>
                                <div className="flex items-center text-indigo-100">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>Placed on: {formatDate(order.orderDate)}</span>
                                </div>
                            </div>
                            <span className={`px-6 py-3 text-sm font-bold rounded-full border-2 ${
                                order.orderStatus === 'COMPLETED' ? 'bg-green-500 border-green-400 text-white' :
                                order.orderStatus === 'CANCELLED' ? 'bg-red-500 border-red-400 text-white' :
                                'bg-yellow-500 border-yellow-400 text-white'
                            }`}>
                                {order.orderStatus}
                            </span>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Items Section */}
                        <div className="mb-8">
                            <div className="flex items-center mb-6">
                                <Package className="h-6 w-6 text-indigo-600 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-800">Items Ordered</h2>
                            </div>
                            <div className="space-y-4">
                                {order.orderDetails.map(detail => (
                                    <div key={detail.orchidId} className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100">
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                <img 
                                                    src={detail.orchidImageUrl} 
                                                    alt={detail.orchidName} 
                                                    className="w-24 h-24 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow"
                                                />
                                                <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                                                    {detail.quantity}
                                                </div>
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="font-bold text-xl text-gray-800 mb-1">{detail.orchidName}</h3>
                                                <p className="text-gray-600 font-medium">Quantity: {detail.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-indigo-600">{formatPrice(detail.price)}</p>
                                                <p className="text-sm text-gray-500 font-medium">
                                                    Subtotal: <span className="font-bold text-gray-700">{formatPrice(detail.price * detail.quantity)}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Information Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Shipping Address */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                                <div className="flex items-center mb-4">
                                    <Truck className="h-6 w-6 text-blue-600 mr-3" />
                                    <h3 className="font-bold text-xl text-gray-800">Shipping Address</h3>
                                </div>
                                <p className="text-gray-700 font-medium leading-relaxed">{order.shippingAddress}</p>
                            </div>

                            {/* Customer Information */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                                <div className="flex items-center mb-4">
                                    <User className="h-6 w-6 text-green-600 mr-3" />
                                    <h3 className="font-bold text-xl text-gray-800">Customer</h3>
                                </div>
                                <p className="text-gray-700 font-medium">{order.customerName}</p>
                            </div>
                        </div>

                        {/* Order Note */}
                        {order.note && (
                            <div className="mb-8">
                                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                                    <div className="flex items-center mb-4">
                                        <FileText className="h-6 w-6 text-yellow-600 mr-3" />
                                        <h3 className="font-bold text-xl text-gray-800">Order Note</h3>
                                    </div>
                                    <p className="text-gray-700 font-medium leading-relaxed italic">{order.note}</p>
                                </div>
                            </div>
                        )}

                        {/* Total Amount */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <CreditCard className="h-8 w-8 mr-4" />
                                    <span className="text-2xl font-bold">Total Amount</span>
                                </div>
                                <span className="text-4xl font-bold">{formatPrice(order.totalAmount)}</span>
                            </div>
                        </div>

                        {/* Back Button */}
                        <div className="mt-8 text-center">
                            <Link 
                                to="/order-history"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <ArrowLeft className="h-5 w-5 mr-3" />
                                Back to Order History
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}