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
import KickMember from "@/components/dialog/KickMember";
import { useState } from "react";
import { useAuthRoleByTeam } from "@/hooks/useRoles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const TeamMemberColumns: (
    teamSlug: string
) => ColumnDef<FetchTeamMember>[] = (teamSlug) => [
    {
        accessorKey: "name",
        header: "Member",
        cell: ({ row }) => {
            const member = row.original; // full object
            return (
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage
                            src={member.displayPictureLink}
                        ></AvatarImage>
                        <AvatarFallback>
                            {member.name?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

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
        header: () => <span className="hidden md:table-cell">Email</span>,
        cell: ({ row }) => (
            <span className="hidden md:table-cell">{row.original.email}</span>
        ),
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.original.roleName;
            return <Badge variant="outline">{role}</Badge>;
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
            const permittedKick = row.original.allowKick;
            const memberId = row.original.userId;
            const memberName = row.original.name;
            const memberRoleName = row.original.roleName;
            return (
                permittedKick && (
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
                )
            );
        },
    },
];
