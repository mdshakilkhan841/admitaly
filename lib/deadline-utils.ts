export function getDaysUntilDeadline(deadlineString: string): number {
    const deadline = new Date(deadlineString); // "Jan 1, 2025"
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

export function getUniversityStatus(
    startDateString: string,
    deadlineString: string
): "open" | "opening-soon" | "closing-soon" | "closed" {
    const today = new Date();
    const startDate = new Date(startDateString);
    const deadline = new Date(deadlineString);

    // To compare dates without time, reset hours, minutes, seconds, and milliseconds.
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const daysUntilDeadline = getDaysUntilDeadline(deadlineString);
    const daysUntilStart = Math.ceil(
        (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilDeadline < 0) return "closed";
    if (daysUntilDeadline <= 10 && daysUntilStart <= 0) return "closing-soon";
    if (daysUntilStart > 0 && daysUntilStart <= 30) return "opening-soon";
    if (daysUntilStart <= 0) return "open";

    return "opening-soon"; // Default for future dates > 1 month away
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

export function getStatusColor(
    status: "open" | "closing-soon" | "closed" | "opening-soon"
): string {
    const colorMap = {
        open: "from-green-500 to-emerald-500",
        "closing-soon": "from-orange-500 to-amber-500",
        "opening-soon": "from-yellow-500 to-lime-500",
        closed: "from-red-500 to-rose-500",
    };
    return colorMap[status];
}
