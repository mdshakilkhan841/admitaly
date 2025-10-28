"use client";

import { useState, useMemo } from "react";
import UniversityCard, {
    type University,
} from "@/components/university/university-card";
import { getUniversityStatus } from "@/lib/deadline-utils";
import FilterBar from "@/components/filter-bar";
import Header from "@/components/header";

const UNIVERSITIES_DATA: University[] = [
    {
        id: 1,
        name: "Politecnico di Milano",
        call: "1st Call",
        applicationLink: "https://example.com/polimi/1",
        applicationFee: "€50",
        languageProficiency: ["MOI", "IELTS-6", "PTE-69"],
        startDate: "Oct 1, 2025",
        endDate: "Dec 1, 2025",
        cgpa: "MINIMUM CGPA 3.3",
        others: [],
    },
    {
        id: 2,
        name: "Politecnico di Milano",
        call: "2nd Call",
        applicationLink: "https://example.com/polimi/2",
        applicationFee: "€150",
        languageProficiency: ["MOI", "IELTS-6", "PTE-69"],
        startDate: "Oct 1, 2025",
        endDate: "Oct 30, 2025",
        cgpa: "MINIMUM CGPA 3.3",
        others: [],
    },
    {
        id: 3,
        name: "University of Macerata",
        call: null,
        applicationLink: "https://example.com/macerata",
        applicationFee: "No Fee",
        languageProficiency: ["MOI"],
        startDate: "Nov 4, 2025",
        endDate: "Nov 20, 2025",
        cgpa: "NO CGPA REQUIREMENT",
        others: [],
    },
    {
        id: 4,
        name: "University of Bologna",
        call: null,
        applicationLink: "https://example.com/bologna",
        applicationFee: "€70",
        languageProficiency: ["IELTS-6.5", "TOEFL-85"],
        startDate: "Sep 15, 2026",
        endDate: "Jan 15, 2026",
        cgpa: "MINIMUM CGPA 3.0 or equivalent GPA",
        others: [],
    },
    {
        id: 5,
        name: "Sapienza University of Rome",
        call: null,
        applicationLink: "https://example.com/sapienza",
        applicationFee: "€100",
        languageProficiency: ["MOI", "Cambridge C1 Advanced"],
        startDate: "Oct 20, 2025",
        endDate: "Feb 28, 2025",
        cgpa: "Not specified",
        others: ["Portfolio Required"],
    },
    {
        id: 6,
        name: "University of Turin",
        call: null,
        applicationLink: "https://example.com/turin",
        applicationFee: "No Fee",
        languageProficiency: ["IELTS-5.5", "PTE-60"],
        startDate: "Sep 1, 2025",
        endDate: "Dec 30, 2025",
        cgpa: "MINIMUM CGPA 3.5",
        others: [],
    },
    {
        id: 7,
        name: "University of Padua",
        call: null,
        applicationLink: "https://example.com/padua",
        applicationFee: "€85",
        languageProficiency: ["IELTS-7", "GRE-320"],
        startDate: "Sep 1, 2025",
        endDate: "Jan 31, 2025",
        cgpa: "MINIMUM CGPA 3.7",
        others: ["GMAT 650 accepted"],
    },
    {
        id: 8,
        name: "Politecnico di Torino",
        call: null,
        applicationLink: "https://example.com/torino",
        applicationFee: "€120",
        languageProficiency: ["MOI", "TOEFL-90"],
        startDate: "Oct 15, 2025",
        endDate: "Jan 31, 2026",
        cgpa: "Not specified",
        others: ["Strong Math/Physics background"],
    },
    {
        id: 9,
        name: "Ca' Foscari Univ. of Venice",
        call: null,
        applicationLink: "https://example.com/cafoscari",
        applicationFee: "€30",
        languageProficiency: ["IELTS-6.0", "TOEFL-80"],
        startDate: "Oct 20, 2026",
        endDate: "Mar 1, 2026",
        cgpa: "MINIMUM CGPA 3.2",
        others: ["CV review"],
    },
    {
        id: 10,
        name: "University of Trento",
        call: null,
        applicationLink: "https://example.com/trento",
        applicationFee: "€50",
        languageProficiency: ["IELTS-6.5"],
        startDate: "Sep 1, 2025",
        endDate: "Feb 15, 2026",
        cgpa: "NO CGPA REQUIREMENT",
        others: [],
    },
    {
        id: 11,
        name: "Univ. of Florence",
        call: "1st Call",
        applicationLink: "https://example.com/florence/1",
        applicationFee: "€60",
        languageProficiency: ["MOI"],
        startDate: "Sep 1, 2025",
        endDate: "Oct 30, 2025",
        cgpa: "MINIMUM CGPA 3.0",
        others: [
            "Motivation Letter Motivation Letter Motivation Letter Motivation Letter Motivation Letter Motivation Letter",
            "Portfolio Required",
        ],
    },
    {
        id: 12,
        name: "Univ. of Florence",
        call: "2nd Call",
        applicationLink: "https://example.com/florence/2",
        applicationFee: "€60",
        languageProficiency: ["MOI"],
        startDate: "Sep 1, 2025",
        endDate: "Feb 1, 2026",
        cgpa: "MINIMUM CGPA 3.0",
        others: ["Motivation Letter"],
    },
    {
        id: 13,
        name: "Bocconi University",
        call: null,
        applicationLink: "https://example.com/bocconi",
        applicationFee: "€150",
        languageProficiency: ["IELTS-7.5", "GMAT-700", "TOEFL-90", "GRE-340"],
        startDate: "Sep 5, 2025",
        endDate: "Nov 30, 2025",
        cgpa: "Not specified",
        others: ["Highly Competitive"],
    },
    {
        id: 14,
        name: "University of Milan",
        call: null,
        applicationLink: "https://example.com/milan",
        applicationFee: "€100",
        languageProficiency: ["IELTS-6.0", "PTE-65"],
        startDate: "Oct 10, 2025",
        endDate: "Mar 31, 2026",
        cgpa: "MINIMUM CGPA 3.1",
        others: [],
    },
    {
        id: 15,
        name: "Univ. of Pisa",
        call: "1st Call",
        applicationLink: "https://example.com/pisa/1",
        applicationFee: "€75",
        languageProficiency: ["MOI", "TOEFL-80"],
        startDate: "Sep 1, 2025",
        endDate: "Oct 1, 2025",
        cgpa: "MINIMUM CGPA 3.4",
        others: [],
    },
    {
        id: 16,
        name: "Univ. of Pisa",
        call: "2st Call",
        applicationLink: "https://example.com/pisa/2",
        applicationFee: "€75",
        languageProficiency: ["MOI", "TOEFL-80"],
        startDate: "Sep 1, 2025",
        endDate: "Dec 31, 2025",
        cgpa: "MINIMUM CGPA 3.4",
        others: [],
    },
    {
        id: 17,
        name: "Univ. of Catania",
        call: null,
        applicationLink: "https://example.com/catania",
        applicationFee: "No Fee",
        languageProficiency: ["MOI"],
        startDate: "Sep 15, 2026",
        endDate: "Mar 20, 2026",
        cgpa: "NO CGPA REQUIREMENT",
        others: [],
    },
    {
        id: 18,
        name: "Univ. of Verona",
        call: null,
        applicationLink: "https://example.com/verona",
        applicationFee: "€50",
        languageProficiency: ["IELTS-6.0"],
        startDate: "Oct 1, 2025",
        endDate: "Sep 15, 2025",
        cgpa: "Not specified",
        others: ["Bachelor's in related field"],
    },
    {
        id: 19,
        name: "Luiss Guido Carli",
        call: null,
        applicationLink: "https://example.com/luiss",
        applicationFee: "€120",
        languageProficiency: ["IELTS-6.5"],
        startDate: "Sep 1, 2025",
        endDate: "Jan 10, 2026",
        cgpa: "Not specified",
        others: ["Entrance Test Score"],
    },
    {
        id: 20,
        name: "University of Siena",
        call: null,
        applicationLink: "https://example.com/siena",
        applicationFee: "No Fee",
        languageProficiency: ["MOI", "IELTS-5.5"],
        startDate: "Sep 25, 2026",
        endDate: "Feb 1, 2026",
        cgpa: "Not specified",
        others: ["Previous degree transcript required"],
    },
];

export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredUniversities = useMemo(() => {
        const universitiesWithStatus = UNIVERSITIES_DATA.map((uni) => ({
            ...uni,
            status: getUniversityStatus(uni.startDate, uni.endDate),
        }));

        const sorted = universitiesWithStatus.sort((a, b) => {
            // Rule 1: 'closed' items always go to the bottom.
            if (a.status === "closed" && b.status !== "closed") {
                return 1; // a comes after b
            }
            if (a.status !== "closed" && b.status === "closed") {
                return -1; // a comes before b
            }

            // Rule 2: For items with the same status group (all non-closed or all closed),
            // sort by the deadline date in ascending order (nearest deadline first).
            const dateA = new Date(a.endDate).getTime();
            const dateB = new Date(b.endDate).getTime();
            return dateA - dateB;
        });

        return sorted.filter((uni) => {
            const matchesSearch =
                uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                uni.cgpa.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus =
                statusFilter === "all" ||
                uni.status === statusFilter ||
                uni.applicationFee === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter]);

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
                    <p className="whitespace-nowrap animate-marquee">
                        Data for 2026/2027 intake will be updated once
                        universities open admissions.
                    </p>
                </div>

                {/* <p className="text-center text-xl font-bold"></p> */}

                {filteredUniversities.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mx-3">
                        {filteredUniversities.map((university) => (
                            <UniversityCard
                                key={university.id}
                                university={university}
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
