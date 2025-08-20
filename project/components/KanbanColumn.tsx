import { FetchList, FetchTask } from "@/types/ServerResponses";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { KanbanTask } from "./KanbanTask";
import { Button } from "./ui/button";
import { useListActions } from "@/hooks/useLists";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateTaskInput, taskSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTaskActions } from "@/hooks/useTasks";

export function KanbanColumn({
    list,
    tasks,
    projectSlug,
}: {
    list: FetchList;
    tasks: FetchTask[];
    projectSlug: string;
}) {
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateTaskInput>({
        resolver: zodResolver(taskSchema),
    });
    const { setNodeRef } = useDroppable({
        id: list.id,
    });
    const { createTask } = useTaskActions();
    const { deleteList } = useListActions();

    const onSubmit: SubmitHandler<CreateTaskInput> = async (data) => {
        try {
            await createTask({ projectSlug, listId: list.id, data });
            reset();
        } catch {
            setError("root", { message: "Server error" });
        }
    };

    return (
        <div
            ref={setNodeRef}
            className="flex-shrink-0 w-80 p-4 rounded-lg border bg-gray-50 dark:bg-outer_space-400"
        >
            {/* Column Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {list.name}
                </h2>
                <Button
                    onClick={() => {
                        deleteList({
                            listId: list.id,
                            projectSlug: projectSlug,
                        });
                    }}
                >
                    Remove List
                </Button>
            </div>

            {/* Tasks */}
            <div className="flex flex-col gap-3 p-3 overflow-y-auto max-h-[70vh]">
                <SortableContext items={tasks.map((task) => task.id)}>
                    {tasks.map((task) => (
                        <KanbanTask key={task.id} task={task} />
                    ))}
                </SortableContext>

                {/* Empty state */}
                {tasks.length === 0 && (
                    <div className="text-center text-xs text-gray-500 dark:text-gray-400 py-6">
                        No tasks
                    </div>
                )}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 p-4 border rounded-md shadow-sm"
                >
                    {/* Title */}
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

                    {/* Description */}
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

                    {/* Priority */}
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

                    {/* Due Date */}
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

                    {/* The `listId` and `position` can be hidden inputs as they're likely determined programmatically */}
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
            </div>
        </div>
    );
}
