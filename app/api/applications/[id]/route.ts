import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Application from "@/models/application";
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
        const application = await Application.findById(id)
            .populate("university", "name image altImage address uniId _id")
            .lean();

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
        const application = await Application.findByIdAndUpdate(id, body, {
            new: true,
        })
            .populate("university", "name image altImage address uniId _id")
            .lean();
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
