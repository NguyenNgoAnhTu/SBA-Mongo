import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router';

export default function EditOrchid() {
  const baseUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const [api, setAPI] = useState({});
  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm();

  useEffect(() => {
    axios.get(`${baseUrl}/${id}`)
      .then((response) => {
        setAPI(response.data);
        setValue('orchidName', response.data.orchidName);
        setValue('image', response.data.image);
        setValue('isNatural', response.data.isNatural);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch orchid data.');
      });
  }, [id, setValue, baseUrl]);

  const onSubmit = (data) => {
    axios.put(`${baseUrl}/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(() => {
        toast.success('Orchid edited successfully!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to edit orchid.');
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Toaster />
      <div className="mb-4 text-indigo-700 font-semibold text-lg">Edit the orchid: {api.orchidName}</div>
      <hr className="mb-6" />
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <Controller
                name="orchidName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <input {...field} type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" />}
              />
              {errors.orchidName && errors.orchidName.type === "required" && <p className="text-yellow-600 text-xs mt-1">Name is required</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <Controller
                name="image"
                control={control}
                rules={{ required: true, pattern: /(https?:\/\/[^"]+)/i }}
                render={({ field }) => <input {...field} type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" />}
              />
              {errors.image && errors.image.type === "pattern" && <p className="text-yellow-600 text-xs mt-1">Image must be a valid URL</p>}
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isNatural" {...register("isNatural")}/>
              <label htmlFor="isNatural" className="text-sm text-gray-700">Natural</label>
            </div>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
          </form>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          {api.image && (
            <img src={api.image} alt="orchid" className="w-60 h-60 object-cover rounded shadow-lg mb-4" />
          )}
        </div>
      </div>
    </div>
  );
}
