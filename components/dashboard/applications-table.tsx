const ApplicationsTable = ({
    data,
}: {
    data: {
        id: number;
        university: string;
        deadline: string;
        status: string;
    }[];
}) => {
    return (
        <div className="overflow-x-auto rounded-md border border-gray-100">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                    <tr>
                        <th className="text-left px-3 py-2 border-b">
                            University
                        </th>
                        <th className="text-left px-3 py-2 border-b">Status</th>
                        <th className="text-left px-3 py-2 border-b">
                            Deadline
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={3}
                                className="px-3 py-3 text-center text-gray-500"
                            >
                                No applications found.
                            </td>
                        </tr>
                    ) : (
                        data.map((app) => (
                            <tr
                                key={app.id}
                                className="hover:bg-gray-50 border-b last:border-none transition"
                            >
                                <td className="px-3 py-2">{app.university}</td>
                                <td className="px-3 py-2">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            app.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : app.status === "Opening Soon"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : app.status === "Closing Soon"
                                                ? "bg-orange-100 text-orange-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-3 py-2">{app.deadline}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ApplicationsTable;
