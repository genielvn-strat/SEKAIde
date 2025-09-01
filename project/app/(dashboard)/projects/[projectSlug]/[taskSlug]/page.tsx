"use client";

import LoadingSkeleton from "@/components/LoadingSkeleton";
import { TypographyH1 } from "@/components/typography/TypographyH1";
import { Separator } from "@/components/ui/separator";
import { useComments } from "@/hooks/useComments";
import { useTaskDetails } from "@/hooks/useTasks";
import { CheckCircle2, SlashIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { use, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypographyP } from "@/components/typography/TypographyP";
import { TypographyH2 } from "@/components/typography/TypographyH2";
import CreateComment from "@/components/CreateComment";
import CommentCard from "@/components/cards/CommentCard";
import { Button } from "@/components/ui/button";
import TaskDropDown from "@/components/dropdown/TaskDropDown";
import Priority from "@/components/badge/Priority";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import ListBadge from "@/components/badge/ListBadge";
import LoadingSkeletonCards from "@/components/LoadingSkeletonCards";
import ErrorAlert from "@/components/ErrorAlert";
import { useAuthRoleByProject } from "@/hooks/useRoles";
import { useRecentStore } from "@/stores/recentStores";
interface TaskProps {
    params: Promise<{
        projectSlug: string;
        taskSlug: string;
    }>;
}

export default function TaskDetails({ params }: TaskProps) {
    const { projectSlug, taskSlug } = use(params);
    const { setRecent } = useRecentStore();

    const { task, isLoading, isError, error } = useTaskDetails(
        taskSlug,
        projectSlug
    );

    const { permitted: createComment } = useAuthRoleByProject(
        projectSlug,
        "create_comment"
    );

    const {
        comments,
        isLoading: commentsLoading,
        isError: commentsIsError,
        error: commentsError,
    } = useComments(taskSlug, projectSlug, {
        enabled: !!task,
    });

    useEffect(() => {
        if (!task) return;
        setRecent({
            type: "task",
            title: task.title,
            link: `/projects/${projectSlug}/${taskSlug}`,
        });
    }, [task]);

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (!task) {
        return notFound();
    }

    if (isError) {
        return <ErrorAlert message={error?.message} />;
    }

    return (
        <>
            <div className="doc-header flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between">
                        <div>
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <Link href="/projects">
                                                Projects
                                            </Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator>
                                        <SlashIcon />
                                    </BreadcrumbSeparator>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <Link
                                                href={`/projects/${task.projectSlug}`}
                                            >
                                                {task.projectName}
                                            </Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator>
                                        <SlashIcon />
                                    </BreadcrumbSeparator>
                                </BreadcrumbList>
                            </Breadcrumb>
                            <div className="flex flex-row items-center gap-4">
                                <TypographyH1>{task.title}</TypographyH1>
                            </div>
                        </div>
                        {task.allowUpdate && <TaskDropDown task={task} />}
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-row gap-2">
                            {task.listName && (
                                <ListBadge
                                    listColor={task.listColor}
                                    listName={task.listName}
                                />
                            )}
                            <Priority priority={task.priority} />

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
                            <span
                                className={`text-sm text-muted-foreground ${
                                    task.dueDate &&
                                    !task.finished &&
                                    new Date(task.dueDate) < new Date()
                                        ? "text-red-600 font-semibold"
                                        : ""
                                }
                            `}
                            >
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
                                    className="object-cover"
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
                {createComment && (
                    <Button
                        onClick={() =>
                            document
                                .getElementById("create-comment")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        Make a comment
                    </Button>
                )}
            </div>
            <div className="space-y-4 my-2">
                {commentsLoading ? (
                    <LoadingSkeletonCards />
                ) : commentsIsError ? (
                    <ErrorAlert message={commentsError?.message} />
                ) : comments && comments.length > 0 ? (
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
                {createComment && <CreateComment task={task} />}
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
