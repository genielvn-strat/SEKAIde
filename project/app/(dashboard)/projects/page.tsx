"use client";

import { useProjectActions, useProjects } from "@/hooks/useProjects";
import { useTeams } from "@/hooks/useTeams";
import { CreateProjectInput, projectSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function ProjectsPage() {
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateProjectInput>({
        resolver: zodResolver(projectSchema),
    });
    const { ownedTeams } = useTeams();
    const { projects } = useProjects();

    const { createProject, deleteProject, updateProject, isCreating } =
        useProjectActions();

    const onSubmit: SubmitHandler<CreateProjectInput> = async (data) => {
        try {
            const response = await createProject(data);
            if (!response.success) throw new Error(response.message);
            reset();
        } catch (e) {
            if (e instanceof Error) {
                setError("root", { message: e.message });
            }
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto p-4">
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label
                        htmlFor="team-select"
                        className="block font-medium mb-2"
                    >
                        Select a Team
                    </label>
                    <label className="block text-sm font-medium mb-1">
                        Project Name
                    </label>
                    <input
                        {...register("name")}
                        type="text"
                        className="w-full border rounded p-2"
                        placeholder="Enter Project name"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.name.message}
                        </p>
                    )}
                    <label className="block text-sm font-medium mb-1">
                        Project Description
                    </label>
                    <textarea
                        {...register("description")}
                        className="w-full border rounded p-2"
                        placeholder="Enter Project Description"
                    />
                    {errors.description && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.description.message}
                        </p>
                    )}
                    <select
                        {...register("teamId")}
                        id="team-select"
                        className="w-full border p-2 rounded"
                    >
                        <option value="" disabled>
                            -- Select Team --
                        </option>
                        {ownedTeams?.length ? (
                            ownedTeams.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.teamName}
                                </option>
                            ))
                        ) : (
                            <option disabled>No owned teams found</option>
                        )}
                    </select>
                    {errors.teamId && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.teamId.message}
                        </p>
                    )}
                    {errors.root && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.root.message}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={isCreating}
                        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        Create Test Project
                    </button>
                </form>
            </div>

            <div>
                <h2 className="font-bold text-lg mb-2">Projects</h2>
                {projects?.length ? (
                    <ul className="space-y-2">
                        {projects.map((project) => (
                            <Link href={`/projects/${project.slug}`}>
                                <li
                                    key={project.id}
                                    className="bg-gray-100 p-2 rounded text-sm"
                                >
                                    <pre>
                                        {JSON.stringify(project, null, 2)}
                                    </pre>
                                    <button
                                        onClick={() => {
                                            deleteProject({
                                                slug: project.slug,
                                            });
                                        }}
                                        className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => {
                                            const newName = prompt("New Name");
                                            if (!newName) return;

                                            updateProject({
                                                projectSlug: project.slug,
                                                data: { name: newName },
                                            });
                                        }}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                </li>
                            </Link>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No projects found.</p>
                )}
            </div>
        </div>
    );
}
