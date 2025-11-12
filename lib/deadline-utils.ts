import dayjs from "dayjs";

export function getDaysUntilDeadline(deadlineString: string): number {
    const deadline = dayjs(deadlineString);
    const today = dayjs().startOf("day");
    return deadline.diff(today, "day");
}

export function getApplicationStatus(
    startDateString?: string | null,
    deadlineString?: string | null
): "open" | "opening-soon" | "closing-soon" | "closed" | "upcoming" | "" {
    if (!startDateString || !deadlineString) {
        return "";
    }

    const today = dayjs().startOf("day");
    const startDate = dayjs(startDateString);

    if (!startDate.isValid()) return "";

    const daysUntilDeadline = getDaysUntilDeadline(deadlineString);
    const daysUntilStart = startDate.diff(today, "day");

    if (daysUntilDeadline < 0) return "closed";
    if (daysUntilDeadline <= 5 && daysUntilStart <= 0) return "closing-soon";
    if (daysUntilStart > 0 && daysUntilStart <= 10) return "opening-soon";
    if (daysUntilStart > 10) return "upcoming";
    if (daysUntilStart <= 0) return "open";

    return "";
}

export function formatDeadlineStatus(
    status?:
        | "open"
        | "closing-soon"
        | "closed"
        | "opening-soon"
        | "upcoming"
        | ""
): string | null {
    const statusMap = {
        open: "Open",
        "closing-soon": "Closing Soon",
        "opening-soon": "Opening Soon",
        closed: "Closed",
        upcoming: "Upcoming",
        "": null,
    };
    if (!status) return null;
    return statusMap[status];
}

export function formatDisplayDate(dateString: string): string {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("MMM D, YYYY");
}

export function getStatusColor(
    status?:
        | "open"
        | "closing-soon"
        | "closed"
        | "opening-soon"
        | "upcoming"
        | ""
): string {
    const colorMap = {
        open: "bg-green-100 text-green-800",
        "closing-soon": "bg-orange-100 text-orange-800",
        "opening-soon": "bg-blue-100 text-blue-800",
        closed: "bg-red-100 text-red-800",
        upcoming: "bg-gray-100 text-gray-800",
        "": "bg-background text-gray-800",
    };
    return status ? colorMap[status] : colorMap[""];
}
