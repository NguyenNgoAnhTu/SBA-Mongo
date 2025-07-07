import React, { useEffect, useState } from 'react';
import apiService from '../../api/apiService';
import { UsersIcon, ShoppingCartIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardOverview() {
    const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Giả sử bạn có các API để lấy số liệu này
                const [usersRes, ordersRes] = await Promise.all([
                    apiService.get('/accounts'), // Tạm dùng API có sẵn
                    apiService.get('/api/v1/orders'),
                ]);
                const totalRevenue = ordersRes.data.reduce((sum, order) => sum + order.totalAmount, 0);
                setStats({ users: usersRes.data.length, orders: ordersRes.data.length, revenue: totalRevenue });
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);
    
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const chartData = {
        labels: ['Users', 'Orders'],
        datasets: [{
            label: 'Total Count',
            data: [stats.users, stats.orders],
            backgroundColor: ['rgba(59, 130, 246, 0.6)', 'rgba(16, 185, 129, 0.6)'],
            borderColor: ['rgba(59, 130, 246, 1)', 'rgba(16, 185, 129, 1)'],
            borderWidth: 1,
        }],
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat Cards */}
                <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full"><UsersIcon className="h-8 w-8 text-blue-500" /></div>
                    <div>
                        <p className="text-sm text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold">{loading ? '...' : stats.users}</p>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full"><ShoppingCartIcon className="h-8 w-8 text-green-500" /></div>
                    <div>
                        <p className="text-sm text-gray-500">Total Orders</p>
                        <p className="text-2xl font-bold">{loading ? '...' : stats.orders}</p>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
                    <div className="bg-yellow-100 p-3 rounded-full"><CurrencyDollarIcon className="h-8 w-8 text-yellow-500" /></div>
                    <div>
                        <p className="text-sm text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-bold">{loading ? '...' : formatPrice(stats.revenue)}</p>
                    </div>
                </div>
            </div>
            
            <div className="mt-12 bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold mb-4">Statistics</h2>
                <div style={{ height: '400px' }}>
                     <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
}