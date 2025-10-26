import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import University from "@/models/university";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const university = await University.findById(params.id);
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
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const body = await request.json();
        const university = await University.findByIdAndUpdate(params.id, body, {
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
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const university = await University.findByIdAndDelete(params.id);
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
