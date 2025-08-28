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
import {
    FolderOpen,
    Home,
    Users,
    Bell,
    Calendar,
    BellDotIcon,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { SignOutButton, useAuth, UserButton, useSession } from "@clerk/nextjs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { TypographyP } from "./typography/TypographyP";
import { TypographyMuted } from "./typography/TypographyMuted";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { redirect } from "next/navigation";
import { useInvitedTeams } from "@/hooks/useTeams";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

export function AppSidebar() {
    const session = useSession();
    const { signOut } = useAuth();
    const { teams } = useInvitedTeams();
    const items = useMemo(
        () => [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: Home,
            },
            {
                title: "Notifications",
                url: "/notifications",
                icon: teams && teams.length > 0 ? BellDotIcon : Bell,
            },
            {
                title: "Calendar",
                url: "/calendar",
                icon: Calendar,
            },
            {
                title: "Teams",
                url: "/teams",
                icon: Users,
            },
            {
                title: "Projects",
                url: "/projects",
                icon: FolderOpen,
            },
        ],
        [teams]
    );

    useEffect(() => {
        if (teams && teams?.length > 0) {
            toast.info("You have a new team invitation.");
        }
    }, [teams]);

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
                                        <Avatar>
                                            <AvatarImage
                                                src={
                                                    session.session?.user
                                                        .imageUrl
                                                }
                                            ></AvatarImage>
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
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
                                <DropdownMenuItem
                                    onClick={() => {
                                        redirect("/settings");
                                    }}
                                >
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        signOut({ redirectUrl: "/" });
                                    }}
                                >
                                    Sign Out
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
