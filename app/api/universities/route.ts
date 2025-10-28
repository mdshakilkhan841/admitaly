import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import University from "@/models/university";
import { IUniversity } from "@/types";
<<<<<<< HEAD

export async function GET(): Promise<NextResponse> {
    try {
        await dbConnect();
        const universities: IUniversity[] = await University.find({});
=======
import { auth } from "@/lib/auth";
import { authenticateUser } from "@/lib/authenticate-user";

export async function GET(request: Request): Promise<NextResponse> {
    try {
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");
        const sortBy = searchParams.get("sortBy");

        const filter: any = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { address: { $regex: search, $options: "i" } },
            ];
        }

        const sort: any = {};
        if (sortBy) {
            const [key, order] = sortBy.split(":");
            sort[key] = order === "desc" ? -1 : 1;
        }

        await dbConnect();
        const universities: IUniversity[] = await University.find(filter).sort(
            sort
        );
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
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
<<<<<<< HEAD
=======
        const authResponse = await authenticateUser(request);
        if (authResponse) return authResponse;

>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
        await dbConnect();
        const body = await request.json();
        const university: IUniversity = await University.create(body);
        return NextResponse.json(university, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
<<<<<<< HEAD
=======

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
>>>>>>> 255b1f472790a30c9616d9927a376d0c1a415dd4
