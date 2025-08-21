"use client";
import { notFound } from "next/navigation";
import { useProjectDetails } from "@/hooks/useProjects";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoardInterface } from "@/components/KanbanBoardInterface";
import { use } from "react";
import { TypographyH1 } from "@/components/typography/TypographyH1";
import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { Separator } from "@/components/ui/separator";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { DataTable } from "@/components/DataTable";
import { ProjectTasksColumn } from "@/components/columns/ProjectTasksColumns";
import { useTasks } from "@/hooks/useTasks";

interface ProjectProps {
    params: Promise<{
        projectSlug: string;
    }>;
}

export default function ProjectDetails({ params }: ProjectProps) {
    const { projectSlug } = use(params);

    const { project, isLoading, isError, error } =
        useProjectDetails(projectSlug);

    const { tasks, isLoading: taskLoading } = useTasks(projectSlug, {
        enabled: !!project,
    });

    if (isLoading || taskLoading) {
        return <LoadingSkeleton />;
    }

    if (!project) {
        return notFound();
    }

    if (isError || !tasks) {
        console.error("Error loading project:", error);
        return (
            <div className="error">
                Error loading project. Please try again later.
            </div>
        );
    }

    return (
        <>
            <div className="doc-header flex flex-row justify-between items-center">
                <div className="left">
                    <div className="flex flex-row items-center gap-4">
                        <TypographyH1>{project.name}</TypographyH1>
                        <TypographyMuted>// {project.teamName}</TypographyMuted>
                    </div>
                    <TypographyMuted>{project.description}</TypographyMuted>
                </div>
                <div className="right"></div>
            </div>
            <Separator className="my-4" />
            <Tabs defaultValue="board">
                <TabsList>
                    <TabsTrigger value="board">Board</TabsTrigger>
                    <TabsTrigger value="tasks">Task List</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="board" className="py-4">
                    <KanbanBoardInterface project={project} tasks={tasks} />
                </TabsContent>
                <TabsContent value="tasks" className="py-4">
                    <div className="flex flex-col gap-4">
                        <DataTable
                            columns={ProjectTasksColumn(projectSlug)}
                            data={tasks}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
}
