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
    console.log("🚀 ~ AdminPage ~ session:", session);

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

// <div className="space-y-6">
//     <div>
//         <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//         <p className="mt-1 text-sm text-gray-600">
//             Welcome to the admin panel. Manage universities and
//             applications from here.
//         </p>
//     </div>

//     <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//         <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="px-4 py-5 sm:p-6">
//                 <dt className="text-sm font-medium text-gray-500 truncate">
//                     Total Universities
//                 </dt>
//                 <dd className="mt-1 text-3xl font-semibold text-gray-900">
//                     12
//                 </dd>
//             </div>
//         </div>

//         <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="px-4 py-5 sm:p-6">
//                 <dt className="text-sm font-medium text-gray-500 truncate">
//                     Total Applications
//                 </dt>
//                 <dd className="mt-1 text-3xl font-semibold text-gray-900">
//                     45
//                 </dd>
//             </div>
//         </div>

//         <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="px-4 py-5 sm:p-6">
//                 <dt className="text-sm font-medium text-gray-500 truncate">
//                     Active Calls
//                 </dt>
//                 <dd className="mt-1 text-3xl font-semibold text-gray-900">
//                     8
//                 </dd>
//             </div>
//         </div>
//     </div>
// </div>
