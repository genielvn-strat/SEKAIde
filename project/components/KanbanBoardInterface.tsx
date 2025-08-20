"use client";

import { FetchProject, FetchTask } from "@/types/ServerResponses";
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
import { useTaskActions, useTasks } from "@/hooks/useTasks";
import { useLists } from "@/hooks/useLists";
import LoadingSkeletonCards from "./LoadingSkeletonCards";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthRoleByProject } from "@/hooks/useRoles";
import { CirclePlus } from "lucide-react";
import { TypographyMuted } from "./typography/TypographyMuted";
import CreateColumn from "./buttons/CreateColumn";

interface KanbanBoardProps {
    project: FetchProject;
}

export function KanbanBoardInterface({ project }: KanbanBoardProps) {
    const { lists, isLoading: listLoading } = useLists(project.slug, {
        enabled: !!project,
    });
    const { tasks: initialTasks, isLoading: taskLoading } = useTasks(
        project.slug,
        {
            enabled: !!project,
        }
    );
    const { updateTask } = useTaskActions();
    const { permitted: permittedCreateList } = useAuthRoleByProject(
        project.slug,
        "create_list"
    );
    const [tasks, setTasks] = useState<FetchTask[]>([]);
    const [activeTask, setActiveTask] = useState<FetchTask | null>(null);

    useEffect(() => {
        if (initialTasks) setTasks(initialTasks);
    }, [initialTasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );
    if (listLoading || taskLoading) return <LoadingSkeletonCards />;
    if (!lists || !initialTasks || !tasks) return "An error has occured";

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
            lists?.find((list) => list.id === overId)?.id ||
            tasks.find((task) => task.id === overId)?.listId;

        if (!overListId) {
            setActiveTask(null);
            return;
        }

        if (activeListId !== overListId) {
            // Moving between columns
            setTasks((prevTasks) => {
                // Get tasks in target list
                const targetTasks = prevTasks.filter(
                    (t) => t.listId === overListId
                );

                // Figure out drop position
                let newIndex = targetTasks.findIndex((t) => t.id === overId);
                if (newIndex === -1) newIndex = targetTasks.length; // drop at end if not over a task

                // Remove from old list
                const remainingTasks = prevTasks.filter(
                    (t) => t.id !== activeTaskId
                );

                // Insert into new list at correct position
                const newTask = { ...activeTask, listId: overListId };
                const newTargetTasks = [
                    ...targetTasks.slice(0, newIndex),
                    newTask,
                    ...targetTasks.slice(newIndex),
                ];

                // Merge back
                const otherTasks = remainingTasks.filter(
                    (t) => t.listId !== overListId
                );

                updateTask({
                    taskSlug: activeTask.slug,
                    data: {
                        listId: overListId,
                    },
                    projectSlug: project.slug,
                });
                return [...otherTasks, ...newTargetTasks];
            });
        } else {
            // Reordering within the same list
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
        <Card className="p-6 bg-background dark:bg-background min-h-full">
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <CardContent className="flex p-2 space-x-6 overflow-x-auto min-h-full">
                    {lists.map((list) => {
                        const taskList = tasks.filter(
                            (task) => task.listId === list.id
                        );
                        return (
                            <SortableContext
                                key={list.id}
                                items={taskList.map((task) => task.id)}
                            >
                                <KanbanColumn
                                    list={list}
                                    tasks={taskList}
                                    projectSlug={project.slug}
                                />
                            </SortableContext>
                        );
                    })}
                    {permittedCreateList && <CreateColumn project={project} />}
                </CardContent>
                <DragOverlay>
                    {activeTask ? <KanbanTask task={activeTask} /> : null}
                </DragOverlay>
            </DndContext>
        </Card>
    );
}
