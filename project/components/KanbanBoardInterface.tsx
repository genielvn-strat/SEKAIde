"use client";

import { FetchList, FetchTask } from "@/types/ServerResponses";
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanTask } from "./KanbanTask";
import { useTaskActions } from "@/hooks/useTasks";

interface KanbanBoardProps {
    projectSlug: string;
    lists: FetchList[];
    tasks: FetchTask[];
}

export function KanbanBoardInterface({
    projectSlug,
    lists: lists,
    tasks: initialTasks,
}: KanbanBoardProps) {
    const [tasks, setTasks] = useState(initialTasks);
    const [activeTask, setActiveTask] = useState<FetchTask | null>(null);
    const { updateTask } = useTaskActions();

    useEffect(() => {
        setTasks(initialTasks)
    }, [initialTasks])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    function handleDragStart(event: any) {
        const { active } = event;
        const task = tasks.find((t) => t.id === active.id);
        setActiveTask(task || null);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) {
            setActiveTask(null);
            return;
        }

        const activeTaskId = active.id;
        const overId = over.id;

        const activeTask = tasks.find((t) => t.id === activeTaskId);
        if (!activeTask) {
            setActiveTask(null);
            return;
        }

        const activeListId = activeTask.listId;

        // Find the list where the item was dropped
        const overListId =
            lists.find((list) => list.id === overId)?.id ||
            tasks.find((task) => task.id === overId)?.listId;

        if (activeListId !== overListId) {
            // Task moved to a different column
            setTasks((prevTasks) => {
                const newTasks = prevTasks.map((t) =>
                    t.id === activeTaskId ? { ...t, listId: overListId } : t
                );
                return newTasks;
            });
            updateTask({
                taskSlug: activeTask.slug,
                data: {
                    listId: overListId,
                },
                projectSlug: projectSlug,
            });
        } else {
            // Task reordered within the same column
            const tasksInList = tasks.filter(
                (task) => task.listId === activeListId
            );
            const oldIndex = tasksInList.findIndex(
                (task) => task.id === activeTaskId
            );
            const newIndex = tasksInList.findIndex(
                (task) => task.id === overId
            );

            setTasks((prevTasks) => {
                const newTasksInList = arrayMove(
                    tasksInList,
                    oldIndex,
                    newIndex
                );
                const otherTasks = prevTasks.filter(
                    (task) => task.listId !== activeListId
                );
                return [...otherTasks, ...newTasksInList];
            });
        }

        setActiveTask(null);
    }

    return (
        <div className="p-6 bg-white border rounded-lg dark:bg-outer_space-500 border-french_gray-300 dark:border-gray-400">
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex pb-4 space-x-6 overflow-x-auto">
                    {lists.map((list) => {
                        const taskList = tasks.filter(
                            (task) => task.listId === list.id
                        );
                        return (
                            <SortableContext
                                items={taskList.map((task) => task.id)}
                                key={list.id}
                            >
                                <KanbanColumn
                                    list={list}
                                    tasks={taskList}
                                    projectSlug={projectSlug}
                                />
                            </SortableContext>
                        );
                    })}
                </div>
                <DragOverlay>
                    {activeTask ? <KanbanTask task={activeTask} /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
