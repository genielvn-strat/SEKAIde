"use client";
import { FetchList, FetchTask } from "@/types/ServerResponses";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { KanbanTask } from "./KanbanTask";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import CreateTask from "./buttons/CreateTask";
import ListActions from "./buttons/ListActions";

export function KanbanColumn({
    list,
    tasks,
    projectSlug,
}: {
    list: FetchList;
    tasks: FetchTask[];
    projectSlug: string;
}) {
    const { setNodeRef } = useDroppable({
        id: list.id,
    });

    return (
        <Card
            ref={setNodeRef}
            className="flex flex-col flex-shrink-0 w-80"
        >
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="left">
                    <CardTitle className={`text-rainbow-${list.color}`}>
                        {list.name}
                    </CardTitle>
                    <CardDescription>{list.description}</CardDescription>
                </div>
                <div className="right">
                    <ListActions list={list} projectSlug={projectSlug} />
                </div>
            </CardHeader>

            <CardContent className="flex flex-col flex-1 gap-3 overflow-y-auto min-h-0 max-h-full">
                <SortableContext items={tasks.map((task) => task.id)}>
                    {tasks.map((task) => (
                        <KanbanTask
                            key={task.id}
                            task={task}
                            projectSlug={projectSlug}
                        />
                    ))}
                </SortableContext>

                {tasks.length === 0 && (
                    <div className="text-center text-xs text-gray-500 dark:text-gray-400 py-6">
                        No tasks
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <CreateTask projectSlug={projectSlug} list={list} />
            </CardFooter>
        </Card>
    );
}
