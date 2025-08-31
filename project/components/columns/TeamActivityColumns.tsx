"use client";

import { FetchTeamActivity } from "@/types/ServerResponses";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { TypographyP } from "../typography/TypographyP";
import { TypographyMuted } from "../typography/TypographyMuted";

export const TeamActivityColumns: (
    teamSlug: string
) => ColumnDef<FetchTeamActivity>[] = (teamSlug) => [
    {
        accessorKey: "createdAt",
        header: "Activity since",
        cell: ({ row }) => {
            const activity = row.original;
            const date = new Date(activity.createdAt ?? 0);
            const formatted = date.toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            });
            return formatted;
        },
    },
    {
        accessorKey: "userName",
        header: "Activity by",
        cell: ({ row }) => {
            const activity = row.original;
            if (!activity.userName && !activity.userFullName) return "-";
            return (
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage
                            className="object-cover"
                            src={activity.userDisplayPicture ?? ""}
                        ></AvatarImage>
                        <AvatarFallback>
                            {activity.userName?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <TypographyP margin={false}>
                            {activity.userFullName}
                        </TypographyP>
                        <TypographyMuted>{activity.userName}</TypographyMuted>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "description",
        header: "Description",
    },
];
