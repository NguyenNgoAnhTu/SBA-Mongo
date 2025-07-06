import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập khi component được mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setIsLoggedIn(true);
    }
  }, []);

  // Close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-red-200 border-b border-gray-200 px-6 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a
          style={{ textDecoration: "none" }}
          href="/"
          className="text-2xl font-bold text-indigo-700 "
        >
          🌸 Orchids
        </a>

        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div
          className={`lg:flex lg:items-center lg:gap-6 absolute lg:static top-16 left-0 w-full lg:w-auto bg-white lg:bg-transparent shadow-lg lg:shadow-none z-40 rounded-full lg:p-0 transition-all duration-300 ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <a
            style={{ textDecoration: "none" }}
            href="/home"
            className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Home
          </a>
          <a
          style={{ textDecoration: "none" }}
          href="/account"
          className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          Account
        </a>
        <a
          style={{ textDecoration: "none" }}
          href="/"
          className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          Manage Orchids
        </a>
          {!isLoggedIn ? (
            <a
              style={{ textDecoration: "none" }}
              href="/login"
              className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Log in
            </a>
          ) : (
            <>
              
              <button
                onClick={handleLogout}
                className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Log out
              </button>
            </>
          )}

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              Dropdown
              <svg
                className="w-4 h-4 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
                <a
                  style={{ textDecoration: "none" }}
                  href="#action/3.1"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Action
                </a>
                <a
                  style={{ textDecoration: "none" }}
                  href="#action/3.2"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Another Action
                </a>
                <a
                  style={{ textDecoration: "none" }}
                  href="#action/3.3"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Something
                </a>
                <div className="border-t my-1"></div>
                <a
                  style={{ textDecoration: "none" }}
                  href="#action/3.4"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Separated Link
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
