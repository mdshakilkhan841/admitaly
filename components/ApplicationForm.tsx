"use client";
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
