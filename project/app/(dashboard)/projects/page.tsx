"use client";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useProjects } from "@/hooks/useProjects";
import { TypographyH1 } from "@/components/typography/TypographyH1";
import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { Separator } from "@/components/ui/separator";
import CreateProject from "@/components/buttons/CreateProject";
import ProjectCard from "@/components/ProjectCard";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ListFilter, MessageCircleQuestion } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ProjectsPage() {
    const { projects, isLoading, isError } = useProjects();

    const [searchQuery, setSearchQuery] = useState("");
    const [sortCriteria, setSortCriteria] = useState("updatedAt");

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
                if (sortCriteria === "createdAt") {
                    return (
                        new Date(b.createdAt!).getTime() -
                        new Date(a.createdAt!).getTime()
                    );
                }
                return (
                    new Date(b.updatedAt!).getTime() -
                    new Date(a.updatedAt!).getTime()
                );
            });
    }, [projects, searchQuery, sortCriteria]);

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (!projects || isError) {
        return "=== ERROR ===";
    }

    return (
        <>
            <div className="doc-header flex flex-row justify-between items-center">
                <div className="left">
                    <TypographyH1>Projects</TypographyH1>
                    <TypographyMuted>
                        See projects across your joined teams
                    </TypographyMuted>
                </div>
                <div className="right">
                    <CreateProject />
                </div>
            </div>
            <Separator className="my-4" />

            {/* Search + Sort Controls */}
            <div className="flex flex-row gap-4 mb-4 items-center">
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
                            <DropdownMenuRadioItem value="updatedAt">
                                Recently Updated
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="completionRate">
                                Completion Rate
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="name">
                                Name
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="createdAt">
                                Creation date
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Projects List */}
            <div className="flex flex-wrap gap-4">
                {filteredAndSortedProjects?.length !== 0 ? (
                    filteredAndSortedProjects?.map((project) => (
                        <ProjectCard key={project.id} project={project} small />
                    ))
                ) : (
                    <Alert variant="default">
                        <MessageCircleQuestion />
                        <AlertTitle>No projects found</AlertTitle>
                        <AlertDescription>
                            There are no projects available right now. Please
                            wait for one to be assigned, or create a new project
                            if you're a Project Manager.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </>
    );
}
