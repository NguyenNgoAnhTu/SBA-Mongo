import { useState } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://66e04e162fb67ac16f292564.mockapi.io/api/v1/login",
        {
          username,
          password,
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data));

      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid username or password");
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-2">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Login
        </h2>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-xl font-semibold text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xl font-semibold text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            style={{ borderRadius: "10px" }}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            Dont have an account?
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Login;