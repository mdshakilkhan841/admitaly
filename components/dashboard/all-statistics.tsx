"use client";
import React from "react";
import useSWR from "swr";
import {
    AlertTriangle,
    Building2,
    CheckCircle2,
    Clock,
    GraduationCap,
    NotebookPen,
} from "lucide-react";
import StatsCard from "./stats-card";
import { Card } from "@/components/ui/card";
import ApplicationsTable from "./applications-table";
import fetcher from "@/lib/fetcher";
import { XCircle } from "lucide-react";
import { formatDisplayDate } from "@/lib/deadline-utils";

const AllStatistics = () => {
    const { data: stats, error } = useSWR("/api/statistics", fetcher, {
        revalidateOnFocus: false,
    });
    console.log("🚀 ~ AllStatistics ~ stats:", stats);

    if (error) return <div>Failed to load statistics.</div>;
    if (!stats) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    const recentApplicationsForTable =
        stats.recentApplications?.map((app: any) => ({
            id: app._id,
            university: app.name,
            deadline: formatDisplayDate(app.endDate),
            status: app.status,
        })) || [];

    const passedApplicationsForTable =
        stats.passedApplications?.map((app: any) => ({
            id: app._id,
            university: app.name,
            deadline: formatDisplayDate(app.endDate),
            status: app.status,
        })) || [];

    return (
        <>
            {/* === Summary Stats Section === */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatsCard
                    title="Active Applications"
                    value={stats.active || 0}
                    icon={CheckCircle2}
                    color="text-green-600"
                />
                <StatsCard
                    title="Opening Soon"
                    value={stats.openingSoon || 0}
                    icon={Clock}
                    color="text-yellow-600"
                />
                <StatsCard
                    title="Closing Soon"
                    value={stats.closingSoon || 0}
                    icon={AlertTriangle}
                    color="text-orange-600"
                />
                <StatsCard
                    title="Closed Applications"
                    value={stats.closed || 0}
                    icon={XCircle}
                    color="text-red-600"
                />
                <StatsCard
                    title="Total Applications"
                    value={stats.totalApplications || 0}
                    icon={NotebookPen}
                    color="text-gray-600"
                />
                <StatsCard
                    title="Total Universities"
                    value={stats.totalUniversities || 0}
                    icon={GraduationCap}
                    color="text-gray-600"
                />
            </div>
            {/* === Recent Applications === */}
            <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
                <Card className="p-4">
                    <h3 className="text-lg font-semibold">
                        Recent Applications
                    </h3>
                    <ApplicationsTable data={recentApplicationsForTable} />
                </Card>

                {/* === Passed Applications === */}
                <Card className="p-4">
                    <h3 className="text-lg font-semibold">
                        Passed (Closed) Applications
                    </h3>
                    <ApplicationsTable data={passedApplicationsForTable} />
                </Card>
            </div>
        </>
    );
};

export default AllStatistics;
