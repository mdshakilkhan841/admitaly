"use client";
import React, { useState } from "react";
import useSWR from "swr";
import Modal from "../Modal";
import UniversityForm from "./university-form";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import axios from "axios";
import fetcher from "@/lib/fetcher";
import { toast } from "sonner";
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
import { Checkbox } from "@/components/ui/checkbox";

interface University {
    _id: string;
    name: string;
    address: string;
    image: string;
}

const UniversityList = ({
    isModalOpen,
    setIsModalOpen,
    searchQuery,
    sortBy,
}: {
    isModalOpen: boolean;
    setIsModalOpen: any;
    searchQuery: string;
    sortBy: string;
}) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (sortBy) params.set("sortBy", sortBy);

    const url = `/api/universities`;

    const {
        data: universities,
        error,
        isLoading,
        mutate,
    } = useSWR<University[]>(url, fetcher);
    const [selectedUniversity, setSelectedUniversity] =
        useState<University | null>(null);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const handleEdit = (university: University) => {
        setSelectedUniversity(university);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this university?")) {
            try {
                await axios.delete(`/api/universities/${id}`);
                mutate(); // Re-fetch the data
                toast.success("University deleted successfully");
            } catch (error) {
                console.error("Error deleting university:", error);
                toast.error("Failed to delete university");
            }
        }
    };

    const handleBulkDelete = async () => {
        if (
            confirm(
                `Are you sure you want to delete ${selectedRows.length} universities?`
            )
        ) {
            try {
                await axios.delete(`/api/universities`, {
                    data: { ids: selectedRows },
                });
                mutate();
                setSelectedRows([]);
                toast.success("Selected universities deleted successfully");
            } catch (error) {
                console.error("Error deleting universities:", error);
                toast.error("Failed to delete selected universities");
            }
        }
    };

    const handleSubmit = async (
        formData: Omit<University, "_id">
    ): Promise<any> => {
        try {
            const url = selectedUniversity
                ? `/api/universities/${selectedUniversity._id}`
                : "/api/universities";

            const method = selectedUniversity ? "PUT" : "POST";

            if (method === "POST") {
                await axios.post(url, formData);
            } else {
                await axios.put(url, formData);
            }
            setIsModalOpen(false);
            mutate();
            toast.success(
                selectedUniversity
                    ? "University updated successfully"
                    : "University created successfully"
            );
        } catch (error) {
            console.error("Error saving university:", error);
            toast.error("Failed to save university");
            throw error; // Re-throw error to be caught in the form
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
            {selectedRows.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleBulkDelete}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Selected ({selectedRows.length})
                    </Button>
                </div>
            )}
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={
                                        selectedRows.length ===
                                            universities?.length &&
                                        universities.length > 0
                                    }
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedRows(
                                                universities?.map(
                                                    (u) => u._id
                                                ) || []
                                            );
                                        } else {
                                            setSelectedRows([]);
                                        }
                                    }}
                                />
                            </TableHead>
                            <TableHead className="w-16">#</TableHead>
                            <TableHead className="w-[400px] font-semibold">
                                University
                            </TableHead>
                            <TableHead className="font-semibold">
                                Address
                            </TableHead>
                            <TableHead className="text-right font-semibold w-[100px]">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {universities?.map((university, index) => (
                            <TableRow key={university._id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedRows.includes(
                                            university._id
                                        )}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedRows([
                                                    ...selectedRows,
                                                    university._id,
                                                ]);
                                            } else {
                                                setSelectedRows(
                                                    selectedRows.filter(
                                                        (id) =>
                                                            id !==
                                                            university._id
                                                    )
                                                );
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{index + 1}</TableCell>
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
                                <TableCell className="text-right pr-6">
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
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedUniversity(null);
                }}
                title={
                    selectedUniversity ? "Edit University" : "Create University"
                }
            >
                <UniversityForm
                    university={selectedUniversity}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setSelectedUniversity(null);
                    }}
                />
            </Modal>
        </div>
    );
};

export default UniversityList;
