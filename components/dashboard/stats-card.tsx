import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const colorMap = {
    "Active Applications": "bg-green-100 text-green-600",
    "Opening Soon": "bg-yellow-100 text-yellow-600",
    "Closing Soon": "bg-orange-100 text-orange-600",
    "Closed Applications": "bg-red-100 text-red-600",
    "Total Applications": "bg-gray-200 text-gray-600",
    "Total Universities": "bg-gray-200 text-gray-600",
};

type CardTitle = keyof typeof colorMap;

export default function StatsCard({
    title,
    value,
    icon: Icon,
    color,
}: {
    title: CardTitle;
    value: number | string;
    icon: React.ElementType;
    color: string;
}) {
    return (
        <Card
            className={`p-4 flex items-center justify-between shadow-sm border border-gray-100 ${colorMap[title]}`}
        >
            <div>
                <p className="text-sm text-gray-800 font-medium">{title}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
            </div>
            <div className={`p-3 bg-gray-50 rounded-full ${color}`}>
                <Icon size={20} />
            </div>
        </Card>
    );
}
