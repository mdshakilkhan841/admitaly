"use client";
import PageContainer from "@/components/layout/page-container";
import { Separator } from "@/components/ui/separator";
import { Suspense, useEffect, useState } from "react";
import AddNewButton from "@/components/add-new-button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import UniversityList from "@/components/university/university-list";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";

export default function UniversitiesManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name:asc");

    return (
        <>
            <Header fixed>
                {/* Filter component */}
                <div
                    className={cn(
                        "flex w-full items-center justify-between gap-4"
                    )}
                >
                    <Input
                        placeholder="Search universities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-sm"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto"
                            >
                                <ListFilter className="mr-2 h-4 w-4" />
                                Sort by
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setSortBy("name:asc")}
                            >
                                Name (A-Z)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSortBy("name:desc")}
                            >
                                Name (Z-A)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </Header>

            <PageContainer scrollable={false}>
                <div className="flex flex-1 flex-col space-y-4">
                    <div className="flex w-full items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                Universities
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                Manage all universities in the system.
                            </p>
                        </div>
                        <AddNewButton setIsModalOpen={setIsModalOpen} />
                    </div>
                    <Separator />

                    <Suspense
                        fallback={
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            </div>
                        }
                    >
                        <UniversityList
                            isModalOpen={isModalOpen}
                            setIsModalOpen={setIsModalOpen}
                            searchQuery={searchQuery}
                            sortBy={sortBy}
                        />
                    </Suspense>
                </div>
            </PageContainer>
        </>
    );
}
