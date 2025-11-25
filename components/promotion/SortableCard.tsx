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
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
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
            {...attributes}
            {...listeners}
            className="bg-white border rounded-lg shadow-sm p-3 flex items-center gap-4 relative hover:shadow-md transition-shadow"
        >
            <div className="flex items-center gap-3 w-8">
                <Checkbox checked={selected} onCheckedChange={onSelect} />
            </div>
            <div className="w-12 text-xs text-muted-foreground">
                #{index + 1}
            </div>
            <div className="w-40 h-20 border border-input rounded overflow-hidden bg-muted flex items-center justify-center">
                {promotion.image ? (
                    <img
                        src={promotion.image}
                        alt={promotion.textDesign || "Promotion image"}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-muted-foreground">No image</span>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                    {promotion.href || "-"}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                    {promotion.textDesign || "-"}
                </div>
            </div>
            <div className="ml-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
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
