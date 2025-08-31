import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import DeleteTask from "../modals/DeleteTask";
import EditTask from "../modals/EditTask";
import { FetchTask } from "@/types/ServerResponses";
import useModalStore from "@/stores/modalStores";

interface TaskDropDownProps {
    task: FetchTask;
}

const TaskDropDown: React.FC<TaskDropDownProps> = ({ task }) => {
    const { setEditTaskId, setDeleteTaskId } = useModalStore();

    return (
        <>
            <DeleteTask task={task} projectSlug={task.projectSlug} />
            <EditTask task={task} projectSlug={task.projectSlug} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditTaskId(task.id)}>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteTaskId(task.id)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default TaskDropDown;
