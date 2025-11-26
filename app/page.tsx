"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import ApplicationCard from "@/components/application/application-card";
import { getApplicationStatus } from "@/lib/deadline-utils";
import FilterBar from "@/components/filter-bar";
import Header from "@/components/header";
import { IApplication } from "@/types";
import SkeletonApplicationCard from "@/components/skeleton/skeleton-application-card";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import Image from "next/image";
import Link from "next/link";
import VisitorCounter from "@/components/visitor-counter";
import { ApplicationStatus } from "@/lib/deadline-utils"; // Import
import { IPromotion } from "@/types";

interface IPromoCard {
    type: "promo";
    id: string;
    href: string;
    image: string;
    alt: string;
    textDesign?: string;
}

// A new type for applications that includes the calculated status
type IApplicationWithStatus = IApplication & { status: ApplicationStatus };

// Combine application and promo card types for the list
type ListItem = IApplicationWithStatus | IPromoCard;

export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isSticky, setIsSticky] = useState(false);
    const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(false);
    const lastScrollY = useRef(0);

    const {
        data: applications = [],
        error,
        isLoading,
    } = useSWR<IApplication[]>("/api/applications", fetcher, {
        keepPreviousData: true,
        dedupingInterval: 10000,
        shouldRetryOnError: true,
    });

    const { data: promotions = [] } = useSWR<IPromotion[]>(
        "/api/promotions?status=active",
        fetcher,
        {
            keepPreviousData: true,
            dedupingInterval: 10000,
            shouldRetryOnError: true,
        }
    );

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            // Sticky header logic
            if (currentScrollY < lastScrollY.current) {
                // Scrolling up
                setIsSticky(true);
            } else if (currentScrollY > lastScrollY.current + 50) {
                // Scrolling down with a little threshold to prevent flickering
                setIsSticky(false);
            }

            // Scroll-to-top button visibility
            if (currentScrollY > 300) {
                setIsScrollButtonVisible(true);
            } else {
                setIsScrollButtonVisible(false);
            }

            lastScrollY.current = currentScrollY;
        };

        // Add scroll event listener
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const filteredApplications = useMemo((): IApplicationWithStatus[] => {
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

            let matchesStatus;
            if (statusFilter === "open") {
                matchesStatus =
                    application.status === "open" ||
                    application.status === "closing-soon";
            } else {
                matchesStatus =
                    statusFilter === "all" ||
                    application.status === statusFilter ||
                    application.applicationFee === statusFilter;
            }

            return matchesSearch && matchesStatus;
        });
    }, [applications, searchQuery, statusFilter]);

    const PromotionalCard = ({
        href,
        image,
        textDesign,
    }: {
        href: string;
        image: string;
        textDesign: string;
    }) => {
        return (
            <Link
                href={href || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded shadow-lg overflow-hidden flex items-center justify-center"
            >
                {image ? (
                    <img
                        src={image}
                        alt="Italy Student Connect BD"
                        className="object-contain h-auto"
                    />
                ) : textDesign ? (
                    <div
                        className="w-full text-center"
                        dangerouslySetInnerHTML={{ __html: textDesign }}
                    />
                ) : (
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">
                            Italy Student Connect BD
                        </p>
                    </div>
                )}
            </Link>
        );
    };

    const itemsToRender = useMemo(() => {
        if (filteredApplications.length === 0) {
            return [];
        }

        const combinedList: ListItem[] = [...filteredApplications];
        const numPromos = promotions.length;

        // If no promotions, return applications only
        if (numPromos === 0) {
            return combinedList;
        }

        // Find the number of applications that are not closed.
        // Since closed applications are sorted to the end, we can find the first one.
        const firstClosedIndex = filteredApplications.findIndex(
            (app) => app.status === "closed"
        );
        const numOpenApplications =
            firstClosedIndex === -1
                ? filteredApplications.length
                : firstClosedIndex;

        // Generate random ascending order indices for promo placement
        // Ensure at least 2 promos in first 10 applications
        const promoIndices: number[] = [];
        const minIndex = 2;
        const maxIndex = Math.min(10, numOpenApplications);

        // Place first promo randomly between 2-10
        const firstPromoIndex =
            Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;
        promoIndices.push(firstPromoIndex);

        // Place second promo randomly between first promo and 10
        if (numPromos > 1 && maxIndex > firstPromoIndex) {
            const secondPromoIndex = Math.floor(
                Math.random() * (maxIndex - firstPromoIndex) +
                    firstPromoIndex +
                    1
            );
            if (secondPromoIndex <= maxIndex) {
                promoIndices.push(secondPromoIndex);
            }
        }

        // Place remaining promos with random ascending intervals
        let currentIndex =
            promoIndices.length > 0
                ? promoIndices[promoIndices.length - 1]
                : 10;
        for (let i = promoIndices.length; i < numPromos; i++) {
            const randomSpacing = Math.floor(Math.random() * 15) + 5; // Random spacing between 5-20
            currentIndex += randomSpacing;
            if (currentIndex < numOpenApplications + promoIndices.length) {
                promoIndices.push(currentIndex);
            }
        }

        // Insert promotions at the generated indices, from last to first
        promoIndices
            .sort((a, b) => b - a)
            .forEach((index, i) => {
                const promoIndex = i % numPromos;
                if (
                    promoIndex < promotions.length &&
                    index <= combinedList.length
                ) {
                    combinedList.splice(
                        index,
                        0,
                        promotions[promoIndex] as any
                    );
                }
            });

        return combinedList;
    }, [filteredApplications, promotions]);

    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Conditionally apply sticky positioning */}
            <div
                className={`${
                    isSticky
                        ? "sticky top-0 z-10 bg-gray-100 shadow transition-all duration-300"
                        : "relative"
                } bg-gray-100`}
            >
                {/* Center: Study Group Highlight */}
                <div className="bg-background py-2 border-b">
                    <div className="container mx-auto max-w-7xl flex items-center justify-center gap-4 px-4">
                        <div className="flex items-center gap-2">
                            <Link
                                href="https://www.facebook.com/ItalyStudentConnect"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded transition-colors overflow-hidden"
                                title="Join on Facebook"
                            >
                                <Image
                                    src="/logo_agency.jpg"
                                    alt="Facebook-Page"
                                    width={36}
                                    height={36}
                                />
                            </Link>
                            <Link
                                href="https://www.facebook.com/GlobalEducationAxis"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded transition-colors overflow-hidden"
                                title="Join on Facebook"
                            >
                                <Image
                                    src="/global-edu.jpg"
                                    alt="Facebook"
                                    width={36}
                                    height={36}
                                />
                            </Link>
                            <div>
                                <p className="text-sm font-semibold text-foreground text-center">
                                    Study Group
                                </p>
                                <p className="text-xs text-muted-foreground text-center">
                                    Join our community
                                </p>
                            </div>
                        </div>
                        {/* Social media sharing links with Italian flag theme */}
                        <div className="flex overflow-hidden gap-2">
                            <Link
                                href="https://www.facebook.com/share/g/1FwyozYf1s/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors"
                                title="Join on Facebook"
                            >
                                <Image
                                    src="/facebook.svg"
                                    alt="Facebook-Group"
                                    width={36}
                                    height={36}
                                    style={{
                                        filter: "invert(39%) sepia(57%) saturate(2878%) hue-rotate(206deg) brightness(104%) contrast(97%)",
                                    }}
                                />
                            </Link>
                            <Link
                                href="https://wa.me/..."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors"
                                title="Join on WhatsApp"
                            >
                                <Image
                                    src="/whatsapp.svg"
                                    alt="WhatsApp"
                                    width={36}
                                    height={36}
                                    style={{
                                        filter: "invert(53%) sepia(88%) saturate(454%) hue-rotate(94deg) brightness(91%) contrast(86%)",
                                    }}
                                />
                            </Link>
                            <Link
                                href="https://m.me/j/AbZFLgtKWq0QSnab/"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Join on Messenger"
                            >
                                <div
                                    className="h-8 w-8 bg-linear-to-r from-purple-500 to-blue-500 transition-opacity hover:opacity-80"
                                    style={{
                                        mask: "url(/messenger.svg) no-repeat center",
                                        WebkitMask:
                                            "url(/messenger.svg) no-repeat center",
                                        maskSize: "contain",
                                    }}
                                />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto space-y-2 sm:px-3 px-3 py-3">
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
                ) : itemsToRender.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mx-3">
                        {itemsToRender?.map((item: any) => {
                            // Check if it's an application (IApplication has university property)
                            if (item?.university) {
                                return (
                                    <ApplicationCard
                                        key={item._id}
                                        application={item}
                                    />
                                );
                            }
                            // It's a promotion
                            return (
                                <PromotionalCard
                                    key={item._id}
                                    href={item.href || ""}
                                    image={item.image || ""}
                                    textDesign={item.textDesign || ""}
                                />
                            );
                        })}
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

            {/* Copyright Footer */}
            <div className="flex flex-wrap items-center justify-center bg-gray-100 rounded mt-4 mb-4 gap-1 px-2 py-2 text-xs text-gray-600">
                <p>{new Date().getFullYear()} ©</p>
                <Link
                    href="https://www.facebook.com/GlobalEducationAxis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                >
                    Global Education Axis
                </Link>
                <p>· All rights reserved.</p>
            </div>
            <VisitorCounter />

            {/* Scroll to top button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={`fixed bottom-5 right-5 z-50 h-10 w-10 rounded-full border border-border bg-background/20 text-foreground shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-accent hover:text-accent-foreground ${
                    isScrollButtonVisible
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                }`}
            >
                ↑
            </button>
        </main>
    );
}
