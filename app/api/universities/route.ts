import { NextResponse } from "next/server";
import dbConnect from "@/lib/database";
import University from "@/models/university";
import { IUniversity } from "@/types";

export async function GET(): Promise<NextResponse> {
    try {
        await dbConnect();
        const universities: IUniversity[] = await University.find({});
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
