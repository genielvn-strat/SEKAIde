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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CirclePlus, EllipsisVertical } from "lucide-react";
import CreateTask from "./buttons/CreateTask";
import { useListActions } from "@/hooks/useLists";
import { toast } from "sonner";

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

    const { moveList } = useListActions();

    const onMoveList = async (direction: "left" | "right") => {
        try {
            const response = await moveList({
                listId: list.id,
                projectSlug,
                direction,
            });
            if (!response.success) {
                throw new Error(response.message);
            }
            toast.success(`List moved to the ${direction}.`);
        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);
                return;
            }
        }
    };

    return (
        <Card
            ref={setNodeRef}
            className="flex flex-col flex-shrink-0 w-80 min-h-full"
        >
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="left">
                    <CardTitle>{list.name}</CardTitle>
                    <CardDescription>{list.description}</CardDescription>
                </div>
                <div className="right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost">
                                <EllipsisVertical />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                    onMoveList("left");
                                }}
                            >
                                Move Left
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    onMoveList("right");
                                }}
                            >
                                Move Right
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
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
