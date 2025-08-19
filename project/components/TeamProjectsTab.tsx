"use client";
import { useTeamProjects } from "@/hooks/useProjects";
import React from "react";
import LoadingSkeletonCards from "./LoadingSkeletonCards";
import ProjectCard from "./ProjectCard";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { MessageCircleQuestion } from "lucide-react";
import { useAuthRoleByTeam } from "@/hooks/useRoles";
import CreateTeamProject from "./CreateTeamProject";
import { FetchTeamDetails } from "@/types/ServerResponses";

interface TeamProjectsTabProps {
    teamDetails: FetchTeamDetails;
}

const TeamProjectsTab: React.FC<TeamProjectsTabProps> = ({
    teamDetails: teamDetails,
}) => {
    const { projects, isLoading, error, isError } =
        useTeamProjects(teamDetails.slug);
    const { permitted: permittedCreate } = useAuthRoleByTeam(
        teamDetails.slug,
        "create_project"
    );

    if (isLoading) return <LoadingSkeletonCards />;

    if (!projects || isError) return "An error has occurred";

    return (
        <>
            {permittedCreate && (
                <div className="flex flex-row justify-between items-center">
                    <CreateTeamProject teamDetails={teamDetails} />
                </div>
            )}
            <div className="flex flex-wrap gap-4">
                {projects?.length == 0 ? (
                    <Alert variant="default">
                        <MessageCircleQuestion />
                        <AlertTitle>No projects found</AlertTitle>
                        <AlertDescription>
                            There are no projects available right now. Please
                            wait for one to be assigned, or create a new project
                            if you're a Project Manager.
                        </AlertDescription>
                    </Alert>
                ) : (
                    projects?.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                )}
            </div>
        </>
    );
};

export default TeamProjectsTab;
