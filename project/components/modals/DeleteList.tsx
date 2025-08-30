import React, { Dispatch, SetStateAction } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useListActions } from "@/hooks/useLists";
import { FetchList } from "@/types/ServerResponses";
import useModalStore from "@/stores/modalStores";

interface DeleteListProps {
    list: FetchList;
    projectSlug: string;
}

const DeleteList: React.FC<DeleteListProps> = ({ list, projectSlug }) => {
    const { deleteListId, setDeleteListId } = useModalStore();
    const { deleteList } = useListActions(projectSlug);

    const handleDelete = async () => {
        try {
            const result = await deleteList({
                listId: list.id,
                projectSlug,
            });
            if (!result.success) {
                throw new Error(result.message);
            }
            toast.success(`${list.name} has been deleted.`);
        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);
                return;
            }
        } finally {
            setDeleteListId(null);
        }
    };

    return (
        <AlertDialog
            open={list.id == deleteListId}
            onOpenChange={(open: boolean) =>
                setDeleteListId(open ? list.id : null)
            }
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {list.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to remove {list.name} from this
                        project? All tasks on this list will be unlisted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteList;
