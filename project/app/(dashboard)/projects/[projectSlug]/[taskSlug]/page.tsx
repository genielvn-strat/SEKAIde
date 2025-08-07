"use client";

import { useComments } from "@/hooks/useComments";
import { useTaskDetails } from "@/hooks/useTaskDetails";
import {
    commentSchema,
    CreateCommentInput,
    UpdateCommentInput,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { notFound } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

interface TaskProps {
    params: {
        projectSlug: string;
        taskSlug: string;
    };
}

export default function TaskDetails({ params }: TaskProps) {
    const { projectSlug, taskSlug } = params;

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateCommentInput>({
        resolver: zodResolver(commentSchema),
    });

    const { task, isLoading, isError, error } = useTaskDetails(
        taskSlug,
        projectSlug
    );

    const { comments, createComment, deleteComment, updateComment } =
        useComments(taskSlug, projectSlug, {
            enabled: !!task,
        });

    if (isLoading) {
        return <div className="loading">Loading task...</div>;
    }

    if (isError) {
        console.error("Error loading task:", error);
        return (
            <div className="error">
                Error loading task. Please try again later.
            </div>
        );
    }

    if (!task) {
        return notFound();
    }

    const onCommentSubmit: SubmitHandler<CreateCommentInput> = async (data) => {
        try {
            await createComment({
                taskSlug: taskSlug,
                projectSlug: projectSlug,
                data,
            });
            reset();
        } catch {
            setError("root", { message: "Server error" });
        }
    };

    return (
        <>
            <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
                <h1 className="text-xl font-bold mb-2">{task.title}</h1>
                <p className="text-sm text-muted-foreground mb-4">
                    Project: {task.projectName} / Assigned to:{" "}
                    {task.assigneeName} ({task.assigneeUsername})
                </p>

                <div className="space-y-2 text-sm">
                    <div>
                        <span className="font-semibold">Description:</span>
                        <p className="mt-1">
                            {task.description || "No description."}
                        </p>
                    </div>

                    <div>
                        <span className="font-semibold">Priority:</span>{" "}
                        {task.priority ?? "None"}
                    </div>

                    <div>
                        <span className="font-semibold">Due Date:</span>{" "}
                        {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "None"}
                    </div>

                    <div>
                        <span className="font-semibold">Position:</span>{" "}
                        {task.position ?? "None"}
                    </div>

                    <div>
                        <span className="font-semibold">Slug:</span> {task.slug}
                    </div>
                </div>
            </div>
            <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
                <h1 className="text-xl font-bold mb-2">Comments</h1>
                <form
                    onSubmit={handleSubmit(onCommentSubmit)}
                    className="space-y-2 mb-6"
                >
                    <textarea
                        placeholder="Content"
                        className="w-full border px-3 py-2 rounded"
                        {...register("content")}
                    />
                    {errors.content && (
                        <p className="text-sm text-red-600">
                            {errors.content.message}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        {isSubmitting ? "Creating..." : "Add Comment"}
                    </button>
                </form>
                <div className="space-y-4">
                    {comments && comments.length > 0 ? (
                        comments.map((comment) => (
                            <div
                                key={comment.id}
                                className="border border-gray-200 rounded p-4 bg-gray-50"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-sm font-semibold">
                                            {comment.authorName} (@
                                            {comment.authorUsername})
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {comment.createdAt
                                                ? new Date(
                                                      comment.createdAt
                                                  ).toLocaleString()
                                                : "Unknown date"}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            deleteComment({
                                                commentId: comment.id,
                                                taskSlug,
                                                projectSlug,
                                            })
                                        }
                                        className="text-xs text-red-600 hover:underline ml-2"
                                    >
                                        Delete
                                    </button>
                                </div>
                                <p className="text-sm text-gray-800 whitespace-pre-wrap mt-2">
                                    {comment.content}
                                </p>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const formData = new FormData(
                                            e.currentTarget as HTMLFormElement
                                        );
                                        const content = formData.get(
                                            "content"
                                        ) as string;

                                        updateComment({
                                            commentId: comment.id,
                                            taskSlug: taskSlug,
                                            projectSlug: projectSlug,
                                            data: {
                                                content: content,
                                            },
                                        });
                                    }}
                                >
                                    <textarea
                                        name="content"
                                        defaultValue={comment.content}
                                        className="w-full border px-3 py-1 rounded text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                                    >
                                        {isSubmitting
                                            ? "Updating..."
                                            : "Update Comment"}
                                    </button>
                                </form>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">
                            No comments yet.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
