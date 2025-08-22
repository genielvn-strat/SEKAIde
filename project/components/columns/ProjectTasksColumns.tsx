"use client";

import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { TypographyP } from "@/components/typography/TypographyP";
import { Badge } from "@/components/ui/badge";
import { FetchTask, FetchTeamMember } from "@/types/ServerResponses";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, CheckSquare, Square } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import KickMember from "@/components/dialog/KickMember";
import { useState } from "react";
import { useAuthRoleByProject, useAuthRoleByTask } from "@/hooks/useRoles";
import Link from "next/link";
import { ro } from "date-fns/locale";
import { Checkbox } from "../ui/checkbox";
import DeleteTask from "../dialog/DeleteTask";
import EditTask from "../dialog/EditTask";
import TaskDetails from "../dialog/TaskDetails";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TaskDropDown from "../dropdown/TaskDropDown";

export const ProjectTasksColumn: (
    projectSlug: string
) => ColumnDef<FetchTask>[] = (projectSlug) => [
    {
        accessorKey: "title",
        header: "Task Title",
        cell: ({ row }) => (
            <TaskDetails task={row.original}>{row.original.title}</TaskDetails>
        ),
    },
    {
        accessorKey: "assigneeName",
        header: "Assigned to",
        cell: ({ row }) => {
            const task = row.original;
            if (!task.assigneeName && !task.assigneeUsername)
                return "Unassigned";
            return (
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage
                            src={task.assigneeDisplayPicture}
                        ></AvatarImage>
                        <AvatarFallback>
                            {task.assigneeName?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <TypographyP margin={false}>
                            {task.assigneeName}
                        </TypographyP>
                        <TypographyMuted>
                            {task.assigneeUsername}
                        </TypographyMuted>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "priority",
        header: () => <span className="hidden md:table-cell">Priority</span>,
        cell: ({ row }) => {
            const task = row.original;
            return (
                <Badge
                    className={`capitalize hidden md:table-cell ${
                        task.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                    }`}
                >
                    {task.priority}
                </Badge>
            );
        },
    },
    {
        accessorKey: "dueDate",
        header: "Due",
        cell: ({ row }) => {
            const task = row.original;
            if (!task.dueDate) return "No due date";
            return (
                <TypographyP margin={false}>
                    {new Date(task.dueDate).toLocaleDateString()}
                </TypographyP>
            );
        },
    },
    {
        accessorKey: "listName",
        header: () => <span className="hidden md:table-cell">List</span>,
        cell: ({ row }) => {
            const task = row.original;
            if (!task.listId) return "Unlisted";
            return (
                <Badge
                    variant="default"
                    className={`bg-${task.listColor}-100  text-${task.listColor}-700 capitalize border hidden md:table-cell`}
                >
                    {task.listName}
                </Badge>
            );
        },
    },
    {
        accessorKey: "finished",
        header: () => <span className="hidden md:table-cell">Finished</span>,
        cell: ({ row }) => {
            const task = row.original;
            return (
                <span className="hidden md:table-cell">
                    {task.finished ? (
                        <CheckSquare className="text-green-600 w-4 h-4" />
                    ) : (
                        <Square className="text-gray-400 w-4 h-4" />
                    )}
                </span>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const task = row.original;
            const [editDialog, showEditDialog] = useState(false);
            const [deleteDialog, showDeleteDialog] = useState(false);

            return task.allowUpdate && <TaskDropDown task={task} />;
        },
    },
];
