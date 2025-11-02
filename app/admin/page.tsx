import PageContainer from "@/components/layout/page-container";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/header";
import AllStatistics from "@/components/dashboard/all-statistics";

const AdminPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    return (
        <>
            <Header fixed>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </Header>

            <PageContainer scrollable={false}>
                <div className="flex flex-1 flex-col space-y-4">
                    <Separator />
                    <AllStatistics />
                </div>
            </PageContainer>
        </>
    );
};

export default AdminPage;
