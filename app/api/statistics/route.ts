import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Application from "@/models/application";
import University from "@/models/university";

const TIMEZONE = "Asia/Dhaka";
const CLOSING_SOON_DAYS = 10;
const OPENING_SOON_DAYS = 10; // daysUntilStart > 10 => "upcoming"
const Limit = 20;

export async function GET() {
    await dbConnect();

    try {
        const now = new Date();

        const [dashboardData, totalUniversities, totalApplications] =
            await Promise.all([
                Application.aggregate([
                    // 1️⃣ Normalize dates (handle string, null, empty)
                    {
                        $addFields: {
                            __start: {
                                $switch: {
                                    branches: [
                                        {
                                            case: {
                                                $and: [
                                                    {
                                                        $eq: [
                                                            {
                                                                $type: "$startDate",
                                                            },
                                                            "string",
                                                        ],
                                                    },
                                                    { $ne: ["$startDate", ""] },
                                                ],
                                            },
                                            then: {
                                                $dateFromString: {
                                                    dateString: "$startDate",
                                                },
                                            },
                                        },
                                        {
                                            case: {
                                                $eq: [
                                                    { $type: "$startDate" },
                                                    "date",
                                                ],
                                            },
                                            then: "$startDate",
                                        },
                                    ],
                                    default: null,
                                },
                            },
                            __end: {
                                $switch: {
                                    branches: [
                                        {
                                            case: {
                                                $and: [
                                                    {
                                                        $eq: [
                                                            {
                                                                $type: "$endDate",
                                                            },
                                                            "string",
                                                        ],
                                                    },
                                                    { $ne: ["$endDate", ""] },
                                                ],
                                            },
                                            then: {
                                                $dateFromString: {
                                                    dateString: "$endDate",
                                                },
                                            },
                                        },
                                        {
                                            case: {
                                                $eq: [
                                                    { $type: "$endDate" },
                                                    "date",
                                                ],
                                            },
                                            then: "$endDate",
                                        },
                                    ],
                                    default: null,
                                },
                            },
                        },
                    },

                    // 2️⃣ Prepare truncated dates and difference
                    {
                        $addFields: {
                            __today: {
                                $dateTrunc: {
                                    date: now,
                                    unit: "day",
                                    timezone: TIMEZONE,
                                },
                            },
                            __startDay: {
                                $cond: [
                                    { $ne: ["$__start", null] },
                                    {
                                        $dateTrunc: {
                                            date: "$__start",
                                            unit: "day",
                                            timezone: TIMEZONE,
                                        },
                                    },
                                    null,
                                ],
                            },
                            __endDay: {
                                $cond: [
                                    { $ne: ["$__end", null] },
                                    {
                                        $dateTrunc: {
                                            date: "$__end",
                                            unit: "day",
                                            timezone: TIMEZONE,
                                        },
                                    },
                                    null,
                                ],
                            },
                        },
                    },

                    // 3️⃣ Calculate days until end
                    {
                        $addFields: {
                            __daysUntilEnd: {
                                $cond: [
                                    {
                                        $and: [
                                            { $ne: ["$__endDay", null] },
                                            { $ne: ["$__today", null] },
                                        ],
                                    },
                                    {
                                        $divide: [
                                            {
                                                $subtract: [
                                                    "$__endDay",
                                                    "$__today",
                                                ],
                                            },
                                            1000 * 60 * 60 * 24,
                                        ],
                                    },
                                    null,
                                ],
                            },
                            __daysUntilStart: {
                                $cond: [
                                    {
                                        $and: [
                                            { $ne: ["$__startDay", null] },
                                            { $ne: ["$__today", null] },
                                        ],
                                    },
                                    {
                                        $divide: [
                                            {
                                                $subtract: [
                                                    "$__startDay",
                                                    "$__today",
                                                ],
                                            },
                                            1000 * 60 * 60 * 24,
                                        ],
                                    },
                                    null,
                                ],
                            },
                        },
                    },

                    // 4️⃣ Derive status field
                    {
                        $addFields: {
                            status: {
                                $switch: {
                                    branches: [
                                        // 1) Closed
                                        {
                                            case: {
                                                $and: [
                                                    {
                                                        $ne: [
                                                            "$__endDay",
                                                            null,
                                                        ],
                                                    },
                                                    {
                                                        $gt: [
                                                            "$__today",
                                                            "$__endDay",
                                                        ],
                                                    },
                                                ],
                                            },
                                            then: "closed",
                                        },
                                        // 2) Upcoming (starts later than OPENING_SOON_DAYS)
                                        {
                                            case: {
                                                $and: [
                                                    {
                                                        $ne: [
                                                            "$__startDay",
                                                            null,
                                                        ],
                                                    },
                                                    {
                                                        $gt: [
                                                            "$__startDay",
                                                            "$__today",
                                                        ],
                                                    },
                                                    {
                                                        $gt: [
                                                            "$__daysUntilStart",
                                                            OPENING_SOON_DAYS,
                                                        ],
                                                    },
                                                ],
                                            },
                                            then: "upcoming",
                                        },
                                        // 3) Opening-soon: in future, within threshold
                                        {
                                            case: {
                                                $and: [
                                                    {
                                                        $ne: [
                                                            "$__startDay",
                                                            null,
                                                        ],
                                                    },
                                                    {
                                                        $gt: [
                                                            "$__startDay",
                                                            "$__today",
                                                        ],
                                                    },
                                                    // (previously just "today < start")
                                                    {
                                                        $lte: [
                                                            "$__daysUntilStart",
                                                            OPENING_SOON_DAYS,
                                                        ],
                                                    },
                                                ],
                                            },
                                            then: "opening-soon",
                                        },
                                        // 4) Closing-soon: currently open and within end threshold
                                        {
                                            case: {
                                                $and: [
                                                    {
                                                        $ne: [
                                                            "$__endDay",
                                                            null,
                                                        ],
                                                    },
                                                    {
                                                        $ne: [
                                                            "$__startDay",
                                                            null,
                                                        ],
                                                    },
                                                    {
                                                        $gte: [
                                                            "$__today",
                                                            "$__startDay",
                                                        ],
                                                    },
                                                    {
                                                        $lte: [
                                                            "$__today",
                                                            "$__endDay",
                                                        ],
                                                    },
                                                    {
                                                        $lte: [
                                                            "$__daysUntilEnd",
                                                            CLOSING_SOON_DAYS,
                                                        ],
                                                    },
                                                ],
                                            },
                                            then: "closing-soon",
                                        },
                                    ],
                                    // 5) Otherwise: open if within window, else unknown
                                    default: {
                                        $cond: [
                                            {
                                                $and: [
                                                    {
                                                        $ne: [
                                                            "$__startDay",
                                                            null,
                                                        ],
                                                    },
                                                    {
                                                        $ne: [
                                                            "$__endDay",
                                                            null,
                                                        ],
                                                    },
                                                    {
                                                        $gte: [
                                                            "$__today",
                                                            "$__startDay",
                                                        ],
                                                    },
                                                    {
                                                        $lte: [
                                                            "$__today",
                                                            "$__endDay",
                                                        ],
                                                    },
                                                ],
                                            },
                                            "open",
                                            "unknown",
                                        ],
                                    },
                                },
                            },
                        },
                    },

                    // 5️⃣ Final facets
                    {
                        $facet: {
                            // ✅ Group stats
                            stats: [
                                {
                                    $group: {
                                        _id: "$status",
                                        count: { $sum: 1 },
                                    },
                                },
                            ],

                            // ✅ Recent apps (exclude closed)
                            recentApplications: [
                                {
                                    $match: {
                                        status: {
                                            $in: [
                                                "open",
                                                "opening-soon",
                                                "closing-soon",
                                                "upcoming",
                                            ],
                                        },
                                    },
                                },
                                { $sort: { createdAt: -1 } },
                                { $limit: Limit },
                                {
                                    $lookup: {
                                        from: "universities",
                                        localField: "university",
                                        foreignField: "_id",
                                        as: "university",
                                    },
                                },
                                { $unwind: "$university" },
                                {
                                    $project: {
                                        _id: 1,
                                        name: "$university.name",
                                        startDate: "$__start",
                                        endDate: "$__end",
                                        status: 1,
                                        createdAt: 1,
                                    },
                                },
                            ],

                            // ✅ Passed apps (only closed)
                            passedApplications: [
                                { $match: { status: "closed" } },
                                {
                                    $lookup: {
                                        from: "universities",
                                        localField: "university",
                                        foreignField: "_id",
                                        as: "university",
                                    },
                                },
                                { $unwind: "$university" },
                                {
                                    $project: {
                                        _id: 1,
                                        name: "$university.name",
                                        startDate: "$__start",
                                        endDate: "$__end",
                                        status: 1,
                                        createdAt: 1,
                                    },
                                },
                            ],
                        },
                    },
                ]),
                University.countDocuments(),
                Application.countDocuments(),
            ]);

        // 6️⃣ Combine results
        const {
            stats = [],
            recentApplications = [],
            passedApplications = [],
        } = dashboardData[0] || {};

        const findCount = (key: string) =>
            stats.find((s: any) => s._id === key)?.count || 0;

        return NextResponse.json({
            totalUniversities,
            totalApplications,
            active: findCount("open"),
            upcoming: findCount("upcoming"),
            openingSoon: findCount("opening-soon"),
            closingSoon: findCount("closing-soon"),
            closed: findCount("closed"),
            unknown: findCount("unknown"),
            recentApplications,
            passedApplications,
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json(
            {
                message: "An error occurred while fetching dashboard data.",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
