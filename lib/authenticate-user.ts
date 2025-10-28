import { NextResponse } from "next/server";
import { auth } from "./auth";

export const authenticateUser = async (
    request: Request
): Promise<void | NextResponse> => {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized Access ⚠️" },
            { status: 401 }
        );
    }
};
