"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import dayjs from "dayjs";
import useSWR from "swr";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import fetcher from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { IUniversity, IApplication } from "@/types";

interface IApplicationFormData
    extends Omit<
        IApplication,
        "_id" | "university" | "languageProficiency" | "others"
    > {
    university: string;
    languageProficiency: string;
    others: string;
}

interface ApplicationFormProps {
    application: IApplication | null;
    onSubmit: (formData: any) => Promise<void>;
    onCancel: () => void;
}

const getAcademicSessions = () => {
    const now = dayjs();
    // Academic year starts in October (month index 9).
    // If current month is Oct, Nov, Dec, the session has already rolled over for the next year.
    const startYearOfCurrentSession =
        now.month() >= 9 ? now.year() + 1 : now.year();

    return {
        previous: `${
            startYearOfCurrentSession - 1
        }-${startYearOfCurrentSession}`,
        current: `${startYearOfCurrentSession}-${
            startYearOfCurrentSession + 1
        }`,
        next: `${startYearOfCurrentSession + 1}-${
            startYearOfCurrentSession + 2
        }`,
    };
};

export default function ApplicationForm({
    application,
    onSubmit,
    onCancel,
}: ApplicationFormProps) {
    const {
        data: universities,
        isLoading,
        error,
    } = useSWR<IUniversity[]>("/api/universities", fetcher, {
        keepPreviousData: true,
        revalidateOnFocus: false,
        revalidateIfStale: false,
        dedupingInterval: 10000,
        shouldRetryOnError: true,
    });

    const academicSessions = getAcademicSessions();

    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<IApplicationFormData>({
        university: application?.university?._id || "",
        call: application?.call || "",
        session: application?.session || academicSessions.current,
        applicationLink: application?.applicationLink || "",
        admissionFee: application?.admissionFee || "No Fee",
        startDate: application?.startDate
            ? new Date(application.startDate).toISOString().split("T")[0]
            : "",
        endDate: application?.endDate
            ? new Date(application.endDate).toISOString().split("T")[0]
            : "",
        cgpa: application?.cgpa || "Not specified",
        languageProficiency: application?.languageProficiency?.join(", ") || "",
        others: application?.others?.join(", ") || "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, university: value });
    };

    const handleSessionChange = (value: string) => {
        setFormData({ ...formData, session: value });
    };

    const handleCallChange = (value: string) => {
        setFormData({ ...formData, call: value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const submissionData = {
                ...formData,
                languageProficiency: formData.languageProficiency
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                others: formData.others
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
            };
            await onSubmit(submissionData);
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="university">University</Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                        >
                            {formData.university
                                ? universities?.find(
                                      (uni) => uni._id === formData.university
                                  )?.name
                                : "Select a university..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        style={{
                            minWidth: "var(--radix-popover-trigger-width)",
                        }}
                    >
                        <Command>
                            <CommandInput placeholder="Search university..." />
                            <CommandList>
                                <CommandEmpty>
                                    No university found.
                                </CommandEmpty>
                                <CommandGroup>
                                    {universities?.map((uni) => (
                                        <CommandItem
                                            key={uni._id}
                                            value={uni.name}
                                            onSelect={() => {
                                                handleSelectChange(uni._id);
                                                setOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    formData.university ===
                                                        uni._id
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            {uni.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="call">Call</Label>
                    <Select
                        onValueChange={handleCallChange}
                        value={formData.call}
                    >
                        <SelectTrigger id="call" className="w-full">
                            <SelectValue placeholder="Select a Call" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="1st">1st</SelectItem>
                            <SelectItem value="2nd">2nd</SelectItem>
                            <SelectItem value="3rd">3rd</SelectItem>
                            <SelectItem value="4th">4th</SelectItem>
                            <SelectItem value="5th">5th</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="call">Session</Label>
                    <Select
                        onValueChange={handleSessionChange}
                        value={formData.session}
                    >
                        <SelectTrigger id="session" className="w-full">
                            <SelectValue placeholder="Select a session" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={academicSessions.previous}>
                                {academicSessions.previous}
                            </SelectItem>
                            <SelectItem value={academicSessions.current}>
                                {academicSessions.current}
                            </SelectItem>
                            <SelectItem value={academicSessions.next}>
                                {academicSessions.next}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        // required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        // required
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="applicationLink">Application Link</Label>
                <Input
                    id="applicationLink"
                    name="applicationLink"
                    value={formData.applicationLink}
                    onChange={handleChange}
                    type="url"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="admissionFee">Admission Fee</Label>
                    <Input
                        id="admissionFee"
                        name="admissionFee"
                        value={formData.admissionFee}
                        onChange={handleChange}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="cgpa">CGPA</Label>
                    <Input
                        id="cgpa"
                        name="cgpa"
                        value={formData.cgpa}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="languageProficiency">
                    Language Proficiency (comma-separated)
                </Label>
                <Input
                    id="languageProficiency"
                    name="languageProficiency"
                    value={formData.languageProficiency}
                    onChange={handleChange}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="others">
                    Other Requirements (comma-separated)
                </Label>
                <Input
                    id="others"
                    name="others"
                    value={formData.others}
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
                <Button type="submit" disabled={isSubmitting}>
                    {application ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    );
}
