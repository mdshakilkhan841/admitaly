import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsCard({
    title,
    value,
    icon: Icon,
    color,
}: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
}) {
    return (
        <Card className="p-4 flex items-center justify-between shadow-sm border border-gray-100">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
            </div>
            <div className={`p-3 bg-gray-50 rounded-full ${color}`}>
                <Icon size={20} />
            </div>
        </Card>
    );
}
