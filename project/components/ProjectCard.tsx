import React from "react";
import { TypographyP } from "@/components/typography/TypographyP";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FolderClock, FolderOpen, LayoutList, Users } from "lucide-react";
import Link from "next/link";
import { FetchProject } from "@/types/ServerResponses";
import { Progress } from "./ui/progress";

interface ProjectCardProps {
    project: FetchProject;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    return (
        <Card className="w-full max-w-sm" key={project.id}>
            <CardHeader>
                <Link href={`/projects/${project.slug}`}>
                    <CardTitle className="text-2xl truncate">
                        {project.name}
                    </CardTitle>
                    <CardDescription className="truncate">
                        {project.description ?? "No description"}
                    </CardDescription>
                </Link>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div>
                    {project.teamName && (
                        <div className="flex flex-row items-center gap-4">
                            <Users />
                            <TypographyP>{project.teamName}</TypographyP>
                        </div>
                    )}
                    <div className="flex flex-row items-center gap-4">
                        <FolderClock />
                        <TypographyP>
                            {!project.dueDate
                                ? "No due date"
                                : `Due ${new Date(
                                      project.dueDate
                                  ).toLocaleDateString()}`}
                        </TypographyP>
                    </div>
                    <div className="flex flex-row items-center gap-4">
                        <LayoutList />
                        <TypographyP>
                            {project.totalTaskCount == 0
                                ? "No tasks"
                                : `${project.finishedTaskCount} out of ${
                                      project.totalTaskCount
                                  } ${
                                      project.totalTaskCount == 1
                                          ? "task"
                                          : "tasks"
                                  } completed`}
                        </TypographyP>
                    </div>
                </div>
            </CardContent>
            {project.totalTaskCount !== undefined &&
                project.finishedTaskCount !== undefined && (
                    <CardFooter>
                        <Progress
                            value={
                                (project.finishedTaskCount /
                                    project.totalTaskCount) *
                                100
                            }
                        />
                    </CardFooter>
                )}
        </Card>
    );
};

export default ProjectCard;
