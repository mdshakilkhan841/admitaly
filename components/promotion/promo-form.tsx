"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { IPromotion } from "@/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PromoFormProps {
    promotion: IPromotion | null;
    onSubmit: (
        formData: FormData,
        promotion?: IPromotion | null
    ) => Promise<any>;
    onCancel: () => void;
}

export default function PromoForm({
    promotion,
    onSubmit,
    onCancel,
}: PromoFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>(
        promotion?.image || ""
    );
    const [formData, setFormData] = useState({
        type: promotion?.type || "promo",
        href: promotion?.href || "",
        textDesign: promotion?.textDesign || "",
        status: promotion?.status || "active",
    });
    const [file, setFile] = useState<File | null>(null);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const form = new FormData();
            form.append("type", formData.type);
            form.append("href", formData.href);
            form.append("textDesign", formData.textDesign);
            form.append("status", formData.status);

            if (file) {
                form.append("file", file);
            }

            await onSubmit(form, promotion);
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="type">Promotion Type</Label>
                    <Select
                        onValueChange={(value) =>
                            setFormData({ ...formData, type: value })
                        }
                        value={formData.type}
                    >
                        <SelectTrigger id="type" className="w-full">
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="promo">Promo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        onValueChange={(value) =>
                            setFormData({ ...formData, status: value })
                        }
                        value={formData.status}
                    >
                        <SelectTrigger id="status" className="w-full">
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="href">Promotion Link (URL)</Label>
                <Input
                    type="url"
                    name="href"
                    id="href"
                    placeholder="https://example.com"
                    value={formData.href}
                    onChange={handleChange}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="textDesign">Text Design / Description</Label>
                <textarea
                    name="textDesign"
                    id="textDesign"
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    rows={3}
                    placeholder="Enter text design or promotional text"
                    value={formData.textDesign}
                    onChange={handleChange}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="image">Promotion Image</Label>
                {imagePreview && (
                    <div className="w-full mb-4 rounded-lg overflow-hidden border border-input">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}
                <div
                    className="w-full px-4 py-8 border-2 border-dashed border-input rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onDrop={(e) => {
                        e.preventDefault();
                        const droppedFile = e.dataTransfer.files?.[0];
                        if (
                            droppedFile &&
                            droppedFile.type.startsWith("image/")
                        ) {
                            setFile(droppedFile);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setImagePreview(reader.result as string);
                            };
                            reader.readAsDataURL(droppedFile);
                        }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => e.preventDefault()}
                >
                    <Input
                        type="file"
                        name="image"
                        id="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                        className="hidden"
                    />
                    <label
                        htmlFor="image"
                        className="w-full text-center cursor-pointer"
                    >
                        <div className="text-sm text-muted-foreground">
                            <p className="font-medium text-foreground mb-1">
                                Drag and drop your image here
                            </p>
                            <p>or click to select a file</p>
                        </div>
                    </label>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="w-24">
                    {isSubmitting && (
                        <Loader2
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                        />
                    )}
                    {promotion ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    );
}
