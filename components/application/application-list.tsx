import fetcher from "@/lib/fetcher";
import axios from "axios";
import {
    formatDisplayDate,
    formatDeadlineStatus,
    getUniversityStatus,
    getDaysUntilDeadline,
    getStatusColor,
} from "@/lib/deadline-utils";
import { toast } from "sonner";

import React, { useState } from "react";
import useSWR from "swr";
import Modal from "../Modal";
import {
    MoreHorizontal,
    Pencil,
    Trash,
    LinkIcon,
    CalendarDays,
    GraduationCap,
    DollarSign,
    Languages,
    Info,
    EuroIcon,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ApplicationForm from "@/components/application/application-form";
import { Badge } from "@/components/ui/badge";
import { IUniversity, IApplication } from "@/types";

interface IApplicationFormData
    extends Omit<IApplication, "_id" | "university"> {
    university: string;
}

const ApplicationList = ({
    isModalOpen,
    setIsModalOpen,
    searchQuery,
    sortBy,
}: {
    isModalOpen: boolean;
    setIsModalOpen: any;
    searchQuery: string;
    sortBy: string;
}) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (sortBy) params.set("sortBy", sortBy);

    const url = `/api/applications`;

    const {
        data: applications,
        error,
        isLoading,
        mutate,
    } = useSWR<IApplication[]>(url, fetcher, {
        keepPreviousData: true,
        revalidateOnFocus: false,
        revalidateIfStale: false,
        dedupingInterval: 10000,
        shouldRetryOnError: true,
    });

    const [selectedApplication, setSelectedApplication] =
        useState<IApplication | null>(null);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const handleEdit = (application: IApplication) => {
        setSelectedApplication(application);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this application?")) {
            try {
                await axios.delete(`/api/applications/${id}`);
                mutate();
                toast.success("Application deleted successfully");
            } catch (error) {
                console.error("Error deleting application:", error);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (
            confirm(
                `Are you sure you want to delete ${selectedRows.length} applications?`
            )
        ) {
            try {
                await axios.delete(`/api/applications`, {
                    data: { ids: selectedRows },
                });
                mutate();
                setSelectedRows([]);
                toast.success("Applications deleted successfully");
            } catch (error) {
                console.error("Error deleting applications:", error);
            }
        }
    };

    const handleSubmit = async (formData: IApplicationFormData) => {
        try {
            const url = selectedApplication
                ? `/api/applications/${selectedApplication._id}`
                : "/api/applications";

            const method = selectedApplication ? "PUT" : "POST";

            if (method === "POST") {
                await axios.post(url, formData);
            } else {
                await axios.put(url, formData);
            }
            setIsModalOpen(false);
            mutate();
            toast.success(
                selectedApplication
                    ? "Application updated successfully"
                    : "Application created successfully"
            );
        } catch (error) {
            console.error("Error saving application:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) return <div>Failed to load applications.</div>;

    return (
        <div>
            {selectedRows.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleBulkDelete}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Selected ({selectedRows.length})
                    </Button>
                </div>
            )}
            <div className="rounded-md border hidden md:block">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={
                                        selectedRows.length ===
                                            applications?.length &&
                                        (applications?.length ?? 0) > 0
                                    }
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedRows(
                                                applications?.map(
                                                    (u) => u._id
                                                ) || []
                                            );
                                        } else {
                                            setSelectedRows([]);
                                        }
                                    }}
                                />
                            </TableHead>
                            <TableHead>University</TableHead>
                            <TableHead className="hidden md:table-cell">
                                Call
                            </TableHead>
                            <TableHead className="hidden lg:table-cell">
                                Start Date
                            </TableHead>
                            <TableHead>Deadline</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Days Left</TableHead>
                            <TableHead className="hidden lg:table-cell">
                                Fee
                            </TableHead>
                            <TableHead className="hidden lg:table-cell">
                                CGPA
                            </TableHead>
                            <TableHead className="hidden lg:table-cell">
                                Language
                            </TableHead>
                            <TableHead className="hidden lg:table-cell">
                                Others
                            </TableHead>
                            <TableHead>Link</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications?.map((application) => (
                            <TableRow key={application._id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedRows.includes(
                                            application._id
                                        )}
                                        onCheckedChange={(checked) => {
                                            setSelectedRows(
                                                checked
                                                    ? [
                                                          ...selectedRows,
                                                          application._id,
                                                      ]
                                                    : selectedRows.filter(
                                                          (id) =>
                                                              id !==
                                                              application._id
                                                      )
                                            );
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage
                                                src={
                                                    application.university
                                                        ?.image
                                                }
                                                alt={
                                                    application.university?.name
                                                }
                                            />
                                            <AvatarFallback>
                                                {application.university?.name?.charAt(
                                                    0
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">
                                            {application.university?.name}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {application.call}
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                    {formatDisplayDate(application.startDate)}
                                </TableCell>
                                <TableCell>
                                    {formatDisplayDate(application.endDate)}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={getStatusColor(
                                            getUniversityStatus(
                                                application.startDate,
                                                application.endDate
                                            )
                                        )}
                                    >
                                        {formatDeadlineStatus(
                                            getUniversityStatus(
                                                application.startDate,
                                                application.endDate
                                            )
                                        )}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span className="font-medium">
                                        {getDaysUntilDeadline(
                                            application.endDate
                                        ) > 0
                                            ? `${getDaysUntilDeadline(
                                                  application.endDate
                                              )} days`
                                            : "Passed"}
                                    </span>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                    {application.admissionFee}
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                    {application.cgpa}
                                </TableCell>

                                <TableCell className="hidden lg:table-cell">
                                    {application.languageProficiency.join(", ")}
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                    {application.others.join(", ")}
                                </TableCell>
                                <TableCell>
                                    {application.applicationLink ? (
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="icon"
                                        >
                                            <a
                                                href={
                                                    application.applicationLink
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Application Link"
                                            >
                                                <LinkIcon className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">
                                            N/A
                                        </span>
                                    )}
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
                                                    handleEdit(application)
                                                }
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleDelete(
                                                        application._id
                                                    )
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
            {/* Mobile Card View */}
            <div className="grid gap-4 md:hidden">
                {applications?.map((application) => {
                    const hasDetails =
                        application.languageProficiency.length > 0 ||
                        application.others.length > 0;
                    const status = getUniversityStatus(
                        application.startDate,
                        application.endDate
                    );
                    const daysLeft = getDaysUntilDeadline(application.endDate);
                    return (
                        <div
                            key={application._id}
                            className="rounded-lg border bg-card text-card-foreground shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-4 p-3">
                                <div className="flex items-start gap-4">
                                    <Checkbox
                                        checked={selectedRows.includes(
                                            application._id
                                        )}
                                        onCheckedChange={(checked) => {
                                            setSelectedRows(
                                                checked
                                                    ? [
                                                          ...selectedRows,
                                                          application._id,
                                                      ]
                                                    : selectedRows.filter(
                                                          (id) =>
                                                              id !==
                                                              application._id
                                                      )
                                            );
                                        }}
                                        className="mt-1"
                                    />
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage
                                                src={
                                                    application.university
                                                        ?.image
                                                }
                                                alt={
                                                    application.university?.name
                                                }
                                            />
                                            <AvatarFallback>
                                                {application.university?.name?.charAt(
                                                    0
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">
                                                {application.university?.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {application.call}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="-mt-2 -mr-2"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleEdit(application)
                                            }
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />{" "}
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleDelete(application._id)
                                            }
                                            className="text-red-600 focus:text-red-600"
                                        >
                                            <Trash className="mr-2 h-4 w-4" />{" "}
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="space-y-2 px-3 pb-3">
                                <div className="flex justify-between items-center text-sm p-2 bg-muted/50 rounded-md">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">
                                                Start:
                                            </span>
                                            <span>
                                                {formatDisplayDate(
                                                    application.startDate
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">
                                                End:
                                            </span>
                                            <span>
                                                {formatDisplayDate(
                                                    application.endDate
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge
                                            className={getStatusColor(status)}
                                        >
                                            {formatDeadlineStatus(status)}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {daysLeft > 0
                                                ? `${daysLeft} days left`
                                                : "Deadline Passed"}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-1 text-sm">
                                    <div className="flex items-center gap-2">
                                        <EuroIcon className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">
                                            Fee:
                                        </span>
                                        <span>{application.admissionFee}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">
                                            CGPA:
                                        </span>
                                        <span>{application.cgpa}</span>
                                    </div>
                                </div>

                                {hasDetails && (
                                    <div className="space-y-2 pt-2 border-t">
                                        {application.languageProficiency
                                            .length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center gap-2">
                                                    <Languages className="h-4 w-4" />{" "}
                                                    Language
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {application.languageProficiency.map(
                                                        (lang) => (
                                                            <span
                                                                key={lang}
                                                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                                                            >
                                                                {lang}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {application.others.length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center gap-2">
                                                    <Info className="h-4 w-4" />{" "}
                                                    Others
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {application.others.map(
                                                        (other) => (
                                                            <span
                                                                key={other}
                                                                className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
                                                            >
                                                                {other}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="border-t bg-muted/50 p-3">
                                <Button asChild className="w-full">
                                    <a
                                        href={application.applicationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <LinkIcon className="mr-2 h-4 w-4" />{" "}
                                        Apply Now
                                    </a>
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedApplication(null);
                }}
                title={
                    selectedApplication
                        ? "Edit Application"
                        : "Create Application"
                }
            >
                <ApplicationForm
                    application={selectedApplication}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setSelectedApplication(null);
                    }}
                />
            </Modal>
        </div>
    );
};

export default ApplicationList;
