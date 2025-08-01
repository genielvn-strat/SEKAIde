"use client";

import { useTeamDetails } from "@/hooks/useTeamDetails";
import { notFound } from "next/navigation";

interface ProjectProps {
    params: {
        slug: string;
    };
}

export default function TeamDetails({ params }: ProjectProps) {
    const { slug } = params;

    const { data: team, isLoading, isError, error } = useTeamDetails(slug);

    if (isLoading) {
        return <div className="loading">Loading team...</div>;
    }

    if (isError) {
        console.error("Error loading project:", error);
        return (
            <div className="error">
                Error loading project. Please try again later.
            </div>
        );
    }

    if (!team) {
        return notFound();
    }

    return (
        <div className="project">
            <h1 className="text-xl font-semibold">{team.name}</h1>
            <pre className="mt-4 bg-muted p-4 rounded text-xs overflow-x-auto">
                {JSON.stringify(team, null, 2)}
            </pre>
            <pre className="mt-4 bg-muted p-4 rounded text-xs overflow-x-auto">
                TODO: List users and projects. Projects clicked will lead to the
                projects itself. Can change user's role here.
            </pre>
        </div>
    );
}
