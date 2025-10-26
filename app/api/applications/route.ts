import { NextResponse } from "next/server";
import Application from "@/models/application";
import dbConnect from "@/lib/database";
import { IApplication } from "@/types";

export async function GET() {
    try {
        await dbConnect();
        const applications: IApplication[] = await Application.find(
            {}
        ).populate("uniId");
        return NextResponse.json(applications);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
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
