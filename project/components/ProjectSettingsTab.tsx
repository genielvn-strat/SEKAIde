"use client";
import React from "react";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuthRoleByProject } from "@/hooks/useRoles";
import { FetchProject } from "@/types/ServerResponses";
import { TypographyH2 } from "./typography/TypographyH2";
import LoadingSkeletonCards from "./LoadingSkeletonCards";
import UpdateProject from "./UpdateProject";
import DeleteProject from "./buttons/DeleteProject";
import ResetProject from "./buttons/ResetProject";

interface ProjectSettingsTabProps {
    project: FetchProject;
}

const ProjectSettingsTab: React.FC<ProjectSettingsTabProps> = ({ project }) => {
    const { permitted: permittedUpdate, isLoading: updateLoading } =
        useAuthRoleByProject(project.slug, "update_project");
    const { permitted: permittedDelete, isLoading: deleteLoading } =
        useAuthRoleByProject(project.slug, "delete_project");
    const { permitted: permittedReset } = useAuthRoleByProject(
        project.slug,
        "reset_project"
    );

    if (updateLoading || deleteLoading) return <LoadingSkeletonCards />;

    return (
        <div className="space-y-8">
            {permittedUpdate && <UpdateProject project={project} />}

            {permittedDelete && (
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
                        {permittedReset && (
                            <ResetProject projectDetails={project} />
                        )}
                        {permittedDelete && (
                            <DeleteProject projectDetails={project} />
                        )}
                    </CardFooter>
                </Card>
            )}
        </div>
    );
};

export default ProjectSettingsTab;
