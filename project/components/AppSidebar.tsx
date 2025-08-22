"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { FolderOpen, Home, Users, User, ChevronDown, Bell } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { SignOutButton, UserButton, useSession } from "@clerk/nextjs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { TypographyP } from "./typography/TypographyP";
import { TypographyMuted } from "./typography/TypographyMuted";

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Notification",
        url: "/notifications",
        icon: Bell,
    },
    {
        title: "Team",
        url: "/teams",
        icon: Users,
    },
    {
        title: "Projects",
        url: "/projects",
        icon: FolderOpen,
    },
];

export function AppSidebar() {
    const session = useSession();

    return (
        <Sidebar>
            {/* Header */}
            <SidebarHeader className="px-4 py-3">
                <Link
                    href="/"
                    className="text-2xl font-bold hover:opacity-80 transition"
                >
                    SEKAIde
                </Link>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>General</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon className="w-4 h-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter>
                <SidebarMenu className="flex flex-row gap-2 border-t p-2 items-center">
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="h-full">
                                    <div className="flex flex-row items-center gap-2 ">
                                        <img
                                            src={session.session?.user.imageUrl}
                                            className="h-8 w-8 rounded-full object-cover"
                                        />
                                        <span>
                                            {session.session?.user.fullName ??
                                                "User"}
                                        </span>
                                    </div>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem>
                                    <Link href="/settings">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <SignOutButton redirectUrl="/" />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="ml-auto">
                        <ThemeToggle />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
