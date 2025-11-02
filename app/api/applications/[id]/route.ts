import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import University from "@/models/university";
import Application from "@/models/application";
import { authenticateUser } from "@/lib/authenticate-user";
import mongoose from "mongoose";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

        const { id } = await context.params;
        await dbConnect();

        const [application] = await Application.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: "universities",
                    localField: "university",
                    foreignField: "_id",
                    as: "university",
                },
            },
            { $unwind: "$university" },
            { $limit: 1 },
        ]);

        if (!application) {
            return NextResponse.json(
                { error: "Application not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(application);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

        const { id } = await context.params;
        await dbConnect();

        const body = await request.json();
        await Application.findByIdAndUpdate(id, body);

        const [application] = await Application.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: "universities",
                    localField: "university",
                    foreignField: "_id",
                    as: "university",
                },
            },
            { $unwind: "$university" },
            { $limit: 1 },
        ]);

        if (!application) {
            return NextResponse.json(
                { error: "Application not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(application);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

        const { id } = await context.params;

        await dbConnect();
        const application = await Application.findByIdAndDelete(id);
        if (!application) {
            return NextResponse.json(
                { error: "Application not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: "Application deleted successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
