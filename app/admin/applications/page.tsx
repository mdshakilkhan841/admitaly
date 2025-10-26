"use client";
import { useState, useEffect } from "react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import AdminLayout from "@/components/AdminLayout";
import Modal from "@/components/Modal";
import ApplicationForm from "@/components/ApplicationForm";

interface IApplication {
    _id: string;
    uniId?: {
        _id: string;
        name?: string;
    };
    call: string;
    applicationLink: string;
    admissionFee: string;
    startDate: string;
    endDate: string;
    cgpa: string;
    languageProficiency: string[];
    others: string[];
}

interface IApplicationFormData extends Omit<IApplication, "_id" | "uniId"> {
    uniId: string;
}

export default function ApplicationsManagement() {
    const [applications, setApplications] = useState<IApplication[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] =
        useState<IApplication | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await fetch("/api/applications");
            const data = await response.json();
            setApplications(data);
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedApplication(null);
        setIsModalOpen(true);
    };

    const handleEdit = (application: IApplication) => {
        setSelectedApplication(application);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this application?")) {
            try {
                await fetch(`/api/applications/${id}`, { method: "DELETE" });
                fetchApplications();
            } catch (error) {
                console.error("Error deleting application:", error);
            }
        }
    };

    const handleSubmit = async (formData: IApplicationFormData) => {
        try {
            const url = selectedApplication
                ? `/api/applications/${selectedApplication._id}`
                : "/api/applications";

            const method = selectedApplication ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsModalOpen(false);
                fetchApplications();
            }
        } catch (error) {
            console.error("Error saving application:", error);
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
                            Applications
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage all university applications
                        </p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Application
                    </button>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {applications.map((application) => (
                            <li key={application._id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <span className="text-indigo-800 font-medium text-sm">
                                                        {application.uniId?.name?.charAt(
                                                            0
                                                        ) || "U"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {application.uniId?.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {application.call} •{" "}
                                                    {application.startDate} -{" "}
                                                    {application.endDate}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() =>
                                                    handleEdit(application)
                                                }
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        application._id
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Fee: {application.admissionFee}
                                            </span>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                CGPA: {application.cgpa}
                                            </span>
                                            {application.languageProficiency?.map(
                                                (lang, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                                    >
                                                        {lang}
                                                    </span>
                                                )
                                            )}
                                        </div>
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
                        selectedApplication
                            ? "Edit Application"
                            : "Create Application"
                    }
                >
                    <ApplicationForm
                        application={selectedApplication}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </Modal>
            </div>
        </AdminLayout>
    );
}
