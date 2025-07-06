import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Account() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser({
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          username: parsedUser.username || "",
        });
        setFormData({
          name: parsedUser.name || "",
          email: parsedUser.email || "",
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        toast.error("Unable to load user information");
      }
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update user information
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
    };

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    toast.success("Information updated successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-10 px-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          My Account
        </h2>

        {!isEditing ? (
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-3xl text-indigo-600">
                  {user.name.charAt(0) || user.username.charAt(0) || "U"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Username
                </h3>
                <p className="text-lg font-semibold text-gray-800">
                  {user.username}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                <p className="text-lg font-semibold text-gray-800">
                  {user.name || "Not updated"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="text-lg font-semibold text-gray-800">
                  {user.email || "Not updated"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
            >
              Edit Information
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-1/2 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
