import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({
      ...form,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post(import.meta.env.VITE_API_URL_REGISTER, form);

      if (res.data && res.data.id) {
        setSuccess("Registration successful! You can now login.");
        toast.success("Registration successful!");
        setForm({ username: "", email: "", password: "" });

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError("Registration failed! Please try again.");
        toast.error("Registration failed!");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(
        err.response?.data?.message || "Registration failed! Please try again."
      );
      toast.error("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-24 pb-8 px-2 sm:px-0">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <a
          href="/login"
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          &larr; Quay lại đăng nhập
        </a>
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Đăng ký
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
            {success}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-xl font-semibold text-left text-gray-700 mb-1"
            >
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              value={form.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition hover:border-indigo-400"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-xl font-semibold text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition hover:border-indigo-400"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xl font-semibold text-gray-700 mb-1"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition hover:border-indigo-400"
            />
          </div>
          <div>
            <button
              style={{ borderRadius: "10px" }}
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </div>
        </form>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default Register;
