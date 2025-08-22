"use client";

import LoadingSkeleton from "@/components/LoadingSkeleton";
import { TypographyH1 } from "@/components/typography/TypographyH1";
import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCommentActions, useComments } from "@/hooks/useComments";
import { useTaskDetails } from "@/hooks/useTasks";
import {
    commentSchema,
    CreateCommentInput,
    UpdateCommentInput,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { use } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypographyP } from "@/components/typography/TypographyP";
import { TypographyH2 } from "@/components/typography/TypographyH2";
import CreateComment from "@/components/CreateComment";
import CommentCard from "@/components/CommentCard";
import { Button } from "@/components/ui/button";
import TaskDropDown from "@/components/dropdown/TaskDropDown";
interface TaskProps {
    params: Promise<{
        projectSlug: string;
        taskSlug: string;
    }>;
}

export default function TaskDetails({ params }: TaskProps) {
    const { projectSlug, taskSlug } = use(params);

    const { task, isLoading, isError, error } = useTaskDetails(
        taskSlug,
        projectSlug
    );

    const { comments } = useComments(taskSlug, projectSlug, {
        enabled: !!task,
    });

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (isError) {
        return (
            <div className="error">
                Error loading task. Please try again later.
            </div>
        );
    }

    if (!task) {
        return notFound();
    }

    return (
        <>
            <div className="doc-header flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row items-center gap-4">
                            <TypographyH1>{task.title}</TypographyH1>
                            <TypographyMuted>
                                {" "}
                                // {task.projectName}
                            </TypographyMuted>
                        </div>
                        {task.allowUpdate && <TaskDropDown task={task} />}
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-row gap-2">
                            {task.listName && (
                                <Badge
                                    className={`capitalize border ${
                                        task.listColor
                                            ? `bg-${task.listColor}-100 text-${task.listColor}-700`
                                            : ""
                                    }`}
                                >
                                    {task.listName}
                                </Badge>
                            )}
                            <Badge
                                className={`capitalize ${
                                    task.priority === "high"
                                        ? "bg-red-100 text-red-700"
                                        : task.priority === "medium"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-green-100 text-green-700"
                                }`}
                            >
                                {task.priority}
                            </Badge>
                            <div className="flex items-center gap-2 text-sm">
                                {task.finished && (
                                    <>
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <span className="text-green-600">
                                            Finished
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        {task.dueDate && (
                            <span className="text-sm text-muted-foreground">
                                Due{" "}
                                {new Date(task.dueDate).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "short",
                                        day: "numeric",
                                    }
                                )}
                            </span>
                        )}
                    </div>
                </div>
                <TypographyP>{task.description}</TypographyP>
                {task.assigneeName && (
                    <div className="grid gap-1">
                        <span className="text-sm font-medium">
                            Assigned to:
                        </span>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={task.assigneeDisplayPicture}
                                    alt={task.assigneeName}
                                />
                                <AvatarFallback>
                                    {task.assigneeName
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium">
                                    {task.assigneeName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {task.assigneeUsername}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Separator className="my-4" />
            <div className="flex flex-row justify-between items-center">
                <TypographyH2>Comments</TypographyH2>
                <Button
                    onClick={() =>
                        document
                            .getElementById("create-comment")
                            ?.scrollIntoView({ behavior: "smooth" })
                    }
                >
                    Make a comment
                </Button>
            </div>
            <div className="space-y-4 my-2">
                {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <CommentCard
                            comment={comment}
                            taskSlug={taskSlug}
                            projectSlug={projectSlug}
                            key={comment.id}
                        />
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No comments yet.</p>
                )}
                <CreateComment task={task} />
            </div>
        </>
    );
}

// <>
//     <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
//         <h1 className="text-xl font-bold mb-2">{task.title}</h1>
//         <p className="text-sm text-muted-foreground mb-4">
//             Project: {task.projectName} / Assigned to:{" "}
//             {task.assigneeName} ({task.assigneeUsername})
//         </p>

//         <div className="space-y-2 text-sm">
//             <div>
//                 <span className="font-semibold">Description:</span>
//                 <p className="mt-1">
//                     {task.description || "No description."}
//                 </p>
//             </div>

//             <div>
//                 <span className="font-semibold">Priority:</span>{" "}
//                 {task.priority ?? "None"}
//             </div>

//             <div>
//                 <span className="font-semibold">Due Date:</span>{" "}
//                 {task.dueDate
//                     ? new Date(task.dueDate).toLocaleDateString()
//                     : "None"}
//             </div>

//             <div>
//                 <span className="font-semibold">Position:</span>{" "}
//                 {task.position ?? "None"}
//             </div>

//             <div>
//                 <span className="font-semibold">Slug:</span> {task.slug}
//             </div>
//         </div>
//     </div>
//     <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
//         <h1 className="text-xl font-bold mb-2">Comments</h1>
//
//
//     </div>
// </>
