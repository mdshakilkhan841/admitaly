"use client";

import { useState, useMemo } from "react";
import ApplicationCard from "@/components/application/application-card";
import { getApplicationStatus } from "@/lib/deadline-utils";
import FilterBar from "@/components/filter-bar";
import Header from "@/components/header";
import { IApplication } from "@/types";
import SkeletonApplicationCard from "@/components/skeleton/skeleton-application-card";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";

export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const {
        data: applications = [],
        error,
        isLoading,
    } = useSWR<IApplication[]>("/api/applications", fetcher, {
        keepPreviousData: true,
        dedupingInterval: 10000,
        shouldRetryOnError: true,
    });
    console.log("🚀 ~ Home ~ applications:", applications);

    const filteredApplications = useMemo(() => {
        if (!applications) {
            return [];
        }

        const applicationsWithStatus = applications.map((application) => ({
            ...application,
            status: getApplicationStatus(
                application.startDate,
                application.endDate
            ),
        }));

        const sorted = applicationsWithStatus.sort((a, b) => {
            // Rule 1: 'closed' items always go to the bottom.
            if (a.status === "closed" && b.status !== "closed") {
                return 1; // a comes after b
            }
            if (a.status !== "closed" && b.status === "closed") {
                return -1; // a comes before b
            }

            // Rule 2: For items with the same status group (all non-closed or all closed),
            // sort by the deadline date in ascending order (nearest deadline first).
            const dateA = a.endDate ? new Date(a.endDate).getTime() : Infinity;
            const dateB = b.endDate ? new Date(b.endDate).getTime() : Infinity;
            return dateA - dateB;
        });

        return sorted.filter((application) => {
            const matchesSearch =
                application.university.name
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                application.cgpa
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilter === "all" ||
                application.status === statusFilter ||
                application.applicationFee === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [applications, searchQuery, statusFilter]);

    return (
        <main className="min-h-screen bg-background">
            <Header />

            <div className="sticky top-0 z-10 bg-gray-100 p-3 border border-gray-200">
                <div className="container mx-auto space-y-2 sm:px-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search universities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <FilterBar
                        statusFilter={statusFilter}
                        onStatusChange={setStatusFilter}
                    />
                </div>
            </div>
            <div className="container mx-auto py-4">
                {/* Notice Bar */}
                <div className="mb-4 rounded border border-purple-200 bg-purple-50 p-2 text-xs text-purple-500 mx-3 overflow-hidden">
                    <p className="text-center">
                        Data for 2026/2027 intake will be updated once
                        universities open admissions.
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mx-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <SkeletonApplicationCard key={index} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center text-red-500">
                        Failed to load applications.
                    </div>
                ) : filteredApplications.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mx-3">
                        {filteredApplications.map((application) => (
                            <ApplicationCard
                                key={application._id}
                                application={application}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded border border-dashed border-gray-200 bg-gray-50 py-6 mx-3">
                        <p className="text-sm font-medium text-gray-900">
                            No universities found
                        </p>
                        <p className="text-xs text-gray-600">
                            Try adjusting your search or filters
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
