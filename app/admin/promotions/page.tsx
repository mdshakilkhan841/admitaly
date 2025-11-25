"use client";
import PageContainer from "@/components/layout/page-container";
import { Separator } from "@/components/ui/separator";
import { Suspense, useState } from "react";
import AddNewButton from "@/components/add-new-button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import PromoList from "@/components/promotion/promo-list";

export default function UniversitiesManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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
                        placeholder="Search promo card..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
            </Header>

            <PageContainer scrollable={false}>
                <div className="flex flex-1 flex-col space-y-4">
                    <div className="flex w-full items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                Promotion Cards
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                Manage all promotions in the system.
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
                        <PromoList
                            isModalOpen={isModalOpen}
                            setIsModalOpen={setIsModalOpen}
                            searchQuery={searchQuery}
                        />
                    </Suspense>
                </div>
            </PageContainer>
        </>
    );
}
