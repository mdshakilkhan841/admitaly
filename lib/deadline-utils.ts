import dayjs from "dayjs";

export function getDaysUntilDeadline(deadlineString: string): number {
    const deadline = dayjs(deadlineString);
    const today = dayjs().startOf("day");
    return deadline.diff(today, "day");
}

export function getApplicationStatus(
    startDateString: string,
    deadlineString: string
): "open" | "opening-soon" | "closing-soon" | "closed" {
    const today = dayjs().startOf("day");
    const startDate = dayjs(startDateString);

    const daysUntilDeadline = getDaysUntilDeadline(deadlineString);
    const daysUntilStart = startDate.diff(today, "day");

    if (daysUntilDeadline < 0) return "closed";
    if (daysUntilDeadline <= 10 && daysUntilStart <= 0) return "closing-soon";
    if (daysUntilStart > 0 && daysUntilStart <= 30) return "opening-soon";
    if (daysUntilStart <= 0) return "open";

    return "opening-soon";
}

export function formatDeadlineStatus(
    status: "open" | "closing-soon" | "closed" | "opening-soon"
): string {
    const statusMap = {
        open: "Open",
        "closing-soon": "Closing Soon",
        "opening-soon": "Opening Soon",
        closed: "Closed",
    };
    return statusMap[status];
}

export function formatDisplayDate(dateString: string): string {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("MMM D, YYYY");
}

export function getStatusColor(
    status: "open" | "closing-soon" | "closed" | "opening-soon"
): string {
    const colorMap = {
        open: "bg-green-100 text-green-800",
        "closing-soon": "bg-orange-100 text-orange-800",
        "opening-soon": "bg-blue-100 text-blue-800",
        closed: "bg-red-100 text-red-800",
    };
    return colorMap[status];
}
