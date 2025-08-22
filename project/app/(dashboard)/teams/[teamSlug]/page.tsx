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

interface ProjectProps {
    params: Promise<{
        teamSlug: string;
    }>;
}

export default function TeamDetails({ params }: ProjectProps) {
    const { teamSlug } = use(params);

    const { teamDetails, isLoading, isError, error } = useTeamDetails(teamSlug);

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (isError) {
        console.error("Error loading project:", error);
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                Error loading team. Please try again later.
            </div>
        );
    }

    if (!teamDetails) {
        return notFound();
    }

    return (
        <>
            <div className="doc-header flex flex-row justify-between items-center">
                <div className="left">
                    <TypographyH1>{teamDetails.name}</TypographyH1>
                    <TypographyMuted>{teamDetails.slug}</TypographyMuted>
                </div>
                <div className="right"></div>
            </div>
            <Separator className="my-4" />
            <Tabs defaultValue="members">
                <TabsList>
                    <TabsTrigger value="members">Members</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="members">
                    <TeamMembersTab teamSlug={teamSlug} />
                </TabsContent>
                <TabsContent value="projects">
                    <TeamProjectsTab teamDetails={teamDetails} />
                </TabsContent>
                <TabsContent value="settings">
                    <TeamSettingsTab teamDetails={teamDetails} />
                </TabsContent>
            </Tabs>
        </>
    );
}
