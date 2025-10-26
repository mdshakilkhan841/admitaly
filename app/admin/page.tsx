import AdminLayout from "@/components/AdminLayout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const AdminPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Welcome to the admin panel. Manage universities and
                        applications from here.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                Total Universities
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                12
                            </dd>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                Total Applications
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                45
                            </dd>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                Active Calls
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                                8
                            </dd>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminPage;
