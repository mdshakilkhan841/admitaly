import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, GripVertical } from "lucide-react";
import { IPromotion } from "@/types";

interface SortableCardProps {
    promotion: IPromotion;
    index: number;
    selected: boolean;
    onSelect: (checked: boolean) => void;
    onEdit: () => void;
    onDelete: () => void;
}

const SortableCard: React.FC<SortableCardProps> = ({
    promotion,
    index,
    selected,
    onSelect,
    onEdit,
    onDelete,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: promotion._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-white border-2 rounded-lg shadow p-2 md:p-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 transition-all duration-200 ${
                isDragging
                    ? "border-blue-500 bg-blue-50 shadow-lg md:scale-105"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-lg"
            }`}
            {...attributes}
            {...listeners}
        >
            {/* Top Row: Drag Handle, Checkbox, Index (Mobile) / Full Row (Desktop) */}
            <div className="flex items-center gap-2 md:gap-4 md:flex-row">
                {/* Drag Handle */}
                <div
                    className={`shrink-0 p-2 rounded cursor-grab active:cursor-grabbing transition-colors hidden md:flex ${
                        isDragging
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-600 group-hover:bg-blue-100"
                    }`}
                    title="Drag to reorder"
                >
                    <GripVertical className="h-5 w-5" />
                </div>

                {/* Checkbox */}
                <div className="shrink-0">
                    <Checkbox checked={selected} onCheckedChange={onSelect} />
                </div>

                {/* Index */}
                <div className="shrink-0 w-8 text-center text-xs font-semibold text-gray-500 bg-gray-100 rounded px-2 py-1">
                    #{index + 1}
                </div>

                {/* Mobile Drag Handle (Visible on Mobile) */}
                <div
                    className={`shrink-0 p-1 rounded cursor-grab active:cursor-grabbing transition-colors md:hidden ${
                        isDragging
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-600"
                    }`}
                    title="Drag to reorder"
                >
                    <GripVertical className="h-4 w-4" />
                </div>
            </div>

            {/* Image Preview */}
            <div className="shrink-0 w-full md:w-96 h-auto border border-gray-300 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center hover:border-gray-400 transition-colors">
                {promotion.image ? (
                    <img
                        src={promotion.image}
                        alt={promotion.textDesign || "Promotion"}
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <div className="text-xs text-gray-400 text-center px-2 flex flex-col justify-center min-h-10">
                        <span>
                            {promotion.textDesign
                                ? "Text Design"
                                : "No content"}
                        </span>
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0 md:min-w-60">
                <div className="text-sm md:text-base font-semibold text-gray-900 truncate">
                    {promotion.href ? (
                        <a
                            href={promotion.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate"
                        >
                            {promotion.href}
                        </a>
                    ) : (
                        <span className="text-gray-400">No URL</span>
                    )}
                </div>
                {promotion.textDesign && (
                    <div className="text-xs text-gray-600 truncate mt-1 bg-amber-50 px-2 py-1 rounded w-fit">
                        {promotion.textDesign}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="shrink-0 self-end md:self-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-gray-100"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onEdit}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={onDelete}
                            className="text-red-600 focus:text-red-600"
                        >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default SortableCard;
