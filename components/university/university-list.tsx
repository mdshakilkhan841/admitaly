"use client";
import React, { useMemo, useState } from "react";
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
import { IUniversity } from "@/types";

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
    const url = `/api/universities`;
    const {
        data: universities,
        error,
        isLoading,
        mutate,
    } = useSWR<IUniversity[]>(url, fetcher);

    const [selectedUniversity, setSelectedUniversity] =
        useState<IUniversity | null>(null);

    const [selectedRows, setSelectedRows] = useState(new Set<string>());

    const filteredUniversities = useMemo(() => {
        if (!universities) return [];

        // 1. Filter based on searchQuery
        const filtered = universities.filter((uni) =>
            uni.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // 2. Sort based on sortBy
        const [sortField, sortDirection] = sortBy.split(":");
        const sorted = [...filtered].sort((a, b) => {
            let fieldA: any;
            let fieldB: any;

            if (sortField === "name") {
                fieldA = a.uniId?.toLowerCase();
                fieldB = b.uniId?.toLowerCase();
            }

            if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
            if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [universities, searchQuery, sortBy]);

    const handleEdit = (university: IUniversity) => {
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
                `Are you sure you want to delete ${selectedRows.size} universities?`
            )
        ) {
            try {
                await axios.delete(`/api/universities`, {
                    data: { ids: Array.from(selectedRows) },
                });
                mutate();
                setSelectedRows(new Set());
                toast.success("Selected universities deleted successfully");
            } catch (error) {
                console.error("Error deleting universities:", error);
                toast.error("Failed to delete selected universities");
            }
        }
    };

    const handleSubmit = async (
        formData: Omit<IUniversity, "_id">
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
            {selectedRows.size > 0 && (
                <div className="flex items-center gap-2 mb-4">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleBulkDelete}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Selected ({selectedRows.size})
                    </Button>
                </div>
            )}
            <div className="rounded-md border overflow-auto">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={
                                        selectedRows.size ===
                                            filteredUniversities?.length &&
                                        filteredUniversities.length > 0
                                    }
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedRows(
                                                new Set(
                                                    filteredUniversities.map(
                                                        (u) => u._id
                                                    )
                                                )
                                            );
                                        } else {
                                            setSelectedRows(new Set());
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
                        {filteredUniversities?.map((university, index) => (
                            <TableRow key={university._id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedRows.has(
                                            university._id
                                        )}
                                        onCheckedChange={(checked) => {
                                            setSelectedRows((prev) => {
                                                const newSet = new Set(prev);
                                                if (checked) {
                                                    newSet.add(university._id);
                                                } else {
                                                    newSet.delete(
                                                        university._id
                                                    );
                                                }
                                                return newSet;
                                            });
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage />
                                            <AvatarFallback>
                                                {university.uniId
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Avatar>
                                            <AvatarImage
                                                src={university.image}
                                                alt={university.name}
                                            />
                                            <AvatarFallback>
                                                {university.uniId
                                                    ?.charAt(0)
                                                    .toUpperCase()}
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
