"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { IUniversity } from "@/types";

interface UniversityFormProps {
    university: IUniversity | null;
    onSubmit: (formData: Omit<IUniversity, "_id">) => Promise<any>;
    onCancel: () => void;
}

export default function UniversityForm({
    university,
    onSubmit,
    onCancel,
}: UniversityFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Omit<IUniversity, "_id">>({
        name: university?.name || "",
        address: university?.address || "",
        image: university?.image || "",
        altImage: university?.altImage || "",
        uniId: university?.uniId || "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSwipeImage = () => {
        setFormData({
            ...formData,
            image: formData.altImage,
            altImage: formData.image,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="name">
                    Uni-ID
                    <span className="text-xs font-normal">
                        (Make it unique e.g. sapienza-roma, milan-bicocca)
                    </span>
                </Label>
                <Input
                    type="text"
                    name="uniId"
                    id="uniId"
                    required
                    value={formData.uniId}
                    onChange={handleChange}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="name">University Name</Label>
                <Input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                    name="image"
                    id="image"
                    value={formData.image}
                    onChange={handleChange}
                />
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSwipeImage}
            >
                <ArrowUpDown className="h-4 w-4" />
            </Button>

            <div className="grid gap-2">
                <Label htmlFor="image">Alternate Image URL</Label>
                <Input
                    name="altImage"
                    id="altImage"
                    value={formData.altImage}
                    onChange={handleChange}
                />
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
                    {university ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    );
}
