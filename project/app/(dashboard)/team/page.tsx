"use client";

import { CreateTeamInput, teamSchema } from "@/lib/validations";
import { UserPlus, Mail, MoreHorizontal } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTeams } from "@/hooks/useTeams";

export default function TeamPage() {
    const {
        register,
        handleSubmit,
        setError,
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
        isCreating,
    } = useTeams();

    const onSubmit: SubmitHandler<CreateTeamInput> = async (data) => {
        try {
            createTeam(data);
        } catch (e) {
            if (e instanceof Error) {
                setError("root", { message: e.message });
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    📋 Team Management Implementation Tasks
                </h3>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>
                        • Task 6.1: Implement task assignment and user
                        collaboration features
                    </li>
                    <li>
                        • Task 6.4: Implement project member management and
                        permissions
                    </li>
                </ul>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("name")} type="text" />
                {errors.root && <p>{errors.root.message}</p>}
                <button>submit</button>
            </form>

            <h2>Owned Teams</h2>
            <ul>
                {ownedTeams.map((team) => (
                    <div>
                        <li
                            key={team.id}
                            onClick={() => {
                                deleteTeam(team);
                            }}
                        >
                            {team.name}
                        </li>
                        <button>chugnus</button>
                    </div>
                ))}
            </ul>
            <h2>Joined Teams</h2>
            <ul>
                {joinedTeams.map((team) => (
                    <li key={team.teamId}>{team.teamName}</li>
                ))}
            </ul>

            <p>clickable teams</p>
        </div>
    );
}
