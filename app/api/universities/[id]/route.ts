import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import University from "@/models/university";
import { authenticateUser } from "@/lib/authenticate-user";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

        const { id } = await context.params;

        await dbConnect();
        const university = await University.findById(id);
        if (!university) {
            return NextResponse.json(
                { error: "University not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(university);
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
        const university = await University.findByIdAndUpdate(id, body, {
            new: true,
        });
        if (!university) {
            return NextResponse.json(
                { error: "University not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(university);
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
        const university = await University.findByIdAndDelete(id);
        if (!university) {
            return NextResponse.json(
                { error: "University not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: "University deleted successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
