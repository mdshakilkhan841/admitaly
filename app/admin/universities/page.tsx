"use client";
import PageContainer from "@/components/layout/page-container";
import { Separator } from "@/components/ui/separator";
import { Suspense, useEffect, useState } from "react";
import AddNewButton from "@/components/add-new-button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ListFilter, Check } from "lucide-react";
import UniversityList from "@/components/university/university-list";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";

export default function UniversitiesManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("");

    const sortOptions: { [key: string]: string } = {
        "name:asc": "Name (A-Z)",
        "name:desc": "Name (Z-A)",
    };

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
                        <DropdownMenuTrigger asChild className="w-36">
                            <Button variant="outline" className="ml-auto">
                                <ListFilter className="mr-2 h-4 w-4" />
                                {sortBy ? sortOptions[sortBy] : "Sort by"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                                value={sortBy}
                                onValueChange={setSortBy}
                            >
                                <DropdownMenuRadioItem value="name:asc">
                                    Name (A-Z)
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="name:desc">
                                    Name (Z-A)
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
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
