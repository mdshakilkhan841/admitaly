"use client";
<<<<<<< HEAD
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface IUniversity {
    _id: string;
    name: string;
}

interface IApplication {
    _id?: string;
    uniId?: {
        _id: string;
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

interface ApplicationFormProps {
    application: IApplication | null;
    onSubmit: (formData: IApplicationFormData) => void;
    onCancel: () => void;
}

export default function ApplicationForm({
    application,
    onSubmit,
    onCancel,
}: ApplicationFormProps) {
    const [universities, setUniversities] = useState<IUniversity[]>([]);
    const [formData, setFormData] = useState<IApplicationFormData>({
        uniId: application?.uniId?._id || "",
        call: application?.call || "",
        applicationLink: application?.applicationLink || "",
        admissionFee: application?.admissionFee || "",
        startDate: application?.startDate || "",
        endDate: application?.endDate || "",
        cgpa: application?.cgpa || "",
        languageProficiency: application?.languageProficiency || [],
        others: application?.others || [],
    });

    const [currentLanguage, setCurrentLanguage] = useState("");
    const [currentOther, setCurrentOther] = useState("");

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
        }
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const addLanguage = () => {
        if (
            currentLanguage &&
            !formData.languageProficiency.includes(currentLanguage)
        ) {
            setFormData({
                ...formData,
                languageProficiency: [
                    ...formData.languageProficiency,
                    currentLanguage,
                ],
            });
            setCurrentLanguage("");
        }
    };

    const removeLanguage = (language: string) => {
        setFormData({
            ...formData,
            languageProficiency: formData.languageProficiency.filter(
                (lang) => lang !== language
            ),
        });
    };

    const addOther = () => {
        if (currentOther && !formData.others.includes(currentOther)) {
            setFormData({
                ...formData,
                others: [...formData.others, currentOther],
            });
            setCurrentOther("");
        }
    };

    const removeOther = (item: string) => {
        setFormData({
            ...formData,
            others: formData.others.filter((other) => other !== item),
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 max-h-96 overflow-y-auto"
        >
            <div>
                <label
                    htmlFor="uniId"
                    className="block text-sm font-medium text-gray-700"
                >
                    University
                </label>
                <select
                    name="uniId"
                    id="uniId"
                    required
                    value={formData.uniId}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="">Select a university</option>
                    {universities.map((university) => (
                        <option key={university._id} value={university._id}>
                            {university.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label
                    htmlFor="call"
                    className="block text-sm font-medium text-gray-700"
                >
                    Call Name
                </label>
                <input
                    type="text"
                    name="call"
                    id="call"
                    value={formData.call}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label
                    htmlFor="applicationLink"
                    className="block text-sm font-medium text-gray-700"
                >
                    Application Link
                </label>
                <input
                    type="url"
                    name="applicationLink"
                    id="applicationLink"
                    value={formData.applicationLink}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label
                    htmlFor="admissionFee"
                    className="block text-sm font-medium text-gray-700"
                >
                    Admission Fee
                </label>
                <input
                    type="text"
                    name="admissionFee"
                    id="admissionFee"
                    value={formData.admissionFee}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label
                        htmlFor="startDate"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Start Date
                    </label>
                    <input
                        type="text"
                        name="startDate"
                        id="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="endDate"
                        className="block text-sm font-medium text-gray-700"
                    >
                        End Date
                    </label>
                    <input
                        type="text"
                        name="endDate"
                        id="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="cgpa"
                    className="block text-sm font-medium text-gray-700"
                >
                    CGPA Requirement
                </label>
                <input
                    type="text"
                    name="cgpa"
                    id="cgpa"
                    value={formData.cgpa}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Language Proficiency
                </label>
                <div className="mt-1 flex space-x-2">
                    <input
                        type="text"
                        value={currentLanguage}
                        onChange={(e) => setCurrentLanguage(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Add language requirement"
                    />
                    <button
                        type="button"
                        onClick={addLanguage}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Add
                    </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                    {formData.languageProficiency.map((language, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                            {language}
                            <button
                                type="button"
                                onClick={() => removeLanguage(language)}
                                className="ml-1.5 text-purple-600 hover:text-purple-900"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Other Requirements
                </label>
                <div className="mt-1 flex space-x-2">
                    <input
                        type="text"
                        value={currentOther}
                        onChange={(e) => setCurrentOther(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Add other requirement"
                    />
                    <button
                        type="button"
                        onClick={addOther}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Add
                    </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                    {formData.others.map((item, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                            {item}
                            <button
                                type="button"
                                onClick={() => removeOther(item)}
                                className="ml-1.5 text-gray-600 hover:text-gray-900"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
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
                    {application ? "Update" : "Create"}
                </button>
            </div>
        </form>
    );
}
=======
import React, { useState } from "react";
import useSWR from "swr";
import Modal from "../Modal";
import UniversityForm from "./university-form";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import fetcher from "@/lib/fetcher";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface University {
    _id: string;
    name: string;
    address: string;
    image: string;
}

const UniversityList = ({
    isModalOpen,
    setIsModalOpen,
}: {
    isModalOpen: boolean;
    setIsModalOpen: any;
}) => {
    const {
        data: universities,
        error,
        isLoading,
        mutate,
    } = useSWR<University[]>("/api/universities", fetcher);
    console.log("🚀 ~ UniversityList ~ universities:", universities);
    const [selectedUniversity, setSelectedUniversity] =
        useState<University | null>(null);

    const handleEdit = (university: University) => {
        setSelectedUniversity(university);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this university?")) {
            try {
                await fetcher(`/api/universities/${id}`, { method: "DELETE" });
                mutate(); // Re-fetch the data
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

            await fetcher(url, {
                method,
                body: JSON.stringify(formData),
            });

            setIsModalOpen(false);
            mutate();
        } catch (error) {
            console.error("Error saving university:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) return <div>Failed to load universities.</div>;

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[400px]">
                                University
                            </TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {universities?.map((university) => (
                            <TableRow key={university._id}>
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage
                                                src={university.image}
                                                alt={university.name}
                                            />
                                            <AvatarFallback>
                                                {university.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">
                                            {university.name}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>{university.address}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleEdit(university)
                                                }
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleDelete(university._id)
                                                }
                                                className="text-red-600 focus:text-red-600"
                                            >
                                                <Trash className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={
                    selectedUniversity ? "Edit University" : "Create University"
                }
            >
                <UniversityForm
                    university={selectedUniversity}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

// export default UniversityList;
//                     {universities?.map((university) => (
//                         <li key={university._id}>
//                             <div className="px-4 py-4 flex items-center justify-between sm:px-6">
//                                 <div className="flex items-center">
//                                     <div className="flex shrink-0 h-12 w-12 bg-gray-300 rounded-full items-center justify-center">
//                                         {university.image ? (
//                                             <img
//                                                 src={university.image}
//                                                 alt={university.name}
//                                                 className="h-12 w-12 rounded-full"
//                                             />
//                                         ) : (
//                                             <span className="text-gray-500 text-sm">
//                                                 No Image
//                                             </span>
//                                         )}
//                                     </div>
//                                     <div className="ml-4">
//                                         <h3 className="text-lg font-medium text-gray-900">
//                                             {university.name}
//                                         </h3>
//                                         <p className="text-sm text-gray-500">
//                                             {university.address}
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <div className="flex space-x-2">
//                                     <button
//                                         onClick={() => handleEdit(university)}
//                                         className="text-indigo-600 hover:text-indigo-900"
//                                     >
//                                         <Pencil className="h-5 w-5" />
//                                     </button>
//                                     <button
//                                         onClick={() =>
//                                             handleDelete(university._id)
//                                         }
//                                         className="text-red-600 hover:text-red-900"
//                                     >
//                                         <Trash className="h-5 w-5" />
//                                     </button>
//                                 </div>
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             <Modal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//                 title={
//                     selectedUniversity ? "Edit University" : "Create University"
//                 }
//             >
//                 <UniversityForm
//                     university={selectedUniversity}
//                     onSubmit={handleSubmit}
//                     onCancel={() => setIsModalOpen(false)}
//                 />
//             </Modal>
//         </div>
//     );
// };

export default UniversityList;
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
