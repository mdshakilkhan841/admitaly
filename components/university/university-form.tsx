"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface University {
    _id?: string;
    name: string;
    address: string;
    image: string;
}

interface UniversityFormProps {
    university: University | null;
    onSubmit: (formData: Omit<University, "_id">) => void;
    onCancel: () => void;
}

export default function UniversityForm({
    university,
    onSubmit,
    onCancel,
}: UniversityFormProps) {
    const [formData, setFormData] = useState<Omit<University, "_id">>({
        name: university?.name || "",
        address: university?.address || "",
        image: university?.image || "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">
                    {university ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    );
}
