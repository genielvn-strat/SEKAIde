"use client";

import { useTeamDetails } from "@/hooks/useTeams";
import { useTeamMemberActions, useTeamMembers } from "@/hooks/useTeamMembers";
import { useTeamProjects } from "@/hooks/useProjects";
import { notFound } from "next/navigation";
import { use } from "react";
import { TypographyH1 } from "@/components/typography/TypographyH1";
import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/DataTable";
import { columns } from "@/app/(dashboard)/teams/[teamSlug]/columns";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import InviteMember from "@/components/InviteMember";
import KickMember from "@/components/KickMember";

interface ProjectProps {
    params: Promise<{
        teamSlug: string;
    }>;
}

export default function TeamDetails({ params }: ProjectProps) {
    const { teamSlug } = use(params);

    const { teamDetails, isLoading, isError, error } = useTeamDetails(teamSlug);
    const { members, isLoading: memberLoading } = useTeamMembers(teamSlug, {
        enabled: !!teamDetails,
    });
    const { kick } = useTeamMemberActions();
    const { projects } = useTeamProjects(teamSlug, { enabled: !!teamDetails });

    if (isLoading || memberLoading) {
        return "Loading team";
    }

    if (isError) {
        console.error("Error loading project:", error);
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                Error loading team. Please try again later.
            </div>
        );
    }

    if (!teamDetails || !members) {
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
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-between items-center">
                            <InviteMember teamSlug={teamSlug} />
                        </div>
                        <DataTable columns={columns(teamSlug)} data={members} />
                    </div>
                </TabsContent>
            </Tabs>
        </>
    );
}
