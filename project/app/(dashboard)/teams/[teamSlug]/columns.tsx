"use client";

import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { TypographyP } from "@/components/typography/TypographyP";
import { Badge } from "@/components/ui/badge";
import { FetchTeamMember } from "@/types/ServerResponses";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import KickMember from "@/components/KickMember";
import { useState } from "react";

export const columns: (teamSlug: string) => ColumnDef<FetchTeamMember>[] = (
    teamSlug
) => [
    {
        accessorKey: "name",
        header: "Member",
        cell: ({ row }) => {
            const member = row.original; // full object
            return (
                <div className="flex items-center gap-2">
                    <img
                        src={member.displayPictureLink} // adjust field name
                        alt={member.name}
                        className="h-8 w-8 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                        <TypographyP margin={false}>{member.name}</TypographyP>
                        <TypographyMuted>{member.username}</TypographyMuted>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.original.role;
            const roleConfig: Record<
                typeof role,
                { label: string; className: string }
            > = {
                admin: {
                    label: "Admin",
                    className: "bg-red-500/20 text-red-700 hover:bg-red-500/30",
                },
                project_manager: {
                    label: "Project Manager",
                    className:
                        "bg-blue-500/20 text-blue-700 hover:bg-blue-500/30",
                },
                member: {
                    label: "Member",
                    className:
                        "bg-gray-500/20 text-gray-700 hover:bg-gray-500/30",
                },
            };
            const { label, className } = roleConfig[role];
            return <Badge className={className}>{label}</Badge>;
        },
    },
    {
        accessorKey: "inviteConfirmed",
        header: "Status",
        cell: ({ row }) => {
            const confirmed = row.original.inviteConfirmed;
            return (
                <span
                    className={confirmed ? "text-green-600" : "text-yellow-600"}
                >
                    {confirmed ? "Joined" : "Pending"}
                </span>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const [kickDialog, showKickDialog] = useState(false);
            const memberId = row.original.userId;
            const memberName = row.original.name;
            const memberRole = row.original.role;
            if (memberRole === "admin") return null;
            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => showKickDialog(true)}
                            >
                                Kick
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {kickDialog && (
                        <KickMember
                            teamSlug={teamSlug}
                            memberUserId={memberId}
                            memberName={memberName}
                            setOpen={showKickDialog}
                        />
                    )}
                </>
            );
        },
    },
];
