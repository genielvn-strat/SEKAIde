"use client";
import { notFound } from "next/navigation";
import { useProjectDetails } from "@/hooks/useProjects";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoardInterface } from "@/components/kanban-board/KanbanBoardInterface";
import { use, useEffect } from "react";
import { TypographyH1 } from "@/components/typography/TypographyH1";
import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { Separator } from "@/components/ui/separator";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { DataTable } from "@/components/DataTable";
import { ProjectTasksColumn } from "@/components/columns/ProjectTasksColumns";
import { useProjectTasks } from "@/hooks/useTasks";
import CreateTask from "@/components/buttons/CreateTask";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProjectSettingsTab from "@/components/ProjectSettingsTab";
import { SlashIcon } from "lucide-react";
import Link from "next/link";
import ProjectOverview from "@/components/ProjectOverview";
import { TypographyH2 } from "@/components/typography/TypographyH2";
import AssignedTasks from "@/components/AssignedTasks";
import ErrorAlert from "@/components/ErrorAlert";
import { useAuthRoleByProject } from "@/hooks/useRoles";
import { pusherClient } from "@/lib/websocket/pusher";
import { useQueryClient } from "@tanstack/react-query";
import { useRecentStore } from "@/stores/recentStores";
interface ProjectProps {
    params: Promise<{
        projectSlug: string;
    }>;
}

export default function ProjectDetails({ params }: ProjectProps) {
    const { projectSlug } = use(params);
    const { setRecent } = useRecentStore();
    const queryClient = useQueryClient();

    const { project, isLoading, isError, error } =
        useProjectDetails(projectSlug);

    const { permitted: createTask } = useAuthRoleByProject(
        projectSlug,
        "create_task"
    );

    const {
        tasks,
        isLoading: taskLoading,
        isError: taskIsError,
        error: taskError,
    } = useProjectTasks(projectSlug, {
        enabled: !!project,
    });
    useEffect(() => {
        if (!project) return;
        setRecent({
            type: "project",
            title: project.name,
            link: `/projects/${projectSlug}`,
        });
    }, [project]);

    useEffect(() => {
        const channelName = `project-${projectSlug}`;
        const channel = pusherClient.subscribe(channelName);
        channel.bind("tasks-updated", () => {
            queryClient.invalidateQueries({
                queryKey: ["tasks", projectSlug],
            });
        });
        channel.bind("lists-updated", () => {
            queryClient.invalidateQueries({
                queryKey: ["lists", projectSlug],
            });
        });
        return () => {
            channel.unbind("tasks-updated");
            pusherClient.unsubscribe(channelName);
        };
    }, []);

    if (isLoading || taskLoading) {
        return <LoadingSkeleton />;
    }

    if (!project) {
        return notFound();
    }

    if (isError || taskError || !tasks) {
        return <ErrorAlert message={error?.message} />;
    }

    return (
        <>
            <div className="doc-header flex flex-row justify-between items-center">
                <div className="left">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/projects">Projects</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <SlashIcon />
                            </BreadcrumbSeparator>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="flex flex-row items-center gap-4">
                        <TypographyH1>{project.name}</TypographyH1>
                        <TypographyMuted>// {project.teamName}</TypographyMuted>
                    </div>
                    <TypographyMuted>{project.description}</TypographyMuted>
                </div>
                <div className="right"></div>
            </div>
            <Separator className="my-4" />
            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="board">Board</TabsTrigger>
                    <TabsTrigger value="tasks">Task List</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="flex flex-col gap-4">
                    <ProjectOverview tasks={tasks} />
                    <AssignedTasks tasks={tasks} />
                </TabsContent>
                <TabsContent value="board">
                    <KanbanBoardInterface
                        project={project}
                        tasks={tasks}
                        permittedCreateTask={createTask}
                    />
                </TabsContent>
                <TabsContent value="tasks">
                    <div className="flex flex-col gap-4">
                        {createTask && (
                            <div className="flex flex-row justify-between items-center">
                                <CreateTask projectSlug={projectSlug} />
                            </div>
                        )}
                        <DataTable
                            columns={ProjectTasksColumn(projectSlug)}
                            data={tasks}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="settings">
                    <ProjectSettingsTab project={project} />
                </TabsContent>
            </Tabs>
        </>
    );
}
