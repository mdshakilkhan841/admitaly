"use client";
import React, { useState } from "react";
import {
    AlertTriangle,
    Building2,
    CheckCircle2,
    Clock,
    XCircle,
} from "lucide-react";
import StatsCard from "./stats-card";
import { Card } from "@/components/ui/card";
import ApplicationsTable from "./applications-table";

const AllStatistics = () => {
    // Dummy data (replace later with API)
    const [stats, setStats] = useState({
        totalUniversities: 54,
        active: 12,
        openingSoon: 5,
        closingSoon: 3,
        closed: 34,
    });

    const recentApplications = [
        {
            id: 1,
            university: "University of Bologna",
            deadline: "2025-12-20",
            status: "Active",
        },
        {
            id: 2,
            university: "Politecnico di Milano",
            deadline: "2025-12-05",
            status: "Closing Soon",
        },
        {
            id: 3,
            university: "Sapienza University of Rome",
            deadline: "2025-12-15",
            status: "Active",
        },
        {
            id: 4,
            university: "University of Pisa",
            deadline: "2025-10-15",
            status: "Closed",
        },
        {
            id: 5,
            university: "University of Florence",
            deadline: "2025-10-25",
            status: "Closed",
        },
        {
            id: 6,
            university: "University of Bologna",
            deadline: "2025-12-20",
            status: "Active",
        },
        {
            id: 7,
            university: "Politecnico di Milano",
            deadline: "2025-12-05",
            status: "Closing Soon",
        },
        {
            id: 8,
            university: "Sapienza University of Rome",
            deadline: "2025-12-15",
            status: "Active",
        },
        {
            id: 9,
            university: "University of Pisa",
            deadline: "2025-10-15",
            status: "Closed",
        },
        {
            id: 10,
            university: "University of Florence",
            deadline: "2025-10-25",
            status: "Closed",
        },
        {
            id: 11,
            university: "University of Bologna",
            deadline: "2025-12-20",
            status: "Active",
        },
        {
            id: 12,
            university: "Politecnico di Milano",
            deadline: "2025-12-05",
            status: "Closing Soon",
        },
        {
            id: 13,
            university: "Sapienza University of Rome",
            deadline: "2025-12-15",
            status: "Active",
        },
        {
            id: 14,
            university: "University of Pisa",
            deadline: "2025-10-15",
            status: "Closed",
        },
        {
            id: 15,
            university: "University of Florence",
            deadline: "2025-10-25",
            status: "Closed",
        },
        {
            id: 16,
            university: "University of Bologna",
            deadline: "2025-12-20",
            status: "Active",
        },
        {
            id: 17,
            university: "Politecnico di Milano",
            deadline: "2025-12-05",
            status: "Closing Soon",
        },
        {
            id: 18,
            university: "Sapienza University of Rome",
            deadline: "2025-12-15",
            status: "Active",
        },
    ];

    const passedApplications = [
        {
            id: 1,
            university: "University of Pisa",
            deadline: "2025-10-15",
            status: "Closed",
        },
        {
            id: 2,
            university: "University of Florence",
            deadline: "2025-10-25",
            status: "Closed",
        },
    ];

    return (
        <>
            {/* === Summary Stats Section === */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatsCard
                    title="Total Universities"
                    value={stats.totalUniversities}
                    icon={Building2}
                    color="text-blue-600"
                />
                <StatsCard
                    title="Active Applications"
                    value={stats.active}
                    icon={CheckCircle2}
                    color="text-green-600"
                />
                <StatsCard
                    title="Opening Soon"
                    value={stats.openingSoon}
                    icon={Clock}
                    color="text-yellow-600"
                />
                <StatsCard
                    title="Closing Soon"
                    value={stats.closingSoon}
                    icon={AlertTriangle}
                    color="text-orange-600"
                />
                <StatsCard
                    title="Closed Applications"
                    value={stats.closed}
                    icon={XCircle}
                    color="text-red-600"
                />
            </div>
            {/* === Recent Applications === */}
            <div className="flex gap-4">
                <Card className="p-4 sm:w-1/2">
                    <h3 className="text-lg font-semibold">
                        Recent Applications
                    </h3>
                    <ApplicationsTable data={recentApplications} />
                </Card>

                {/* === Passed Applications === */}
                <Card className="p-4 sm:w-1/2">
                    <h3 className="text-lg font-semibold">
                        Passed (Closed) Applications
                    </h3>
                    <ApplicationsTable data={passedApplications} />
                </Card>
            </div>
        </>
    );
};

export default AllStatistics;
