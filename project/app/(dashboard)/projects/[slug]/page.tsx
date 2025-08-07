"use client";
import { notFound } from "next/navigation";
import { useProjectDetails } from "@/hooks/useProjectDetails";
import { useLists } from "@/hooks/useLists";
import { CreateListInput, listSchema } from "@/lib/validations";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TaskList from "@/components/TaskList";

interface ProjectProps {
    params: {
        slug: string;
    };
}

export default function ProjectDetails({ params }: ProjectProps) {
    const { slug } = params;
    const {
        register: listRegiter,
        handleSubmit: listHandleSubmit,
        setError: setListError,
        reset: listReset,
        formState: { errors: listErrors, isSubmitting: listSubmitting },
    } = useForm<CreateListInput>({
        resolver: zodResolver(listSchema),
    });

    const { project, isLoading, isError, error } = useProjectDetails(slug);

    const { lists, createList, updateList, deleteList } = useLists(slug);

    if (isLoading) {
        return <div className="loading">Loading project...</div>;
    }

    if (isError) {
        console.error("Error loading project:", error);
        return (
            <div className="error">
                Error loading project. Please try again later.
            </div>
        );
    }

    if (!project) {
        return notFound();
    }

    const onListSubmit: SubmitHandler<CreateListInput> = async (data) => {
        try {
            await createList({ projectSlug: slug, data });
            listReset();
        } catch {
            setListError("root", { message: "Server error" });
        }
    };

    return (
        <div className="project max-w-3xl mx-auto">
            <h1 className="text-xl font-semibold">{project.name}</h1>
            <p className="text-sm text-muted-foreground">
                {project.description}
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-2">Create List</h2>
            <form
                onSubmit={listHandleSubmit(onListSubmit)}
                className="space-y-2 mb-6"
            >
                <input
                    type="text"
                    placeholder="List name"
                    className="w-full border px-3 py-2 rounded"
                    {...listRegiter("name")}
                />
                {listErrors.name && (
                    <p className="text-sm text-red-600">
                        {listErrors.name.message}
                    </p>
                )}

                <textarea
                    placeholder="Description (optional)"
                    className="w-full border px-3 py-2 rounded"
                    {...listRegiter("description")}
                />
                {listErrors.description && (
                    <p className="text-sm text-red-600">
                        {listErrors.description.message}
                    </p>
                )}

                <input
                    type="number"
                    placeholder="Position"
                    className="border px-2 py-1 rounded"
                    {...listRegiter("position", { valueAsNumber: true })}
                />
                {listErrors.position && (
                    <p className="text-sm text-red-600">
                        {listErrors.position.message}
                    </p>
                )}

                {listErrors.root && (
                    <p className="text-sm text-red-600">
                        {listErrors.root.message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={listSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {listSubmitting ? "Creating..." : "Add List"}
                </button>
            </form>

            <h2 className="text-lg font-semibold mb-2">Lists</h2>
            <div className="space-y-4">
                {lists?.map((list) => (
                    <div
                        key={list.id}
                        className="border rounded p-4 shadow-sm bg-white"
                    >
                        <h3 className="text-md font-semibold">{list.name}</h3>
                        {list.description && (
                            <p className="text-sm text-gray-600 mt-1">
                                {list.description}
                            </p>
                        )}

                        {/* Edit List Form */}
                        <form
                            className="mt-4 space-y-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(
                                    e.currentTarget as HTMLFormElement
                                );
                                const name = formData.get("name") as string;
                                const description = formData.get(
                                    "description"
                                ) as string;
                                const position = Number(
                                    formData.get("position")
                                );

                                updateList({
                                    projectSlug: slug,
                                    listId: list.id,
                                    data: {
                                        name,
                                        description,
                                        position,
                                    },
                                });
                            }}
                        >
                            <h4 className="text-sm font-medium">Edit List</h4>
                            <input
                                type="text"
                                name="name"
                                placeholder="New name"
                                defaultValue={list.name}
                                className="w-full border px-2 py-1 rounded"
                            />
                            <textarea
                                name="description"
                                placeholder="New description"
                                defaultValue={list.description ?? ""}
                                className="w-full border px-2 py-1 rounded"
                            />
                            <input
                                name="position"
                                type="number"
                                placeholder="Position"
                                defaultValue={list.position}
                                className="w-full border px-2 py-1 rounded"
                            />
                            <button
                                type="submit"
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                            >
                                Save
                            </button>
                        </form>
                        <button
                            onClick={() => {
                                deleteList({
                                    listId: list.id,
                                    projectSlug: slug,
                                });
                            }}
                            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                            Delete List
                        </button>
                        {/* Add Task Form */}

                        {/* Task List */}
                        <TaskList listId={list.id} projectSlug={slug} />
                    </div>
                ))}
            </div>
        </div>
    );
}
