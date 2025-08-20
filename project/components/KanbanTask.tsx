"use client";
import { FetchTask } from "@/types/ServerResponses";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TypographyMuted } from "./typography/TypographyMuted";
import { Badge } from "./ui/badge";
import Link from "next/link";
export function KanbanTask({
    projectSlug,
    task,
}: {
    projectSlug: string;
    task: FetchTask;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="p-0 shadow-sm hover:shadow-md transition-shadow"
        >
            <CardHeader>
                <Link href={`/projects/${projectSlug}/${task.slug}`} className="underline">
                    <CardTitle>{task.title}</CardTitle>
                </Link>
                <CardDescription className="mt-1 text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                    {task.description}
                    <div className="flex justify-between items-center mt-3 text-xs ">
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
                        {task.dueDate && (
                            <span>
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
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TypographyMuted>
                    Assigned to: {task.assigneeName} ({task.assigneeUsername})
                </TypographyMuted>
            </CardContent>
        </Card>
    );
}
