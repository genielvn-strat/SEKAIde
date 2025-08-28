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
import { useTaskActions, useProjectTasks } from "@/hooks/useTasks";
import { useLists } from "@/hooks/useLists";
import LoadingSkeletonCards from "./LoadingSkeletonCards";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthRoleByProject } from "@/hooks/useRoles";
import CreateList from "./buttons/CreateList";
import { ArrangeTask, UpdateTask } from "@/types/Task";
import { arrangeTask } from "@/actions/taskActions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import ErrorAlert from "./ErrorAlert";

interface KanbanBoardProps {
    project: FetchProject;
    tasks: FetchTask[];
}

export function KanbanBoardInterface({
    project,
    tasks: initialTasks,
}: KanbanBoardProps) {
    const queryClient = useQueryClient();
    const {
        lists,
        isLoading: listLoading,
        isError: listIsError,
        error: listError,
    } = useLists(project.slug, {
        enabled: !!project,
    });

    const { updateTask, arrangeTask } = useTaskActions();
    const { permitted: permittedCreateList } = useAuthRoleByProject(
        project.slug,
        "create_list"
    );
    const [tasks, setTasks] = useState<FetchTask[]>([]);
    const [activeTask, setActiveTask] = useState<FetchTask | null>(null);
    const [overId, setOverId] = useState<string | null>(null);

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
    if (listLoading) return <LoadingSkeletonCards />;
    if (!lists || listIsError)
        return <ErrorAlert message={listError?.message} />;

    const handleArrange = async (
        updatedTasks: FetchTask[],
        selectedTaskId: string
    ) => {
        console.log("=== Current Task State by List ===");
        const arranged =
            lists?.flatMap((list) =>
                updatedTasks
                    .filter((t) => t.listId === list.id)
                    .map((t, idx) => ({
                        title: t.title,
                        position: idx,
                        id: t.id,
                        listId: t.listId ?? null,
                    }))
            ) ?? [];
        try {
            const response = await arrangeTask({
                tasks: arranged,
                selectedTaskId: selectedTaskId,
                projectSlug: project.slug,
            });
            if (!response.success) throw new Error(response.message);
            toast.success("Task arranged successfully");
        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);
            }
        } finally {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        }
    };

    const handleDragStart = (event: any) => {
        const { active } = event;
        const task = tasks.find((t) => t.id === active.id);
        setActiveTask(task || null);
    };

    const handleDragOver = (event: any) => {
        const { over } = event;
        setOverId(over?.id || null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
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

                const updated = [...otherTasks, ...newTargetTasks];
                updateTask({
                    taskSlug: activeTask.slug,
                    data: {
                        listId: overListId,
                    },
                    projectSlug: project.slug,
                });
                handleArrange(updated, activeTask.id);
                return updated;
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
                const updated = [...otherTasks, ...newTasksInList];
                handleArrange(updated, activeTask.id);
                return updated;
            });
        }

        setActiveTask(null);
        setOverId(null);
    };
    return (
        <Card className="p-3 bg-background dark:bg-background h-[60vh] md:h-[70vh]">
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <CardContent className="flex p-2 space-x-6 overflow-x-auto h-full">
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
                                    activeId={activeTask?.id ?? null}
                                    overId={overId}
                                    projectSlug={project.slug}
                                />
                            </SortableContext>
                        );
                    })}
                    {permittedCreateList && <CreateList project={project} />}
                </CardContent>
                <DragOverlay>
                    {activeTask ? (
                        <KanbanTask task={activeTask} activeId={null} />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </Card>
    );
}
