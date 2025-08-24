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
import { FetchList, FetchTask } from "@/types/ServerResponses";
import { useTaskActions } from "@/hooks/useTasks";
import { useRouter } from "next/navigation";

interface DeleteTaskProps {
    task: FetchTask;
    projectSlug: string;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const DeleteTask: React.FC<DeleteTaskProps> = ({
    task,
    projectSlug,
    setOpen,
}) => {
    const router = useRouter();
    const { deleteTask, isDeleting } = useTaskActions();

    const handleDelete = async () => {
        try {
            const result = await deleteTask({
                taskSlug: task.slug,
                projectSlug,
            });
            if (!result.success) {
                throw new Error(result.message);
            }
            toast.success(`${task.title} has been deleted.`);
            router.push(`/projects/${task.projectSlug}`);
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
                    <AlertDialogTitle>Delete {task.title}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to remove {task.title} from this
                        project?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteTask;
