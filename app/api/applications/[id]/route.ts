import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import Application from "@/models/application";
import { auth } from "@/lib/auth";
import { authenticateUser } from "@/lib/authenticate-user";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

        await dbConnect();
        const application = await Application.findById(params.id).populate(
            "uniId"
        );
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
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

        await dbConnect();
        const body = await request.json();
        const application = await Application.findByIdAndUpdate(
            params.id,
            body,
            { new: true }
        ).populate("uniId");
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
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

        await dbConnect();
        const application = await Application.findByIdAndDelete(params.id);
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
