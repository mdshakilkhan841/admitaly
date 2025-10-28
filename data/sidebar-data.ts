import {
    LayoutDashboard,
    Palette,
    Settings,
    UserCog,
    NotebookPen,
    GraduationCap,
} from "lucide-react";

import { LucideIcon } from "lucide-react";

export type SidebarData = {
    navGroups: {
        title: string;
        items: {
            title: string;
            url?: string;
            icon?: LucideIcon;
            badge?: string;
            isActive?: boolean;
            items?: {
                title: string;
                url?: string;
                icon?: LucideIcon;
            }[];
        }[];
    }[];
};

export const sidebarData: SidebarData = {
    navGroups: [
        {
            title: "Overview",
            items: [
                {
                    title: "Dashboard",
                    url: "/admin",
                    icon: LayoutDashboard,
                },
                {
                    title: "Universities",
                    url: "/admin/universities",
                    icon: GraduationCap,
                },
                {
                    title: "Applications",
                    url: "/admin/applications",
                    icon: NotebookPen,
                },
            ],
        },
        {
            title: "Other",
            items: [
                {
                    title: "Settings",
                    icon: Settings,
                    items: [
                        {
                            title: "Profile",
                            url: "#",
                            icon: UserCog,
                        },
                        {
                            title: "Appearance",
                            url: "#",
                            icon: Palette,
                        },
                    ],
                },
            ],
        },
    ],
};
