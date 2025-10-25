"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import React from "react";

const AdminPage = () => {
    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    redirect("/admin/sign-in"); // redirect to login page
                },
            },
        });
    };
    return (
        <div>
            <Button type="button" onClick={handleSignOut}>
                Log Out
            </Button>
        </div>
    );
};

export default AdminPage;
