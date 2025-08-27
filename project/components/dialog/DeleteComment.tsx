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
import { FetchComment, FetchList } from "@/types/ServerResponses";
import { useCommentActions } from "@/hooks/useComments";

interface DeleteCommentProps {
    comment: FetchComment;
    taskSlug: string;
    projectSlug: string;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const DeleteComment: React.FC<DeleteCommentProps> = ({
    comment,
    projectSlug,
    taskSlug,
    setOpen,
}) => {
    const { deleteComment } = useCommentActions(taskSlug);

    const handleDelete = async () => {
        try {
            const result = await deleteComment({
                commentId: comment.id,
                taskSlug,
                projectSlug,
            });
            if (!result.success) {
                throw new Error(result.message);
            }
            toast.success(`Comment has been deleted.`);
        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);
                return;
            }
        } finally {
            setOpen(false);
        }
    };

    return (
        <AlertDialog open onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpen(false)}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive dark:bg-destructive"
                        onClick={handleDelete}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteComment;
