"use client";
import { Suspense, useState } from "react";
import Header from "@/components/layout/header";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageContainer from "@/components/layout/page-container";
import AddNewButton from "@/components/add-new-button";
import { Separator } from "@/components/ui/separator";
import ApplicationList from "@/components/application/application-list";

export default function ApplicationsManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name:asc");

    const sortOptions: { [key: string]: string } = {
        "name:asc": "Name (A-Z)",
        "name:desc": "Name (Z-A)",
        "createdAt:desc": "Newest",
        "createdAt:asc": "Oldest",
    };

    return (
        <>
            <Header fixed>
                {/* Filetr component */}
                <div
                    className={cn(
                        "flex w-full items-center justify-between gap-4"
                    )}
                >
                    <Input
                        placeholder="Search Applications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-sm"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="ml-auto w-40 justify-start"
                            >
                                <ListFilter className="mr-2 h-4 w-4" />
                                {sortOptions[sortBy]}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
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
                                <DropdownMenuRadioItem value="createdAt:desc">
                                    Newest
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="createdAt:asc">
                                    Oldest
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
                                Applications
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                Manage all applications in the system.
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
                        <ApplicationList
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
