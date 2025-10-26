"use client";
import { useState, ChangeEvent, FormEvent } from "react";

interface University {
    _id?: string;
    name: string;
    address: string;
    image: string;
}

interface UniversityFormProps {
    university: University | null;
    onSubmit: (formData: Omit<University, "_id">) => void;
    onCancel: () => void;
}

export default function UniversityForm({
    university,
    onSubmit,
    onCancel,
}: UniversityFormProps) {
    const [formData, setFormData] = useState<Omit<University, "_id">>({
        name: university?.name || "",
        address: university?.address || "",
        image: university?.image || "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                    University Name
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                >
                    Address
                </label>
                <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700"
                >
                    Image URL
                </label>
                <input
                    // type="url"
                    name="image"
                    id="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {university ? "Update" : "Create"}
                </button>
            </div>
        </form>
    );
}
