import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiService from '../api/apiService';

// --- Icons ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const MinusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const ShoppingBagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" /></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const navigate = useNavigate();

    // State cho form đặt hàng và trạng thái loading
    const [shippingAddress, setShippingAddress] = useState("");
    const [note, setNote] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Hàm tính tổng tiền hàng
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Hàm định dạng tiền tệ
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // Hàm xử lý đặt hàng
    const handleCheckout = async () => {
        if (!shippingAddress.trim()) {
            toast.error("Please enter your shipping address.");
            return;
        }

        setIsLoading(true);

        const orderData = {
            items: cartItems.map(item => ({
                orchidId: item.id,
                quantity: item.quantity,
            })),
            shippingAddress: shippingAddress,
            note: note,
        };

        try {
            const response = await apiService.post('/api/v1/orders/create', orderData);
            toast.success(`Order #${response.data.orderId} created successfully!`);
            clearCart();
            setTimeout(() => {
                navigate(`/order-confirmation/${response.data.orderId}`);
            }, 2000);
        } catch (error) {
            toast.error(error.response?.data || "Failed to place order. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const subtotal = calculateSubtotal();
    const shippingFee = subtotal > 500000 ? 0 : 30000;
    const total = subtotal + shippingFee;

    // --- Giao diện khi giỏ hàng trống ---
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full transform hover:scale-105 transition-all duration-300">
                            <div className="text-gray-300 mb-6 flex justify-center">
                                <ShoppingBagIcon />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                Discover our beautiful collection of orchids and add some nature's elegance to your space.
                            </p>
                            <Link 
                                to="/home" 
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
                            >
                                <span>Start Shopping</span>
                                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- Giao diện khi giỏ hàng có sản phẩm ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <nav className="text-sm mb-6" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2 text-gray-500">
                            <li><Link to="/home" className="hover:text-indigo-600 font-medium transition-colors">Home</Link></li>
                            <li><span className="mx-2 text-gray-300">/</span></li>
                            <li className="text-gray-800 font-semibold">Shopping Cart</li>
                        </ol>
                    </nav>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
                            <p className="text-gray-600">
                                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                            </p>
                        </div>
                        <div className="hidden md:flex items-center bg-white rounded-2xl px-6 py-3 shadow-lg">
                            <TruckIcon />
                            <span className="ml-2 text-sm font-medium text-gray-700">
                                Free shipping on orders over 500,000₫
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- Cột danh sách sản phẩm (Bên trái) --- */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white">Your Items</h2>
                            </div>
                            
                            <div className="divide-y divide-gray-100">
                                {cartItems.map((item, index) => (
                                    <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                        <div className="flex items-center space-x-6">
                                            {/* Product Image */}
                                            <div className="relative">
                                                <img 
                                                    src={item.orchidUrl} 
                                                    alt={item.name} 
                                                    className="w-24 h-24 object-cover rounded-2xl shadow-md"
                                                />
                                                <div className="absolute -top-2 -left-2 bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                                                    {index + 1}
                                                </div>
                                            </div>
                                            
                                            {/* Product Info */}
                                            <div className="flex-grow min-w-0">
                                                <h3 className="font-bold text-lg text-gray-800 mb-1">{item.name}</h3>
                                                <p className="text-indigo-600 font-semibold mb-3">{formatPrice(item.price)}</p>
                                                <button 
                                                    onClick={() => removeFromCart(item.id)} 
                                                    className="inline-flex items-center text-red-500 hover:text-red-700 text-sm font-medium transition-colors group"
                                                >
                                                    <TrashIcon />
                                                    <span className="ml-1 group-hover:underline">Remove</span>
                                                </button>
                                            </div>
                                            
                                            {/* Quantity Controls */}
                                            <div className="flex items-center">
                                                <div className="flex items-center bg-gray-100 rounded-2xl overflow-hidden">
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, -1)} 
                                                        className="p-3 hover:bg-gray-200 transition-colors"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <MinusIcon />
                                                    </button>
                                                    <span className="px-4 py-2 font-bold text-lg min-w-[3rem] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, 1)} 
                                                        className="p-3 hover:bg-gray-200 transition-colors"
                                                    >
                                                        <PlusIcon />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Item Total */}
                                            <div className="text-right min-w-[120px]">
                                                <div className="font-bold text-xl text-gray-800">
                                                    {formatPrice(item.price * item.quantity)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- Cột tóm tắt & checkout (Bên phải) --- */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden sticky top-8">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white">Order Summary</h2>
                            </div>
                            
                            <div className="p-6">
                                {/* Shipping Form */}
                                <div className="space-y-6 mb-8">
                                    <div>
                                        <label htmlFor="shippingAddress" className="block text-sm font-bold text-gray-700 mb-2">
                                            Shipping Address *
                                        </label>
                                        <input
                                            type="text"
                                            id="shippingAddress"
                                            value={shippingAddress}
                                            onChange={(e) => setShippingAddress(e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                            placeholder="Enter your full address"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="note" className="block text-sm font-bold text-gray-700 mb-2">
                                            Order Note (Optional)
                                        </label>
                                        <textarea
                                            id="note"
                                            rows="3"
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none"
                                            placeholder="Any special requests or delivery instructions?"
                                        />
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-4 mb-6 border-t-2 border-gray-100 pt-6">
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                                        <span className="font-semibold">{formatPrice(subtotal)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center text-lg">
                                        <div className="flex items-center">
                                            <span className="text-gray-600">Shipping</span>
                                            {shippingFee === 0 && (
                                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                                    FREE
                                                </span>
                                            )}
                                        </div>
                                        <span className="font-semibold">{formatPrice(shippingFee)}</span>
                                    </div>
                                    
                                    {subtotal < 500000 && (
                                        <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-2xl">
                                            Add {formatPrice(500000 - subtotal)} more for free shipping!
                                        </div>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-center text-2xl font-bold border-t-2 border-gray-100 pt-6 mb-8">
                                    <span className="text-gray-800">Total</span>
                                    <span className="text-indigo-600">{formatPrice(total)}</span>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing Order...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <span>Place Order</span>
                                            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                                
                                {/* Security Notice */}
                                <div className="mt-6 text-center">
                                    <p className="text-xs text-gray-500">
                                        🔒 Your information is secure and encrypted
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}