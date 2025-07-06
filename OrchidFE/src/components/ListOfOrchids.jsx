import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

export default function ListOfOrchids() {
  const baseUrl = import.meta.env.VITE_API_URL;
  const [api, setAPI] = useState([]);
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrchid, setSelectedOrchid] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(baseUrl);
      const sortedData = response.data.sort(
        (a, b) => parseInt(b.id) - parseInt(a.id)
      );
      setAPI(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch orchids!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/${id}`);
      fetchData();
      toast.success("Orchid deleted successfully!");
      setShowDeleteModal(false);
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to delete orchid!");
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios.post(baseUrl, data, {
        headers: { "Content-Type": "application/json" },
      });
      setShow(false);
      fetchData();
      reset();
      toast.success("Orchid added successfully!");
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to add orchid!");
    }
  };

  const openDeleteModal = (orchid) => {
    setSelectedOrchid(orchid);
    setShowDeleteModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-green-200 py-10 px-4">
      <Toaster position="top-center" />
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-800">
            🌸 List of Orchids
          </h1>
          <button
            onClick={() => setShow(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl shadow transition font-semibold"
          >
            <i className="bi bi-node-plus mr-2"></i> Add Orchid
          </button>
        </div>
        <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-100 text-indigo-800 text-sm font-semibold">
              <tr>
                <th className="p-4 text-center">Image</th>
                <th className="p-4 text-center">Orchid Name</th>
                <th className="p-4 text-center">Origin</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
              {api.map((a) => (
                <tr key={a.id} className="hover:bg-indigo-50 transition">
                  <td className="p-3 text-center">
                    <img
                      src={a.image}
                      alt="orchid"
                      className="w-30 h-30 object-cover rounded-lg border shadow"
                    />
                  </td>
                  <td className="p-3 font-medium">{a.orchidName}</td>
                  <td className="p-3">
                    {a.isNatural ? (
                      <span className="inline-block px-4 py-2 text-xs font-bold bg-green-100 text-green-700 rounded-full border border-green-300">
                        Natural
                      </span>
                    ) : (
                      <span className="inline-block px-4 py-2 text-xs font-bold bg-yellow-100 text-yellow-700 rounded-full border border-yellow-300">
                        Industry
                      </span>
                    )}
                  </td>
                  <td className="p-3 flex mt-12 justify-center items-center gap-2">
                    <Link
                      to={`/edit/${a.id}`}
                      className="inline-flex items-center text-[16px] font-bold gap-1 px-4 py-2  bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 border border-blue-300"
                    >
                      <i className="bi bi-pencil-square"></i> Edit
                    </Link>
                    <button
                      onClick={() => openDeleteModal(a)}
                      className="inline-flex items-center text-[16px] font-bold gap-1 px-4 py-2 bg-white shadow-xl text-red-700 rounded-lg hover:bg-red-100 border border-red-300"
                    >
                      <i className="bi bi-trash3"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Orchid Modal */}
        {show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative animate-fade-in">
              <button
                onClick={() => setShow(false)}
                className="absolute top-4 right-4 bg-white shadow-xl rounded-full text-gray-900 hover:text-red-300 text-2xl font-bold"
              >
                X
              </button>
              <h3 className="text-2xl font-bold mb-6 text-center text-indigo-700">
                Add New Orchid
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-xl text-left font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    {...register("orchidName", { required: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    placeholder="Eg: Dendrobium Orchid"
                  />
                  {errors.orchidName && (
                    <p className="text-red-500 text-xs mt-1">
                      Name is required
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xl text-left font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    {...register("image", {
                      required: true,
                      pattern: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i,
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.image && (
                    <p className="text-red-500 text-xs mt-1">
                      Please enter a valid image URL
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isNatural"
                    className="w-4 h-4"
                    {...register("isNatural")}
                  />
                  <label htmlFor="isNatural" className="text-sm text-gray-700">
                    Natural
                  </label>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShow(false)}
                    className="px-4 py-2 rounded-xl hover:bg-gray-300 text-white bg-amber-700 shadow-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 rounded-xl py-2 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold"
                  >
                    Save Orchid
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedOrchid && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative animate-fade-in">
              <h3 className="text-2xl font-bold mb-4 text-center text-red-700">
                Confirm Delete
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete "{selectedOrchid.orchidName}"?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-xl hover:bg-gray-300 text-gray-700 bg-gray-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(selectedOrchid.id)}
                  className="px-4 py-2 rounded-xl hover:bg-red-700 text-white bg-red-600 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
