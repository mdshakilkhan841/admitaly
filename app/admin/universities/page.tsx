"use client";
import { useState, useEffect } from "react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import AdminLayout from "@/components/AdminLayout";
import Modal from "@/components/Modal";
import UniversityForm from "@/components/UniversityForm";

interface University {
    _id: string;
    name: string;
    address: string;
    image: string;
}

export default function UniversitiesManagement() {
    const [universities, setUniversities] = useState<University[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUniversity, setSelectedUniversity] =
        useState<University | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUniversities();
    }, []);

    const fetchUniversities = async () => {
        try {
            const response = await fetch("/api/universities");
            const data = await response.json();
            setUniversities(data);
        } catch (error) {
            console.error("Error fetching universities:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedUniversity(null);
        setIsModalOpen(true);
    };

    const handleEdit = (university: University) => {
        setSelectedUniversity(university);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this university?")) {
            try {
                await fetch(`/api/universities/${id}`, { method: "DELETE" });
                fetchUniversities();
            } catch (error) {
                console.error("Error deleting university:", error);
            }
        }
    };

    const handleSubmit = async (formData: Omit<University, "_id">) => {
        try {
            const url = selectedUniversity
                ? `/api/universities/${selectedUniversity._id}`
                : "/api/universities";

            const method = selectedUniversity ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsModalOpen(false);
                fetchUniversities();
            }
        } catch (error) {
            console.error("Error saving university:", error);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Universities
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage all universities in the system
                        </p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add University
                    </button>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {universities.map((university) => (
                            <li key={university._id}>
                                <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                                    <div className="flex items-center">
                                        <div className="flex shrink-0 h-12 w-12 bg-gray-300 rounded-full items-center justify-center">
                                            {university.image ? (
                                                <img
                                                    src={university.image}
                                                    alt={university.name}
                                                    className="h-12 w-12 rounded-full"
                                                />
                                            ) : (
                                                <span className="text-gray-500 text-sm">
                                                    No Image
                                                </span>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {university.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {university.address}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() =>
                                                handleEdit(university)
                                            }
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(university._id)
                                            }
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={
                        selectedUniversity
                            ? "Edit University"
                            : "Create University"
                    }
                >
                    <UniversityForm
                        university={selectedUniversity}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </Modal>
            </div>
        </AdminLayout>
    );
}
