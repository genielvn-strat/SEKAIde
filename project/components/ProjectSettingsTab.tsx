"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuthRoleByProject } from "@/hooks/useRoles";
import { FetchProject } from "@/types/ServerResponses";
import { TypographyH2 } from "./typography/TypographyH2";
import UpdateTeam from "./UpdateTeam";
import DeleteTeam from "./buttons/DeleteTeam";
import LeaveTeam from "./buttons/LeaveTeam";
import LoadingSkeletonCards from "./LoadingSkeletonCards";
import UpdateProject from "./UpdateProject";

interface ProjectSettingsTabProps {
    project: FetchProject;
}

const ProjectSettingsTab: React.FC<ProjectSettingsTabProps> = ({ project }) => {
    const { permitted: permittedUpdate, isLoading: updateLoading } =
        useAuthRoleByProject(project.slug, "update_project");
    const { permitted: permittedDelete, isLoading: deleteLoading } =
        useAuthRoleByProject(project.slug, "delete_project");

    if (updateLoading || deleteLoading) return <LoadingSkeletonCards />;

    return (
        <div className="space-y-8">
            {permittedUpdate && <UpdateProject project={project} />}

            {permittedDelete && 
            <Card className="w-full max-w-xl border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">
                        <TypographyH2>Danger Zone</TypographyH2>
                    </CardTitle>
                    <CardDescription>
                        Actions that can permanently affect your team.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-col items-start gap-4">
                </CardFooter>
            </Card>
            }
        </div>
    );
};

export default ProjectSettingsTab;
