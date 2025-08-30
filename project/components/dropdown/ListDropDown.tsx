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
import useModalStore from "@/stores/modalStores";

interface ListDropDownProps {
    list: FetchList;
    projectSlug: string;
}

const ListDropDown: React.FC<ListDropDownProps> = ({ list, projectSlug }) => {
    const { moveList } = useListActions(projectSlug);
    const { setEditListId, setDeleteListId } = useModalStore();

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
                                    setEditListId(list.id)
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
                                setDeleteListId(list.id)
                            }}
                        >
                            Delete
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteList list={list} projectSlug={projectSlug} />
            <EditList list={list} projectSlug={projectSlug} />
        </>
    );
};

export default ListDropDown;
