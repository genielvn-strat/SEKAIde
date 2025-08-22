"use client";

import { useTaskActions, useTasksList } from "@/hooks/useTasks";
import { CreateTaskInput, taskSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface TaskListProps {
    projectSlug: string;
    listId: string;
}

const TaskList: React.FC<TaskListProps> = ({ projectSlug, listId }) => {
    const { tasks, isLoading, error } = useTasksList(projectSlug, listId);

    const { createTask, updateTask, deleteTask } = useTaskActions();
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<CreateTaskInput>({
        resolver: zodResolver(taskSchema),
    });

    const onSubmit: SubmitHandler<CreateTaskInput> = async (data) => {
        try {
            await createTask({ projectSlug, data });
            reset();
        } catch (err) {
            setError("root", { message: "Failed to create task" });
        }
    };

    return (
        <div>
            <form className="mt-4 space-y-2" onSubmit={handleSubmit(onSubmit)}>
                <h4 className="text-sm font-medium">Add Task</h4>

                <div>
                    <input
                        {...register("title")}
                        type="text"
                        placeholder="Task name"
                        className="w-full border px-2 py-1 rounded"
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.title.message}
                        </p>
                    )}
                </div>

                <div>
                    <textarea
                        {...register("description")}
                        placeholder="Task description"
                        className="w-full border px-2 py-1 rounded"
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                <div>
                    <select
                        {...register("priority")}
                        className="w-full border px-2 py-1 rounded"
                    >
                        <option value="">Select priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    {errors.priority && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.priority.message}
                        </p>
                    )}
                </div>

                <div>
                    <input
                        {...register("position", { valueAsNumber: true })}
                        type="number"
                        placeholder="Position"
                        className="w-full border px-2 py-1 rounded"
                    />
                    {errors.position && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.position.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                    Add Task
                </button>

                {errors.root && (
                    <p className="text-red-600 mt-2">{errors.root.message}</p>
                )}
            </form>

            <h2 className="text-lg font-semibold mt-6 mb-4">Tasks</h2>

            {isLoading ? (
                <p className="text-gray-600">Loading tasks...</p>
            ) : error ? (
                <p className="text-red-600">Failed to load tasks.</p>
            ) : tasks?.length === 0 ? (
                <p className="text-gray-500">No tasks available.</p>
            ) : (
                <ul className="space-y-4">
                    {tasks?.map((task) => (
                        <li
                            key={task.id}
                            className="border rounded-lg p-4 bg-white shadow-sm"
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="text-md font-semibold">
                                    {task.title}
                                </h3>
                                <span className="text-xs text-gray-500">
                                    #{task.position}
                                </span>
                            </div>

                            {task.slug && (
                                <p className="text-sm text-gray-700 mt-1">
                                    {task.slug}
                                </p>
                            )}
                            {task.description && (
                                <p className="text-sm text-gray-700 mt-1">
                                    {task.description}
                                </p>
                            )}

                            <p className="text-sm text-gray-500 mt-2">
                                Priority:{" "}
                                <span className="capitalize">
                                    {task.priority}
                                </span>
                            </p>

                            {task.dueDate && (
                                <p className="text-sm text-gray-500">
                                    Due:{" "}
                                    {new Date(
                                        task.dueDate
                                    ).toLocaleDateString()}
                                </p>
                            )}

                            {task.assigneeName && (
                                <p className="text-sm text-gray-500">
                                    Assigned to: {task.assigneeName}
                                </p>
                            )}

                            <p className="text-sm text-gray-400 mt-1 italic">
                                Project: {task.projectName} ({task.projectSlug})
                            </p>

                            {/* Update Task Form */}
                            <form
                                className="mt-4 space-y-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const form = e.currentTarget;
                                    const formData = new FormData(form);
                                    const title = formData.get(
                                        "title"
                                    ) as string;
                                    const description = formData.get(
                                        "description"
                                    ) as string;
                                    const priority = formData.get(
                                        "priority"
                                    ) as "low" | "medium" | "high" | undefined;
                                    const position = Number(
                                        formData.get("position")
                                    );

                                    updateTask({
                                        projectSlug: task.projectSlug,
                                        taskSlug: task.slug,
                                        data: {
                                            title,
                                            description,
                                            priority,
                                            position,
                                        },
                                    });

                                    form.reset();
                                }}
                            >
                                <h4 className="text-sm font-medium">
                                    Edit Task
                                </h4>
                                <input
                                    name="title"
                                    type="text"
                                    defaultValue={task.title}
                                    placeholder="New title"
                                    className="w-full border px-2 py-1 rounded"
                                />
                                <textarea
                                    name="description"
                                    defaultValue={task.description ?? ""}
                                    placeholder="New description"
                                    className="w-full border px-2 py-1 rounded"
                                />
                                <select
                                    name="priority"
                                    defaultValue={task.priority ?? ""}
                                    className="w-full border px-2 py-1 rounded"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                                <input
                                    name="position"
                                    type="number"
                                    defaultValue={task.position}
                                    className="w-full border px-2 py-1 rounded"
                                />
                                <button
                                    type="submit"
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                                >
                                    Save
                                </button>
                            </form>

                            {/* Delete Button */}
                            <button
                                onClick={() =>
                                    deleteTask({
                                        projectSlug: task.projectSlug,
                                        taskSlug: task.slug,
                                    })
                                }
                                className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                            >
                                Delete Task
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TaskList;
