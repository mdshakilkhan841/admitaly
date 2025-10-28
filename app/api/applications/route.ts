import { NextResponse } from "next/server";
import Application from "@/models/application";
import dbConnect from "@/lib/database";
import { IApplication } from "@/types";
import { auth } from "@/lib/auth";
import { authenticateUser } from "@/lib/authenticate-user";

export async function GET(request: Request): Promise<NextResponse> {
    try {
        // const authResponse = await authenticateUser(request);
        // if (authResponse) return authResponse;

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
