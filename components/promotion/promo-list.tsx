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
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { IPromotion } from "@/types";
import SortableCard from "./SortableCard";

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
    const [statusFilter, setStatusFilter] = useState<
        "all" | "active" | "archived"
    >("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");

    // Clear selection when either filter changes to avoid mismatch with visible items
    React.useEffect(() => {
        setSelectedRows(new Set());
    }, [statusFilter, typeFilter]);

    const filteredPromotions = useMemo(() => {
        if (!promotions) return [];
        // sort by order then filter by search
        const sorted = [...promotions].sort(
            (a, b) => (a.order ?? 0) - (b.order ?? 0)
        );
        return sorted.filter((promo) => {
            const matchesText =
                promo.href?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                promo.textDesign
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || promo.status === statusFilter;

            const matchesType =
                typeFilter === "all" || promo.type === typeFilter;

            return matchesText && matchesStatus && matchesType;
        });
    }, [promotions, searchQuery, statusFilter, typeFilter]);

    // Local order state for drag-and-drop
    const [items, setItems] = useState<string[]>([]);
    React.useEffect(() => {
        if (filteredPromotions) {
            setItems(filteredPromotions.map((p) => p._id));
        }
    }, [filteredPromotions]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    async function handleDragEnd(event: any) {
        const { active, over } = event;
        if (!over) return;
        if (active.id !== over.id) {
            const oldIndex = items.indexOf(active.id);
            const newIndex = items.indexOf(over.id);
            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);

            // Persist order to backend
            try {
                await axios.patch(url, { order: newItems });
                mutate();
                toast.success("Order updated");
            } catch (error) {
                console.error("Failed to update order:", error);
                toast.error("Failed to persist order");
            }
        }
    }

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

    const handleSelectAll = () => {
        if (selectedRows.size === filteredPromotions.length) {
            // Deselect all
            setSelectedRows(new Set());
        } else {
            // Select all
            setSelectedRows(new Set(filteredPromotions.map((p) => p._id)));
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
            {/* {filteredPromotions.length > 0 && ( */}
            <div className="flex items-center gap-3 mb-4 flex-wrap justify-between">
                <div className="flex items-center gap-2">
                    <div
                        onClick={handleSelectAll}
                        className="flex items-center gap-2 p-1"
                    >
                        <Checkbox
                            checked={
                                selectedRows.size ===
                                    filteredPromotions.length &&
                                filteredPromotions.length > 0
                            }
                            onCheckedChange={() => handleSelectAll()}
                        />
                        <span>Select All</span>
                    </div>
                    {selectedRows.size > 0 && (
                        <>
                            <span className="text-sm text-gray-600">
                                {selectedRows.size} selected
                            </span>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleBulkDelete}
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete Selected
                            </Button>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                        Filters:
                    </span>
                    <Select
                        onValueChange={(v) =>
                            setStatusFilter(v as "all" | "active" | "archived")
                        }
                        value={statusFilter}
                    >
                        <SelectTrigger id="status-filter" className="w-28">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        onValueChange={(v) => setTypeFilter(v)}
                        value={typeFilter}
                    >
                        <SelectTrigger id="type-filter" className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All types</SelectItem>
                            <SelectItem value="promo">Promo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {/* )} */}
            {filteredPromotions.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded border border-dashed border-gray-200 bg-gray-50 py-12">
                    <p className="text-base font-medium text-gray-900">
                        No data found
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        Try adjusting your filters or search
                    </p>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="flex flex-col gap-3">
                            {items.map((id, index) => {
                                const promotion = filteredPromotions.find(
                                    (p) => p._id === id
                                );
                                if (!promotion) return null;
                                return (
                                    <SortableCard
                                        key={promotion._id}
                                        promotion={promotion}
                                        index={index}
                                        selected={selectedRows.has(
                                            promotion._id
                                        )}
                                        onSelect={(checked: boolean) => {
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
                                        onEdit={() => handleEdit(promotion)}
                                        onDelete={() =>
                                            handleDelete(promotion._id)
                                        }
                                    />
                                );
                            })}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

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
