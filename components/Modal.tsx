"use client";
import { ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: Props) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg grid-rows-[auto_minmax(0,1fr)] max-h-[90dvh] p-0">
                <DialogHeader className="p-6 pb-2">
                    {title && <DialogTitle>{title}</DialogTitle>}
                </DialogHeader>
                <div className="overflow-y-auto px-6 pb-6">{children}</div>
            </DialogContent>
        </Dialog>
    );
}
