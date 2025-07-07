import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import apiService from '../api/apiService';

// Component cho icon
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const MinusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>;
const ShoppingCartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>;
const NaturalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-indigo-200 border-solid rounded-full animate-spin"></div>
      <div className="absolute top-0 left-0 w-20 h-20 border-4 border-indigo-600 border-solid rounded-full border-t-transparent animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl">🌸</span>
      </div>
    </div>
  </div>
);

export default function DetailOrchid() {
    const [orchid, setOrchid] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { id } = useParams();
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiService.get(`/api/v1/orchids/${id}`);
                
                const apiData = response.data;
                const formattedOrchid = {
                    ...apiData,
                    imageUrl: apiData.orchidUrl,
                    description: apiData.orchidDecription,
                    isNatural: apiData.natural,
                };
                setOrchid(formattedOrchid);

            } catch (error) {
                console.error("Error fetching data:", error);
                if (error.response?.status !== 401 && error.response?.status !== 403) {
                    toast.error("Could not fetch orchid details.");
                }
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleQuantityChange = (amount) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };
    
    const handleAddToCart = () => {
        if (orchid) {
            addToCart(orchid, quantity);
        }
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };
    
    if (!orchid) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            <Toaster 
                position="top-center" 
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                        borderRadius: '12px',
                        padding: '16px',
                    },
                }}
            />
            
            {/* Back Button */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <Link 
                        to="/home" 
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-full shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 border border-gray-200"
                    >
                        <ArrowLeftIcon />
                        <span className="ml-2">Back to Gallery</span>
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Image Section */}
                        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 lg:p-12">
                            <div className="aspect-square relative overflow-hidden rounded-2xl shadow-2xl">
                                <img
                                    src={orchid.imageUrl}
                                    alt={orchid.name}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                            </div>
                            
                            {/* Floating Badge */}
                            <div className="absolute top-12 right-12">
                                {orchid.isNatural ? (
                                    <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center">
                                        <NaturalIcon />
                                        Natural
                                    </div>
                                ) : (
                                    <div className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center">
                                        <NaturalIcon />
                                        Artificial
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                            {/* Breadcrumb */}
                            <nav className="text-sm mb-6 pb-4 border-b border-gray-100">
                                <ol className="flex items-center space-x-2 text-gray-500">
                                    <li><Link to="/home" className="hover:text-indigo-600 font-medium transition-colors">Home</Link></li>
                                    <li><span className="mx-2 text-gray-300">/</span></li>
                                    <li><span className="text-gray-400">Orchid Details</span></li>
                                    <li><span className="mx-2 text-gray-300">/</span></li>
                                    <li className="text-gray-800 font-semibold truncate max-w-32">{orchid.name}</li>
                                </ol>
                            </nav>
                            
                            {/* Title */}
                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                {orchid.name}
                            </h1>
                            
                            {/* Category Badge */}
                            {orchid.categoryName && (
                                <div className="mb-6">
                                    <span className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 text-sm font-semibold rounded-full">
                                        Category: {orchid.categoryName}
                                    </span>
                                </div>
                            )}

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {orchid.description || "This beautiful orchid will make a perfect addition to your collection."}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="mb-8">
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-4xl lg:text-5xl font-bold text-indigo-600">
                                        {formatPrice(orchid.price)}
                                    </span>
                                    <span className="text-lg text-gray-500 line-through">
                                        {orchid.originalPrice && formatPrice(orchid.originalPrice)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Includes care guide and pot</p>
                            </div>
                            
                            {/* Quantity and Add to Cart */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Quantity
                                    </label>
                                    <div className="flex items-center">
                                        <div className="flex items-center border-2 border-gray-200 rounded-2xl bg-white shadow-sm">
                                            <button 
                                                onClick={() => handleQuantityChange(-1)} 
                                                className="p-4 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-l-2xl transition-all duration-200"
                                                disabled={quantity <= 1}
                                            >
                                                <MinusIcon />
                                            </button>
                                            <input 
                                                type="text" 
                                                readOnly 
                                                value={quantity}
                                                className="w-20 text-center font-bold text-xl py-4 border-0 bg-transparent"
                                            />
                                            <button 
                                                onClick={() => handleQuantityChange(1)} 
                                                className="p-4 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-r-2xl transition-all duration-200"
                                            >
                                                <PlusIcon />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center text-lg"
                                >
                                    <ShoppingCartIcon />
                                    Add to Cart
                                </button>

                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">🚚</div>
                                        <div className="text-xs font-semibold text-gray-600">Free Delivery</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">🛡️</div>
                                        <div className="text-xs font-semibold text-gray-600">Quality Guarantee</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">📞</div>
                                        <div className="text-xs font-semibold text-gray-600">24/7 Support</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information Section */}
                <div className="mt-12 bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Care Instructions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-2xl">
                            <div className="text-3xl mb-2">💧</div>
                            <h3 className="font-semibold text-gray-800 mb-1">Watering</h3>
                            <p className="text-sm text-gray-600">Water weekly or when soil feels dry</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-2xl">
                            <div className="text-3xl mb-2">☀️</div>
                            <h3 className="font-semibold text-gray-800 mb-1">Light</h3>
                            <p className="text-sm text-gray-600">Bright, indirect sunlight</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-2xl">
                            <div className="text-3xl mb-2">🌡️</div>
                            <h3 className="font-semibold text-gray-800 mb-1">Temperature</h3>
                            <p className="text-sm text-gray-600">18-24°C ideal range</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-2xl">
                            <div className="text-3xl mb-2">💨</div>
                            <h3 className="font-semibold text-gray-800 mb-1">Humidity</h3>
                            <p className="text-sm text-gray-600">50-70% humidity preferred</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}