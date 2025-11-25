"use client";
import React, { useMemo, useState } from "react";
import useSWR from "swr";
import Modal from "../Modal";
import PromoForm from "./promo-form";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { IPromotion } from "@/types";

const PromoList = ({
    isModalOpen,
    setIsModalOpen,
    searchQuery,
}: {
    isModalOpen: boolean;
    setIsModalOpen: any;
    searchQuery: string;
}) => {
    const url = `/api/promotions`;
    const {
        data: promotions,
        error,
        isLoading,
        mutate,
    } = useSWR<IPromotion[]>(url, fetcher, {
        keepPreviousData: true,
        revalidateOnFocus: false,
        revalidateIfStale: false,
        dedupingInterval: 10000,
        shouldRetryOnError: true,
    });

    const [selectedPromotion, setSelectedPromotion] =
        useState<IPromotion | null>(null);

    const [selectedRows, setSelectedRows] = useState(new Set<string>());

    const filteredPromotions = useMemo(() => {
        if (!promotions) return [];

        // 1. Filter based on searchQuery
        const filtered = promotions.filter(
            (promo) =>
                promo.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                promo.href?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // 2. Sort based on sortBy

        return filtered;
    }, [promotions, searchQuery]);

    const handleEdit = (promotion: IPromotion) => {
        setSelectedPromotion(promotion);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this promotion?")) {
            try {
                await axios.delete(`/api/promotions/${id}`);
                mutate(); // Re-fetch the data
                toast.success("Promotion deleted successfully");
            } catch (error) {
                console.error("Error deleting promotion:", error);
                toast.error("Failed to delete promotion");
            }
        }
    };

    const handleBulkDelete = async () => {
        if (
            confirm(
                `Are you sure you want to delete ${selectedRows.size} promotions?`
            )
        ) {
            try {
                await axios.delete(`/api/promotions`, {
                    data: { ids: Array.from(selectedRows) },
                });
                mutate();
                setSelectedRows(new Set());
                toast.success("Selected promotions deleted successfully");
            } catch (error) {
                console.error("Error deleting promotions:", error);
                toast.error("Failed to delete selected promotions");
            }
        }
    };

    const handleSubmit = async (
        formData: FormData,
        existingPromotion?: IPromotion | null
    ): Promise<any> => {
        try {
            const url = existingPromotion
                ? `/api/promotions/${existingPromotion._id}`
                : "/api/promotions";

            const method = existingPromotion ? "PUT" : "POST";

            if (method === "POST") {
                await axios.post(url, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } else {
                await axios.put(url, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }
            setIsModalOpen(false);
            mutate();
            toast.success(
                existingPromotion
                    ? "Promotion updated successfully"
                    : "Promotion created successfully"
            );
        } catch (error) {
            console.error("Error saving promotion:", error);
            toast.error("Failed to save promotion");
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

    if (error) return <div>Failed to load promotions.</div>;

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
                                            filteredPromotions?.length &&
                                        filteredPromotions.length > 0
                                    }
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedRows(
                                                new Set(
                                                    filteredPromotions.map(
                                                        (p) => p._id
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
                            <TableHead className="font-semibold">
                                Image
                            </TableHead>
                            <TableHead className="font-semibold">URL</TableHead>
                            <TableHead className="font-semibold">
                                Design Text
                            </TableHead>
                            <TableHead className="text-right font-semibold w-[100px]">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPromotions?.map((promotion, index) => (
                            <TableRow key={promotion._id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedRows.has(
                                            promotion._id
                                        )}
                                        onCheckedChange={(checked) => {
                                            setSelectedRows((prev) => {
                                                const newSet = new Set(prev);
                                                if (checked) {
                                                    newSet.add(promotion._id);
                                                } else {
                                                    newSet.delete(
                                                        promotion._id
                                                    );
                                                }
                                                return newSet;
                                            });
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    {promotion.image ? (
                                        <div className="w-96 border border-input rounded-lg overflow-hidden">
                                            <img
                                                src={promotion.image}
                                                alt={promotion.type}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-72 h-32 border border-input rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                                            No image
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {promotion.href ? (
                                        <a
                                            href={promotion.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline truncate block max-w-xs"
                                        >
                                            {promotion.href}
                                        </a>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">
                                            -
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground truncate block max-w-xs">
                                        {promotion.textDesign || "-"}
                                    </span>
                                </TableCell>
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
                                                    handleEdit(promotion)
                                                }
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleDelete(promotion._id)
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
                    setSelectedPromotion(null);
                }}
                title={
                    selectedPromotion ? "Edit Promotion" : "Create Promotion"
                }
            >
                <PromoForm
                    promotion={selectedPromotion}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setSelectedPromotion(null);
                    }}
                />
            </Modal>
        </div>
    );
};

export default PromoList;
