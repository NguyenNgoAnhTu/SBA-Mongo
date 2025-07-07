import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiService from '../api/apiService';

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-indigo-200 border-solid rounded-full animate-spin"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 border-solid rounded-full border-t-transparent animate-spin"></div>
    </div>
  </div>
);

export default function HomeScreen() {
  const [orchids, setOrchids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrchids = async () => {
      setLoading(true);
      try {
        const res = await apiService.get('/api/v1/orchids');
        setOrchids(res.data);
      } catch (error) {
        console.error('Failed to fetch orchids:', error);
        toast.error('Failed to fetch orchids.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrchids();
  }, []);

  const uniqueCategories = useMemo(() => {
    const all = orchids.map(o => o.categoryName?.trim());
    return Array.from(new Set(all));
  }, [orchids]);

  const displayedOrchids = useMemo(() => {
    return orchids
      .filter(o => !selectedCategory || o.categoryName === selectedCategory)
      .filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [orchids, selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">🌸 Orchid Gallery 🌸</h1>
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto">
              Discover the world's most beautiful orchids and bring nature's elegance to your home
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-purple-50"></div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search + Filter */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            {/* Search */}
            <div className="flex-grow">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search Orchids</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search by orchid name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 text-base border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Dropdown */}
            <div className="lg:w-72">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <FilterIcon />
                Filter by Category
              </label>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary */}
        {!loading && (
          <div className="mb-8 text-center">
            <p className="text-lg text-gray-600">
              {displayedOrchids.length > 0 ? (
                <>
                  Showing <span className="font-bold text-indigo-600">{displayedOrchids.length}</span> 
                  {selectedCategory ? ` orchids in "${selectedCategory}"` : ' orchids'}
                  {searchTerm && ` matching "${searchTerm}"`}
                </>
              ) : (
                'No orchids found with current filters'
              )}
            </p>
          </div>
        )}

        {/* Orchid Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {displayedOrchids.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {displayedOrchids.map((orchid) => (
                  <div 
                    key={orchid.id} 
                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-2"
                  >
                    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                      <div className="aspect-square relative">
                        <img 
                          src={orchid.orchidUrl} 
                          alt={orchid.name} 
                          className="w-full h-full object-cover rounded-2xl shadow-md group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>

                    <div className="p-6 pt-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
                        {orchid.name}
                      </h3>
                      {orchid.categoryName && (
                        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full mb-4">
                          {orchid.categoryName}
                        </span>
                      )}
                      <Link 
                        to={`/detail/${orchid.id}`} 
                        className="block w-full text-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-6">🌸</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">No orchids found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search terms or removing some filters to see more results.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory(null);
                    }}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 font-semibold transition-colors duration-200"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
