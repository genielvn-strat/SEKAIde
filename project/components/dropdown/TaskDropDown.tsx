import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import DeleteTask from "../modals/DeleteTask";
import EditTask from "../modals/EditTask";
import { FetchTask } from "@/types/ServerResponses";

interface TaskDropDownProps {
    task: FetchTask;
}

const TaskDropDown: React.FC<TaskDropDownProps> = ({ task }) => {
    const [editDialog, showEditDialog] = useState(false);
    const [deleteDialog, showDeleteDialog] = useState(false);

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
                    <DropdownMenuItem onClick={() => showEditDialog(true)}>
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
            {deleteDialog && (
                <DeleteTask
                    task={task}
                    projectSlug={task.projectSlug}
                    setOpen={showDeleteDialog}
                />
            )}
            {editDialog && (
                <EditTask
                    task={task}
                    projectSlug={task.projectSlug}
                    setOpen={showEditDialog}
                />
            )}
        </>
    );
};

export default TaskDropDown;
