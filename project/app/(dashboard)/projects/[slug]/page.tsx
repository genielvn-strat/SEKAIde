"use client";
import { notFound } from "next/navigation";
import { useProjectDetails } from "@/hooks/useProjectDetails";
import { useLists } from "@/hooks/useLists";
import { CreateListInput, listSchema } from "@/lib/validations";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

    const {
        data: project,
        isLoading,
        isError,
        error,
    } = useProjectDetails(slug);

    const { lists, createList } = useLists(slug);

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
        <div className="project">
            <h1 className="text-xl font-semibold">{project.name}</h1>
            <p className="text-sm text-muted-foreground">
                {project.description}
            </p>
            <pre className="mt-4 bg-muted p-4 rounded text-xs overflow-x-auto">
                {JSON.stringify(project, null, 2)}
            </pre>
            <h1 className="text-lg font-semibold mt-6">Lists</h1>
            <form onSubmit={listHandleSubmit(onListSubmit)}>
                <input
                    type="text"
                    placeholder="List name"
                    className="border px-2 py-1 rounded"
                    {...listRegiter("name")}
                />
                {listErrors.name && (
                    <p className="text-sm text-red-600">
                        {listErrors.name.message}
                    </p>
                )}

                <textarea
                    placeholder="Description (optional)"
                    className="border px-2 py-1 rounded"
                    {...listRegiter("description")}
                />
                {listErrors.description && (
                    <p className="text-sm text-red-600">
                        {listErrors.description.message}
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
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                    {listSubmitting ? "Creating..." : "Add List"}
                </button>
            </form>
            <pre className="mt-4 bg-muted p-4 rounded text-xs overflow-x-auto">
                {JSON.stringify(lists, null, 2)}
            </pre>
            <pre className="mt-4 bg-muted p-4 rounded text-xs overflow-x-auto">
                TODO: Add tasks here. Comments here as well. Make list dropdown
                first.
            </pre>
        </div>
    );
}
