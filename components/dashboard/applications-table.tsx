import { statusColors } from "../application/application-card";

type ApplicationStatus = keyof typeof statusColors;

const defaultStatusColor = {
    bg: "bg-gray-50",
    bgButton: "bg-gray-500",
    bgButtonHover: "hover:bg-gray-500",
    border: "border-gray-200",
    text: "text-gray-700",
};

const ApplicationsTable = ({
    data,
}: {
    data: {
        id: string;
        university?: string;
        deadline?: string;
        status?: ApplicationStatus | string | undefined;
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
                        data.map((app) => {
                            const statusColor =
                                statusColors[
                                    app?.status as ApplicationStatus
                                ] || defaultStatusColor;
                            return (
                                <tr
                                    key={app.id}
                                    className="hover:bg-gray-50 border-b last:border-none transition"
                                >
                                    <td className="px-3 py-2">
                                        {app.university}
                                    </td>
                                    <td className="px-3 py-2">
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor.bg} ${statusColor.text}`}
                                        >
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2">
                                        {app.deadline}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ApplicationsTable;
