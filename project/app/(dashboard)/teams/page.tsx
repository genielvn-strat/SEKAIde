"use client";

import {
    CreateTeamInput,
    teamSchema,
    UpdateTeamInput,
} from "@/lib/validations";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTeams } from "@/hooks/useTeams";
import Link from "next/link";

export default function TeamPage() {
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateTeamInput>({
        resolver: zodResolver(teamSchema),
    });

    const {
        ownedTeams,
        joinedTeams,
        isLoading,
        createTeam,
        deleteTeam,
        updateTeam,
        isCreating,
    } = useTeams();

    const onSubmit: SubmitHandler<CreateTeamInput> = async (data) => {
        try {
            const response = await createTeam(data);
            if (!response.success) {
                throw new Error(response.message);
            }
            reset();
        } catch (e) {
            if (e instanceof Error) {
                setError("root", { message: e.message });
            }
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto py-8">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    📋 Team Management Implementation Tasks
                </h3>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
                    <li>
                        Task 6.1: Implement task assignment and collaboration
                    </li>
                    <li>
                        Task 6.4: Implement project member management and
                        permissions
                    </li>
                </ul>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Team Name
                    </label>
                    <input
                        {...register("name")}
                        type="text"
                        className="w-full border rounded p-2"
                        placeholder="Enter team name"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.name.message}
                        </p>
                    )}
                    {errors.root && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.root.message}
                        </p>
                    )}
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={isCreating || isSubmitting}
                >
                    {isCreating || isSubmitting ? "Creating..." : "Create Team"}
                </button>
            </form>

            <div>
                <h2 className="text-lg font-semibold mt-6">🤝 Joined Teams</h2>
                <div className="space-y-2 mt-2">
                    {joinedTeams.map((team) => (
                        <Link
                            href={`/teams/${team.slug}`}
                            key={team.id}
                            className="bg-gray-100 p-2 rounded text-sm"
                        >
                            <pre>{JSON.stringify(team, null, 2)}</pre>
                            <div className="mt-2 flex gap-2">
                                <button
                                    onClick={() => deleteTeam(team.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => {
                                        const newName = prompt("New Name");
                                        if (!newName) return;

                                        updateTeam({
                                            teamId: team.id,
                                            data: { name: newName },
                                        });
                                    }}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
