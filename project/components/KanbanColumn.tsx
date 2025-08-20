"use client";
import { FetchList, FetchTask } from "@/types/ServerResponses";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { KanbanTask } from "./KanbanTask";
import { Button } from "./ui/button";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CirclePlus } from "lucide-react";
import CreateTask from "./buttons/CreateTask";

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
            className="flex flex-col flex-shrink-0 w-80 min-h-full"
        >
            <CardHeader>
                <CardTitle>{list.name}</CardTitle>
                <CardDescription>{list.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-3 overflow-y-auto h-full max-h-[70vh]">
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

/*
<form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 p-4 border rounded-md shadow-sm"
                >
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            {...register("title")}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            {...register("description")}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="priority"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Priority
                        </label>
                        <select
                            id="priority"
                            {...register("priority")}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        {errors.priority && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.priority.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="dueDate"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Due Date
                        </label>
                        <input
                            id="dueDate"
                            type="date"
                            {...register("dueDate", { valueAsDate: true })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.dueDate && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.dueDate.message}
                            </p>
                        )}
                        {errors.listId && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.listId.message}
                            </p>
                        )}
                    </div>

                    <input type="hidden" {...register("listId")} />
                    <input
                        type="number"
                        {...register("position", { valueAsNumber: true })}
                    />
                    {errors.position && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.position.message}
                        </p>
                    )}
                    <input type="checkbox" {...register("finished")} />
                    {errors.finished && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.finished.message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Create Task
                    </button>
                </form>
                */
