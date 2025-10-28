import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import University from "@/models/university";
<<<<<<< HEAD
=======
import { authenticateUser } from "@/lib/authenticate-user";
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
<<<<<<< HEAD
        await dbConnect();
        const university = await University.findById(params.id);
=======
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

        const { id } = await params;

        await dbConnect();
        const university = await University.findById(id);
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
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
<<<<<<< HEAD
        await dbConnect();
        const body = await request.json();
        const university = await University.findByIdAndUpdate(params.id, body, {
=======
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

        const { id } = await params;

        await dbConnect();
        const body = await request.json();
        const university = await University.findByIdAndUpdate(id, body, {
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
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
<<<<<<< HEAD
        await dbConnect();
        const university = await University.findByIdAndDelete(params.id);
=======
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

        const { id } = await params;

        await dbConnect();
        const university = await University.findByIdAndDelete(id);
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
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
