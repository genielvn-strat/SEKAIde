"use client";
import { useTeamProjects } from "@/hooks/useProjects";
import React, { useState, useMemo } from "react";
import LoadingSkeletonCards from "./LoadingSkeletonCards";
import ProjectCard from "./ProjectCard";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { MessageCircleQuestion, ListFilter } from "lucide-react";
import { useAuthRoleByTeam } from "@/hooks/useRoles";
import CreateTeamProject from "./buttons/CreateTeamProject";
import { FetchProject, FetchTeamDetails } from "@/types/ServerResponses";
import { Input } from "./ui/input";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

interface TeamProjectsTabProps {
    projects: FetchProject[];
    teamDetails: FetchTeamDetails;
}

const TeamProjectsTab: React.FC<TeamProjectsTabProps> = ({
    projects,
    teamDetails: teamDetails,
}) => {
    const { permitted: permittedCreate } = useAuthRoleByTeam(
        teamDetails.slug,
        "create_project"
    );

    const [searchQuery, setSearchQuery] = useState("");
    const [sortCriteria, setSortCriteria] = useState("createdAt");

    const filteredAndSortedProjects = useMemo(() => {
        return projects
            ?.map((project) => {
                const completionRate =
                    project.totalTaskCount && project.totalTaskCount > 0
                        ? (project.finishedTaskCount ?? 0) /
                          project.totalTaskCount
                        : 0;
                return { ...project, completionRate };
            })
            .filter((project) =>
                project.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
                if (sortCriteria === "name") {
                    return a.name.localeCompare(b.name);
                }
                if (sortCriteria === "completionRate") {
                    return b.completionRate - a.completionRate;
                }
                return (
                    new Date(b.createdAt!).getTime() -
                    new Date(a.createdAt!).getTime()
                );
            });
    }, [projects, searchQuery, sortCriteria]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center">
                {permittedCreate && (
                    <CreateTeamProject teamDetails={teamDetails} />
                )}
            </div>

            <div className="flex flex-row gap-4 items-center">
                <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <ListFilter className="mr-2 h-4 w-4" /> Sort
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                            value={sortCriteria}
                            onValueChange={setSortCriteria}
                        >
                            <DropdownMenuRadioItem value="createdAt">
                                Creation date
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="name">
                                Name
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="completionRate">
                                Completion Rate
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex flex-wrap gap-4">
                {filteredAndSortedProjects?.length === 0 ? (
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
                    filteredAndSortedProjects?.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            small={true}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default TeamProjectsTab;
