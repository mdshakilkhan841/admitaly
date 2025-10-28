import React from "react";
import { buttonVariants } from "./ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

function AddNewButton({ setIsModalOpen }: { setIsModalOpen: any }) {
    return (
        <button
            onClick={() => setIsModalOpen(true)}
            className={cn(buttonVariants(), "text-xs md:text-sm")}
        >
            <Plus className="mr-2 h-4 w-4" />
            Add New
        </button>
    );
}

export default AddNewButton;
