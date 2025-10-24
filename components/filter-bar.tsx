"use client";

interface FilterBarProps {
    statusFilter: string;
    onStatusChange: (status: string) => void;
}

export default function FilterBar({
    statusFilter,
    onStatusChange,
}: FilterBarProps) {
    const filters = [
        { value: "all", label: "All" },
        { value: "open", label: "Open" },
        { value: "opening-soon", label: "Opening Soon" },
        { value: "closing-soon", label: "Closing Soon" },
        { value: "closed", label: "Closed" },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
                <button
                    key={filter.value}
                    onClick={() => onStatusChange(filter.value)}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                        statusFilter === filter.value
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
}
