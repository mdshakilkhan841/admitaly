import { NextResponse } from "next/server";
import Application from "@/models/application";
import dbConnect from "@/lib/database";
import { authenticateUser } from "@/lib/authenticate-user";

export async function GET(): Promise<NextResponse> {
    try {
        await dbConnect();
        const applications = await Application.find({})
            .sort({ createdAt: -1 })
            .populate("university", "name image altImage address uniId _id")
            .lean();

        return NextResponse.json(applications);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

        await dbConnect();
        const body = await request.json();
        const application = await Application.create(body);
        return NextResponse.json(application, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request): Promise<NextResponse> {
    try {
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

        const { ids } = await request.json();

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { error: "Invalid input: 'ids' must be a non-empty array." },
                { status: 400 }
            );
        }

        await dbConnect();
        const result = await Application.deleteMany({
            _id: { $in: ids },
        });

        return NextResponse.json({
            message: `${result.deletedCount} applications deleted successfully.`,
        });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
