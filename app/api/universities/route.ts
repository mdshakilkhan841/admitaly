import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import University from "@/models/university";
import { authenticateUser } from "@/lib/authenticate-user";

export async function GET(request: Request): Promise<NextResponse> {
    try {
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

        await dbConnect();

        const universities = await University.find({});

        return NextResponse.json(universities);
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
        const university = await University.create(body);
        return NextResponse.json(university, { status: 201 });
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
        const result = await University.deleteMany({
            _id: { $in: ids },
        });

        return NextResponse.json({
            message: `${result.deletedCount} universities deleted successfully.`,
        });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
