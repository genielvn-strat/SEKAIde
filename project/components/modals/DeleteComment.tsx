import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { FetchComment } from "@/types/ServerResponses";
import { useCommentActions } from "@/hooks/useComments";
import useModalStore from "@/stores/modalStores";

interface DeleteCommentProps {
    comment: FetchComment;
    taskSlug: string;
    projectSlug: string;
}

const DeleteComment: React.FC<DeleteCommentProps> = ({
    comment,
    projectSlug,
    taskSlug,
}) => {
    const { deleteCommentId, setDeleteCommentId } = useModalStore();
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
            setDeleteCommentId(null);
        }
    };

    return (
        <AlertDialog
            open={deleteCommentId == comment.id}
            onOpenChange={(open: boolean) =>
                setDeleteCommentId(open ? comment.id : null)
            }
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeleteCommentId(null)}>
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
