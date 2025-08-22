import { useCommentActions } from "@/hooks/useComments";
import { commentSchema, CreateCommentInput } from "@/lib/validations";
import { FetchTask } from "@/types/ServerResponses";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";

interface CreateCommentProps {
    task: FetchTask;
}

const CreateComment: React.FC<CreateCommentProps> = ({ task }) => {
    const { createComment } = useCommentActions(task.slug);

    const form = useForm<CreateCommentInput>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            content: ""
        }
    });

    const onSubmit: SubmitHandler<CreateCommentInput> = async (data) => {
        try {
            const response = await createComment({
                data,
                projectSlug: task.projectSlug,
                taskSlug: task.slug,
            });
            if (!response.success) {
                throw new Error(response.message);
            }
            form.reset();
            toast.success("Comment has been posted successfully.");
        } catch (e) {
            if (e instanceof Error) {
                form.setError("root", { message: e.message });
                toast.error(e.message);
                return;
            }
            form.setError("root", {
                message:
                    "An error has occured while commenting. Please try again later or contact system administrator.",
            });
        }
    };
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                id="create-comment"
                className="flex flex-col gap-2"
            >
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea {...field} placeholder="" rows={5}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    form={`create-comment`}
                    className="w-fit self-end"
                >
                    {form.formState.isSubmitting ? "Commenting..." : "Comment"}
                </Button>
            </form>
        </Form>
    );
};

export default CreateComment;
