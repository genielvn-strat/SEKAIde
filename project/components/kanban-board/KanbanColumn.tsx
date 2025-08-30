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

import CreateTaskToList from "../buttons/CreateTaskToList";
import ListDropDown from "../dropdown/ListDropDown";
import { CircleCheck } from "lucide-react";

export function KanbanColumn({
    list,
    tasks,
    overId,
    activeId,
    projectSlug,
}: {
    list: FetchList;
    tasks: FetchTask[];
    overId: string | null;
    activeId: string | null;
    projectSlug: string;
}) {
    const { setNodeRef } = useDroppable({
        id: list.id,
    });

    return (
        <Card ref={setNodeRef} className="flex flex-col flex-shrink-0 w-80">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="left">
                    <div
                        className={`flex flex-row items-center gap-2 text-rainbow-${list.color}`}
                    >
                        {list.isFinal && <CircleCheck size={16} />}
                        <CardTitle className={`text-rainbow-${list.color}`}>
                            {list.name}
                        </CardTitle>
                    </div>
                    <CardDescription>{list.description}</CardDescription>
                </div>
                <div className="right">
                    <ListDropDown list={list} projectSlug={projectSlug} />
                </div>
            </CardHeader>

            <CardContent className="flex flex-col flex-1 gap-3 overflow-y-auto min-h-0 max-h-full">
                <SortableContext items={tasks.map((task) => task.id)}>
                    {tasks.map((task) => (
                        <div key={task.id} className="relative">
                            {overId === task.id && (
                                <div className="absolute -top-2 left-0 right-0 h-32 bg-blue-400 rounded opacity-60 z-10" />
                            )}
                            <KanbanTask
                                key={task.id}
                                activeId={activeId}
                                task={task}
                            />
                        </div>
                    ))}
                </SortableContext>

                {overId === list.id && (
                    <div className="h-2 bg-blue-400 rounded mt-2 opacity-60" />
                )}
                {tasks.length === 0 && (
                    <div className="text-center text-xs text-gray-500 dark:text-gray-400 py-6">
                        No tasks
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <CreateTaskToList projectSlug={projectSlug} list={list} />
            </CardFooter>
        </Card>
    );
}
