import React from 'react';
import { Link, useParams } from 'react-router-dom';

const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default function OrderConfirmationPage() {
    const { orderId } = useParams();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full text-center bg-white p-10 rounded-2xl shadow-xl">
                <div className="flex justify-center mb-6">
                    <CheckCircleIcon />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Thank You For Your Order!</h1>
                <p className="text-gray-600 mt-4">
                    Your order has been placed successfully.
                </p>
                <p className="text-gray-800 font-semibold text-lg mt-2">
                    Your Order ID is: <span className="text-indigo-600">#{orderId}</span>
                </p>
                <p className="text-gray-500 mt-4">
                    We have received your order and will begin processing it shortly. You can track its status in your order history.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link to="/home" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition">
                        Continue Shopping
                    </Link>
                    <Link to="/order-history" className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition">
                        View Order History
                    </Link>
                </div>
            </div>
        </div>
    );
}