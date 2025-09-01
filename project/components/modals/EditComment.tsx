"use client";
import React from "react";
import {
    CreateCommentInput,
    UpdateCommentInput,
    updateCommentSchema,
} from "@/lib/validations";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FetchComment } from "@/types/ServerResponses";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";
import { useCommentActions } from "@/hooks/useComments";
import { Textarea } from "../ui/textarea";
import useModalStore from "@/stores/modalStores";
interface EditCommentProps {
    comment: FetchComment;
    taskSlug: string;
    projectSlug: string;
}

const EditComment: React.FC<EditCommentProps> = ({
    comment,
    taskSlug,
    projectSlug,
}) => {
    const { editCommentId, setEditCommentId } = useModalStore();

    const { updateComment } = useCommentActions(taskSlug);
    const form = useForm<UpdateCommentInput>({
        resolver: zodResolver(updateCommentSchema),
        defaultValues: {
            content: comment.content,
        },
    });

    const onSubmit: SubmitHandler<CreateCommentInput> = async (data) => {
        try {
            const response = await updateComment({
                data,
                taskSlug: taskSlug,
                commentId: comment.id,
                projectSlug: projectSlug,
            });
            if (!response.success) {
                throw new Error(response.message);
            }
            toast.success("Comment has been edited successfully.");
        } catch (e) {
            if (e instanceof Error) {
                form.setError("root", { message: e.message });
                toast.error(e.message);
                return;
            }
            form.setError("root", {
                message:
                    "An error has occured while editing your list. Please try again later or contact system administrator.",
            });
        }
    };

    return (
        <Dialog
            open={editCommentId == comment.id}
            onOpenChange={(open: boolean) => setEditCommentId(open ? comment.id : null)}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} id={`edit-comment-${comment.id}`}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Comment</DialogTitle>
                        </DialogHeader>
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {form.formState.errors.root && (
                            <p className="text-sm text-red-500 mt-2">
                                {form.formState.errors.root.message}
                            </p>
                        )}

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                form={`edit-comment-${comment.id}`}
                            >
                                {form.formState.isSubmitting
                                    ? "Editing"
                                    : "Edit"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Form>
        </Dialog>
    );
};

export default EditComment;
