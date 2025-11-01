import PageContainer from "@/components/layout/page-container";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Plus } from "lucide-react";

const AdminPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    return (
        <PageContainer scrollable={false}>
            <div className="flex flex-1 flex-col space-y-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Dashboard
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Welcome to the admin panel. Manage universities and
                            applications from here.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/product/new"
                        className={cn(buttonVariants(), "text-xs md:text-sm")}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Add New</span>
                    </Link>
                </div>
                <Separator />
            </div>
        </PageContainer>
    );
};

export default AdminPage;
