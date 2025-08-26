"use client";

import { useTeamDetails } from "@/hooks/useTeams";
import { notFound } from "next/navigation";
import { use } from "react";
import { TypographyH1 } from "@/components/typography/TypographyH1";
import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import TeamMembersTab from "@/components/TeamMembersTab";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import TeamProjectsTab from "@/components/TeamProjectsTab";
import TeamSettingsTab from "@/components/TeamSettingsTab";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { SlashIcon } from "lucide-react";
import { useTeamProjects } from "@/hooks/useProjects";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useTeamTasks } from "@/hooks/useTasks";
import TeamOverviewTab from "@/components/TeamOverviewTab";
import LoadingSkeletonCards from "@/components/LoadingSkeletonCards";
import ErrorAlert from "@/components/ErrorAlert";

interface ProjectProps {
    params: Promise<{
        teamSlug: string;
    }>;
}

export default function TeamDetails({ params }: ProjectProps) {
    const { teamSlug } = use(params);
    const {
        teamDetails,
        isLoading: teamsLoading,
        isError: teamsIsError,
        error: teamsError,
    } = useTeamDetails(teamSlug);
    const {
        projects,
        isLoading: projectsIsLoading,
        isError: projectsIsError,
        error: projectsError,
    } = useTeamProjects(teamSlug, {
        enabled: !!teamDetails,
    });
    const {
        members,
        isLoading: membersIsLoading,
        isError: membersIsError,
        error: membersError,
    } = useTeamMembers(teamSlug, {
        enabled: !!teamDetails,
    });
    const {
        tasks,
        isLoading: tasksIsLoading,
        isError: tasksIsError,
        error: tasksError,
    } = useTeamTasks(teamSlug, { enabled: !!teamDetails });

    if (teamsLoading) {
        return <LoadingSkeleton />;
    }

    if (teamsIsError) {
        return <ErrorAlert message={teamsError?.message} />;
    }

    if (!teamDetails) {
        return notFound();
    }

    return (
        <div className="overflow-x-hidden">
            <div className="doc-header flex flex-row justify-between items-center">
                <div className="left">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/teams">Teams</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <SlashIcon />
                            </BreadcrumbSeparator>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <TypographyH1>{teamDetails.name}</TypographyH1>
                    <TypographyMuted>{teamDetails.slug}</TypographyMuted>
                </div>
                <div className="right"></div>
            </div>
            <Separator className="my-4" />
            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="members">Members</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    {projectsIsLoading || tasksIsLoading || membersIsLoading ? (
                        <LoadingSkeletonCards />
                    ) : projectsIsError || tasksIsError || membersIsError ? (
                        <ErrorAlert
                            message={
                                projectsError?.message ||
                                tasksError?.message ||
                                membersError?.message
                            }
                        />
                    ) : (
                        <TeamOverviewTab
                            projects={projects}
                            tasks={tasks}
                            members={members}
                            teamSlug={teamSlug}
                        />
                    )}
                </TabsContent>
                <TabsContent value="members">
                    {membersIsLoading ? (
                        <LoadingSkeletonCards />
                    ) : membersIsError ? (
                        <ErrorAlert message={membersError?.message} />
                    ) : (
                        <TeamMembersTab members={members} teamSlug={teamSlug} />
                    )}
                </TabsContent>
                <TabsContent value="projects">
                    {projectsIsLoading ? (
                        <LoadingSkeletonCards />
                    ) : projectsIsError ? (
                        <ErrorAlert message={projectsError?.message} />
                    ) : (
                        <TeamProjectsTab
                            projects={projects}
                            teamDetails={teamDetails}
                        />
                    )}
                </TabsContent>
                <TabsContent value="settings">
                    <TeamSettingsTab teamDetails={teamDetails} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
