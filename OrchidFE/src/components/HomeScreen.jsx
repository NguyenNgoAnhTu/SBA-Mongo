import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router';

export default function HomeScreen() {
    const baseUrl = import.meta.env.VITE_API_URL
    const[api, setAPI] = useState([])
    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
          const response = await axios.get(baseUrl); 
          const sortedData = response.data.sort((a, b) => parseInt(b.empId) - parseInt(a.empId));
          setAPI(sortedData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
     
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-10 px-2">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">🌸 Orchid Gallery</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {api.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-6 hover:shadow-2xl transition">
              <img src={item.image} alt={item.orchidName} className="w-20 h-20 object-cover rounded-full border-4 border-indigo-100 mb-4" />
              <h3 className="text-lg font-bold text-gray-800 mb-2 text-center line-clamp-2 min-h-[2.5rem]">{item.orchidName}</h3>
              <Link
                to={`/detail/${item.id}`}
                className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow text-sm transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
