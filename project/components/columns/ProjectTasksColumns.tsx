"use client";

import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { TypographyP } from "@/components/typography/TypographyP";
import { Badge } from "@/components/ui/badge";
import { FetchTask, FetchTeamMember } from "@/types/ServerResponses";
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
import { useAuthRoleByProject, useAuthRoleByTask } from "@/hooks/useRoles";
import Link from "next/link";
import { ro } from "date-fns/locale";
import { Checkbox } from "../ui/checkbox";
import DeleteTaskFromList from "../dialog/DeleteTaskFromList";
import EditTask from "../dialog/EditTask";

export const ProjectTasksColumn: (
    projectSlug: string
) => ColumnDef<FetchTask>[] = (projectSlug) => [
    {
        accessorKey: "title",
        header: "Task Title",
        cell: ({ row }) => (
            <Link
                href={`/projects/${projectSlug}/${row.original.slug}`}
                className="underline"
            >
                {row.original.title}
            </Link>
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
                <div className="flex flex-col">
                    <TypographyP margin={false}>
                        {task.assigneeName}
                    </TypographyP>
                    <TypographyMuted>{task.assigneeUsername}</TypographyMuted>
                </div>
            );
        },
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
            const task = row.original;
            return (
                <Badge
                    className={`capitalize ${
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
        header: "List",
        cell: ({ row }) => {
            const task = row.original;
            if (!task.listId) return "Unlisted";
            return (
                <span className={`text-rainbow-${task.listColor}`}>
                    {task.listName}
                </span>
            );
        },
    },
    {
        accessorKey: "finished",
        header: "Finished",
        cell: ({ row }) => {
            const task = row.original;
            return <Checkbox disabled checked={task.finished}></Checkbox>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const task = row.original;
            const [editDialog, showEditDialog] = useState(false);
            const [deleteDialog, showDeleteDialog] = useState(false);
            const { permitted: permittedUpdate } = useAuthRoleByTask(
                task.id,
                projectSlug,
                "update_task"
            );
            const { permitted: permittedDelete } = useAuthRoleByTask(
                task.id,
                projectSlug,
                "delete_task"
            );

            return (
                (permittedUpdate || permittedDelete) && (
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
                                    onClick={() => showEditDialog(true)}
                                >
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => showDeleteDialog(true)}
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {
                            deleteDialog && <DeleteTaskFromList task={task} projectSlug={projectSlug} setOpen={showDeleteDialog}/>
                        }
                        {editDialog && <EditTask task={task} projectSlug={projectSlug} setOpen={showEditDialog}/>}
                    </>
                )
            );
        },
    },
];
