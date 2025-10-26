import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const SigninLayout = async ({
    children,
}: Readonly<{ children: React.ReactNode }>) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) {
        redirect("/admin");
    }
    return <div>{children}</div>;
};

export default SigninLayout;
