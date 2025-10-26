"use client";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";

export default function Logout() {
    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    redirect("/sign-in");
                },
            },
        });
    };
    return (
        <Button
            type="button"
            onClick={handleSignOut}
            className="bg-red-50 text-gray-700 hover:bg-red-100 border border-red-200 w-full"
        >
            Log Out
        </Button>
    );
}
