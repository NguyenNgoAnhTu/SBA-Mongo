import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Swal from 'sweetalert2';

// --- Icons ---
const CartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0012 11z" clipRule="evenodd" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m4-6h16" /></svg>;

function NavBar() {
    // --- State Management ---
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

    // --- Logic xử lý ---

    // 1. Kiểm tra trạng thái đăng nhập và vai trò người dùng (ổn định hơn)
    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem("token");
            setIsLoggedIn(!!token);

            if (token) {
                try {
                    const user = JSON.parse(localStorage.getItem("user"));
                    setUserRole(user?.role || null);
                } catch (e) {
                    setUserRole(null);
                }
            } else {
                setUserRole(null);
            }
        };

        checkAuthStatus();
        window.addEventListener('storage', checkAuthStatus); // Lắng nghe sự kiện thay đổi storage
        return () => window.removeEventListener('storage', checkAuthStatus);
    }, []);

    // 2. Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 3. Xử lý đăng xuất
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUserRole(null);
        setDropdownOpen(false);
        window.dispatchEvent(new Event('storage')); // Bắn sự kiện để các component khác cập nhật
        navigate("/login");
    };

    // Component Link điều hướng, chỉ hiển thị link cần thiết
    const NavLinks = ({ isMobile = false }) => (
        <>
            <NavLink to="/home" onClick={() => isMobile && setMenuOpen(false)} className={({ isActive }) => `px-4 py-2 rounded-md font-medium ${isActive ? 'text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                Home
            </NavLink>
            <NavLink to="/order-history" onClick={() => isMobile && setMenuOpen(false)} className={({ isActive }) => `px-4 py-2 rounded-md font-medium ${isActive ? 'text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                Order History
            </NavLink>
            {/* Chỉ hiển thị "Manage Orchids" nếu là ADMIN */}
           
        </>
    );

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 py-3 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/home" className="text-2xl font-bold text-indigo-700">
                    🌸 Orchids
                </Link>

                {/* --- Menu cho Desktop --- */}
                <div className="hidden lg:flex items-center gap-2">
                    <NavLinks />
                </div>

                {/* --- Icons và Dropdown cho Desktop --- */}
                <div className="hidden lg:flex items-center gap-4">
                    <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600">
                        <CartIcon />
                        {totalItemsInCart > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                {totalItemsInCart}
                            </span>
                        )}
                    </Link>

                    {isLoggedIn ? (
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="p-1 rounded-full text-gray-500 hover:text-indigo-600 focus:outline-none">
                                <UserIcon />
                            </button>
                            {dropdownOpen && (
    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg z-50 py-2">
        <button
            onClick={async () => {
                const result = await Swal.fire({
                    title: 'Confirm Logout',
                    text: 'Are you sure you want to log out?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#aaa',
                    confirmButtonText: 'Yes, log out',
                });

                if (result.isConfirmed) {
                    handleLogout();
                }
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition rounded-lg"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log out
        </button>
    </div>
)}
                        </div>
                    ) : (
                        <Link to="/login" className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700">
                            Log in
                        </Link>
                    )}
                </div>

                {/* --- Nút Menu cho Mobile --- */}
                <div className="lg:hidden flex items-center gap-2">
                     <Link to="/cart" className="relative p-2 text-gray-600"><CartIcon /></Link>
                     <button onClick={() => setMenuOpen(!menuOpen)}><MenuIcon /></button>
                </div>
            </div>

            {/* --- Menu thả xuống cho Mobile --- */}
            {menuOpen && (
                <div className="lg:hidden mt-4 space-y-2 px-2 pb-3">
                    <NavLinks isMobile={true} />
                    <div className="border-t pt-2">
                        {isLoggedIn ? (
                            <>
                                <Link to="/account" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-medium">My Account</Link>
                                <Link to="/order-history" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-medium">Order History</Link>
                                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-medium">Log out</button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-medium">Log in</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default NavBar;