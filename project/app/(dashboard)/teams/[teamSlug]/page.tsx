"use client";

import { useTeamDetails } from "@/hooks/useTeams";
import { useTeamMemberActions, useTeamMembers } from "@/hooks/useTeamMembers";
import { useTeamProjects } from "@/hooks/useProjects";
import { notFound } from "next/navigation";
import { use } from "react";

interface ProjectProps {
    params: Promise<{
        teamSlug: string;
    }>;
}

export default function TeamDetails({ params }: ProjectProps) {
    const { teamSlug } = use(params);

    const { teamDetails, isLoading, isError, error } = useTeamDetails(teamSlug);
    const { members } = useTeamMembers(teamSlug, {
        enabled: !!teamDetails,
    });
    const { kick } = useTeamMemberActions();
    const { projects } = useTeamProjects(teamSlug, { enabled: !!teamDetails });

    if (isLoading) {
        return "Loading team";
    }

    if (isError) {
        console.error("Error loading project:", error);
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                Error loading team. Please try again later.
            </div>
        );
    }

    if (!teamDetails) {
        return notFound();
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    {teamDetails.name}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Slug: {teamDetails.slug}
                </p>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Members
                </h2>
                {members?.length ? (
                    <ul className="divide-y divide-gray-200">
                        {members.map((member) => (
                            <li
                                key={member.userId}
                                className="flex items-center justify-between py-3"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {member.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {member.username}
                                    </p>
                                </div>
                                <div>
                                    <span
                                        className={`px-3 py-1 text-sm rounded-full ${
                                            member.role === "admin"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        {member.role}
                                    </span>
                                    <span
                                        className={`px-3 py-1 text-sm rounded-full ${
                                            member.inviteConfirmed
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        {member.inviteConfirmed
                                            ? "Invited"
                                            : "Not invited"}
                                    </span>
                                    <button
                                        onClick={() =>
                                            kick({
                                                teamSlug: teamSlug,
                                                targetUserId: member.userId,
                                            })
                                        }
                                        className="mt-2 text-center px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                                    >
                                        Kick
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No members found.</p>
                )}
            </div>
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Projects
                </h2>
                {projects?.length ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="border rounded-lg p-4 hover:shadow transition"
                            >
                                <h3 className="font-semibold text-gray-800">
                                    {project.name}
                                </h3>
                                {project.description && (
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                                        {project.description}
                                    </p>
                                )}
                                {project.dueDate && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        Due:{" "}
                                        {new Date(
                                            project.dueDate
                                        ).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No projects found.</p>
                )}
            </div>
        </div>
    );
}

/* <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
</div>; */
