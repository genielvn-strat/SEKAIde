"use client";
import { FetchTask } from "@/types/ServerResponses";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import TaskDetails from "./dialog/TaskDetails";
import { Grip } from "lucide-react";
import Priority from "./badge/Priority";

export function KanbanTask({
    task,
    activeId,
}: {
    task: FetchTask;
    activeId: string | null;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transition,
    };

    return (
        <Card
            ref={setNodeRef}
            style={{
                ...style,
                opacity: !task.allowUpdate ? 0.5 : activeId === task.id ? 0 : 1,
            }}
            className={`${activeId === task.id ? "opacity-0" : "opacity-100"}`}
            {...(task.allowUpdate ? { ...attributes, ...listeners } : {})}
        >
            <CardHeader>
                <div className="flex justify-between">
                    <TaskDetails task={task}>
                        <CardTitle>{task.title}</CardTitle>
                    </TaskDetails>
                    <div className="p-0">
                        {task.allowUpdate && (
                            <Grip size={16} className="ml-2" />
                        )}
                    </div>
                </div>
                <CardDescription className="mt-1 text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                    {task.description}
                </CardDescription>
                <div className="flex justify-between items-center mt-3 text-xs ">
                    <Priority priority={task.priority} />
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
            </CardHeader>
        </Card>
    );
}
