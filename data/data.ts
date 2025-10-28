import { NavItem } from "@/types";

export type Product = {
    photo_url: string;
    name: string;
    description: string;
    created_at: string;
    price: number;
    id: number;
    category: string;
    updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: "dashboard",
        isActive: false,
        shortcut: ["d", "d"],
        items: [], // Empty array as there are no child items for Dashboard
    },
    {
        title: "Universities",
        url: "/admin/universities",
        icon: "product",
        shortcut: ["p", "p"],
        isActive: false,
        items: [], // No child items
    },
    {
        title: "Applications",
        url: "/admin/applications",
        icon: "product",
        shortcut: ["p", "p"],
        isActive: false,
        items: [], // No child items
    },
    // {
    //     title: "Account",
    //     url: "#", // Placeholder as there is no direct link for the parent
    //     icon: "billing",
    //     isActive: true,

    //     items: [
    //         {
    //             title: "Profile",
    //             url: "/dashboard/profile",
    //             icon: "userPen",
    //             shortcut: ["m", "m"],
    //         },
    //         {
    //             title: "Login",
    //             shortcut: ["l", "l"],
    //             url: "/",
    //             icon: "login",
    //         },
    //     ],
    // },
];
