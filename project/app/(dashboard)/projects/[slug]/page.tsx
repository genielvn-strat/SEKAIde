"use client";
import { notFound } from "next/navigation";
import { useProjectDetails } from "@/hooks/useProjectDetails";
import { useLists } from "@/hooks/useLists";

interface ProjectProps {
    params: {
        slug: string;
    };
}

export default function ProjectDetails({ params }: ProjectProps) {
    const { slug } = params;

    const {
        data: project,
        isLoading,
        isError,
        error,
    } = useProjectDetails(slug);

    const { lists } = useLists(slug);

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
