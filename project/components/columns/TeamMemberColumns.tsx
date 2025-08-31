"use client";

import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { TypographyP } from "@/components/typography/TypographyP";
import { Badge } from "@/components/ui/badge";
import { FetchTeamMember } from "@/types/ServerResponses";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TeamMemberDropDown from "../dropdown/TeamMemberDropDown";

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
                            className="object-cover"
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
            const teamMember = row.original;
            return (
                <TeamMemberDropDown
                    teamMember={teamMember}
                    teamSlug={teamSlug}
                />
            );
        },
    },
];
