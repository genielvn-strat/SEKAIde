import React, { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { useListActions } from "@/hooks/useLists";
import { toast } from "sonner";
import { FetchList } from "@/types/ServerResponses";
import { useAuthRoleByProject } from "@/hooks/useRoles";
import DeleteList from "../modals/DeleteList";
import EditList from "../modals/EditList";

interface ListActionsProps {
    list: FetchList;
    projectSlug: string;
}

const ListActions: React.FC<ListActionsProps> = ({ list, projectSlug }) => {
    const { moveList } = useListActions(projectSlug);
    const [editDialog, showEditDialog] = useState(false);
    const [deleteDialog, showDeleteDialog] = useState(false);

    const { permitted: permittedUpdate } = useAuthRoleByProject(
        projectSlug,
        "update_list"
    );
    const { permitted: permittedDelete } = useAuthRoleByProject(
        projectSlug,
        "delete_list"
    );

    const onMoveList = async (direction: "left" | "right") => {
        try {
            const response = await moveList({
                listId: list.id,
                projectSlug,
                direction,
            });
            if (!response.success) {
                throw new Error(response.message);
            }
            toast.success(`List moved to the ${direction}.`);
        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);
                return;
            }
        }
    };
    return !permittedDelete && !permittedUpdate ? (
        <></>
    ) : (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <EllipsisVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {permittedUpdate && (
                        <>
                            <DropdownMenuItem
                                onClick={() => {
                                    onMoveList("left");
                                }}
                            >
                                Move Left
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    onMoveList("right");
                                }}
                            >
                                Move Right
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    showEditDialog(true);
                                }}
                            >
                                Edit
                            </DropdownMenuItem>
                        </>
                    )}
                    {permittedDelete && (
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                                showDeleteDialog(true);
                            }}
                        >
                            Delete
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            {deleteDialog && (
                <DeleteList
                    list={list}
                    projectSlug={projectSlug}
                    setOpen={showDeleteDialog}
                />
            )}
            {editDialog && (
                <EditList
                    list={list}
                    projectSlug={projectSlug}
                    setOpen={showEditDialog}
                />
            )}
        </>
    );
};

export default ListActions;
