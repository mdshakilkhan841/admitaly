import {
    formatDeadlineStatus,
    getUniversityStatus,
    getDaysUntilDeadline,
} from "@/lib/deadline-utils";
import bgImage from "@/public/Politecnico-di-Milano.jpg";

export interface University {
    id: number;
    name: string;
    call: string | null;
    applicationLink: string;
    admissionFee: string;
    languageProficiency: string[];
    startDate: string;
    deadline: string;
    cgpa: string;
    others: string[];
}

export default function UniversityCard({
    university,
}: {
    university: University & {
        status: "open" | "closing-soon" | "closed" | "opening-soon";
    };
}) {
    const daysLeft = getDaysUntilDeadline(university.deadline);

    const getStatusColor = () => {
        // The 'opening-soon' case was missing here, I've added it.
        switch (university.status) {
            case "open":
                return {
                    bg: "bg-green-50",
                    bgButton: "bg-green-600",
                    bgButtonHover: "hover:bg-green-700",
                    border: "border-green-200",
                    text: "text-green-700",
                };
            case "closing-soon":
                return {
                    bg: "bg-amber-50",
                    bgButton: "bg-amber-600",
                    bgButtonHover: "hover:bg-amber-700",
                    border: "border-amber-200",
                    text: "text-amber-700",
                };
            case "closed":
                return {
                    bg: "bg-red-50",
                    bgButton: "bg-red-600",
                    bgButtonHover: "hover:bg-red-700",
                    border: "border-red-200",
                    text: "text-red-700",
                };
            case "opening-soon":
                return {
                    bg: "bg-sky-50",
                    bgButton: "bg-sky-500",
                    bgButtonHover: "hover:bg-sky-600",
                    border: "border-sky-200",
                    text: "text-sky-700",
                };
            default:
                return {
                    bg: "bg-gray-50",
                    bgButton: "bg-gray-500",
                    bgButtonHover: "hover:bg-gray-500",
                    border: "border-gray-200",
                    text: "text-gray-700",
                };
        }
    };

    const statusColor = getStatusColor();
    const statusLabel = formatDeadlineStatus(university.status);

    return (
        <div className="relative overflow-hidden">
            {university.admissionFee === "No Fee" && (
                <div className="absolute top-4 -left-6 transform -rotate-45 bg-red-600 text-white px-6 py-0 text-xs font-bold shadow-2xl">
                    <div className="items-center">
                        <span>No Fees</span>
                    </div>
                </div>
            )}
            <div
                className={`border border-gray-200 rounded bg-white hover:shadow-sm transition-shadow overflow-hidden`}
            >
                <div className="border-b border-gray-100 flex items-start justify-between gap-2">
                    <img
                        src={bgImage.src}
                        alt="Background"
                        className="w-full h-24 object-cover"
                    />
                </div>

                <div className="px-3 py-2 border-b border-gray-100 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-900">
                            {university.name}{" "}
                            {university.call && `(${university.call})`}
                        </h3>
                    </div>
                    <div
                        className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${statusColor.bg} ${statusColor.text}`}
                    >
                        <span
                            className={`w-2 h-2 rounded-full ${statusColor.bgButton}`}
                        ></span>
                        {statusLabel}
                    </div>
                </div>

                <div className="px-3 py-2 space-y-2">
                    <div
                        className={`${statusColor.bg} border ${statusColor.border} rounded px-2 py-1.5`}
                    >
                        <div className="flex">
                            <div className="w-1/2">
                                <p className="text-xs text-gray-600 font-medium">
                                    Application Start
                                </p>
                                <p
                                    className={`text-sm font-semibold ${statusColor.text} mt-0.5`}
                                >
                                    {university.startDate}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {statusLabel}
                                </p>
                            </div>
                            {university.deadline && (
                                <div className="w-1/2">
                                    <p className="text-xs text-gray-600 font-medium">
                                        Deadline
                                    </p>
                                    <p
                                        className={`text-sm font-semibold ${statusColor.text} mt-0.5`}
                                    >
                                        {university.deadline}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {daysLeft > 0
                                            ? `${daysLeft} days left`
                                            : "Passed"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                        <div className="bg-gray-50 rounded px-1.5 py-1">
                            <p className="text-gray-600 font-medium">Fee</p>
                            <p className="text-gray-900 font-medium mt-0.5">
                                {university.admissionFee}
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded px-1.5 py-1">
                            <p className="text-gray-600 font-medium">
                                Language Proficiency
                            </p>
                            <p className="text-gray-900 font-medium mt-0.5">
                                {university.languageProficiency.join(" | ")}
                            </p>
                        </div>
                    </div>

                    {/* CGPA */}
                    <div className="bg-gray-50 rounded px-1.5 py-1 text-xs">
                        <p className="text-gray-600 font-medium">CGPA</p>
                        <p className="text-gray-900 font-medium mt-0.5">
                            {university.cgpa}
                        </p>
                    </div>

                    {/* Others */}

                    {university.others.length > 0 && (
                        <div className="bg-gray-50 rounded px-1.5 py-1 text-xs">
                            <p className="text-gray-600 font-medium">OTHERS</p>
                            <ul className="list-disc list-outside text-gray-900 font-medium mt-0.5 space-y-1 pl-4">
                                {university.others.map((other, index) => (
                                    <li key={index}>{other}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <a
                        href={university.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block w-full text-center px-2 py-1.5 text-xs font-medium rounded ${statusColor.bgButton} text-white ${statusColor.bgButtonHover} transition-colors mt-1`}
                    >
                        Apply Link
                    </a>
                </div>
            </div>
        </div>
    );
}
