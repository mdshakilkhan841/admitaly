import { Icons } from "@/components/icons";

export interface IUniversity {
    _id: string;
    name: string;
    address: string;
    image: string;
}

export interface IApplication {
    _id: string;
    uniId: IUniversity;
    call: string;
    applicationLink: string;
    admissionFee: string;
    startDate: string;
    endDate: string;
    cgpa: string;
    others: string[];
    languageProficiency: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface NavItem {
    title: string;
    url: string;
    disabled?: boolean;
    external?: boolean;
    shortcut?: [string, string];
    icon?: keyof typeof Icons;
    label?: string;
    description?: string;
    isActive?: boolean;
    items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
    items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
    items?: NavItemWithChildren[];
}

export interface FooterItem {
    title: string;
    items: {
        title: string;
        href: string;
        external?: boolean;
    }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
