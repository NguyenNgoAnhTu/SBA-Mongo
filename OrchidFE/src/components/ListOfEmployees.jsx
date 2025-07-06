import React, { useEffect, useState } from 'react'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";

export default function ListOfEmployees() {
    const baseUrl = import.meta.env.VITE_API_URL_EMPL
    const[api, setAPI] = useState([])
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { register, handleSubmit,formState: { errors }, control, reset } = useForm();
    const [value, setValue] = useState('');
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
      
      const onSubmit = async (data) => {
        try {
          const response = await axios.post(baseUrl, data, { 
            headers: { 'Content-Type': 'application/json' }
          });
          setShow(false);
          fetchData();
          reset();
          setValue('');
          toast.success("Employee added successfully!");
        } catch (error) {
          console.log(error.message);
          toast.error("Employee added fail!");
        }
      };
  return (
    <div className="max-w-6xl mx-auto p-4">
      <Toaster/>
      <div className="flex justify-end mb-4">
        <button onClick={handleShow} type='button' className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 flex items-center gap-2">
          <i className="bi bi-node-plus"></i> Add new employee
        </button>
      </div>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b">Image</th>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Gender</th>
              <th className="p-3 border-b">Designation</th>
            </tr>
          </thead>
          <tbody>
            {api.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="p-2 text-center"><img src={a.url} alt="employee" className="w-16 h-16 object-cover rounded" /></td>
                <td className="p-2">{a.name}</td>
                <td className="p-2">
                  {a.gender ? (
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">Male <i className="bi bi-gender-male"></i></span>
                  ) : (
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-pink-100 text-pink-800 rounded">Female <i className="bi bi-gender-female"></i></span>
                  )}
                </td>
                <td className="p-2">{a.designation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button onClick={handleClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            <h3 className="text-xl font-bold mb-4">New Employee</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" autoFocus {...register("name", { required: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                {errors.name && errors.name.type === "required" && <p className="text-yellow-600 text-xs mt-1">Name is required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input type="text" {...register("url", { required: true, pattern: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                {errors.url && errors.url.type === "pattern" && <p className="text-yellow-600 text-xs mt-1">Image must be a valid URL</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Designation</label>
                <input type="text" {...register("designation", { required: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                {errors.designation && errors.designation.type === "required" && <p className="text-yellow-600 text-xs mt-1">Designation is required</p>}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="gender" {...register("gender")}/>
                <label htmlFor="gender" className="text-sm text-gray-700">Male</label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
