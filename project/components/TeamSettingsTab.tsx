"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuthRoleByTeam } from "@/hooks/useRoles";
import { FetchTeamDetails } from "@/types/ServerResponses";
import { TypographyH2 } from "./typography/TypographyH2";
import UpdateTeam from "./UpdateTeam";
import DeleteTeam from "./buttons/DeleteTeam";
import LeaveTeam from "./buttons/LeaveTeam";
import LoadingSkeletonCards from "./LoadingSkeletonCards";

interface TeamSettingsTabProps {
    teamDetails: FetchTeamDetails;
}

const TeamSettingsTab: React.FC<TeamSettingsTabProps> = ({ teamDetails }) => {
    const { permitted: permittedUpdate, isLoading: updateLoading } =
        useAuthRoleByTeam(teamDetails.slug, "update_team");
    const { permitted: permittedDelete, isLoading: deleteLoading } =
        useAuthRoleByTeam(teamDetails.slug, "delete_team");

    if (updateLoading || deleteLoading) return <LoadingSkeletonCards />;

    if (!permittedUpdate && !permittedDelete) {
        return (
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <TypographyH2>Leave Team</TypographyH2>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        Leaving this team will remove your access to its
                        projects and members. You can rejoin only if you are
                        invited again.
                    </CardContent>
                    <CardFooter>
                        <LeaveTeam teamDetails={teamDetails} />
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {permittedUpdate && <UpdateTeam teamDetails={teamDetails} />}

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
                    <LeaveTeam teamDetails={teamDetails} />
                    {permittedDelete && (
                        <DeleteTeam teamDetails={teamDetails} />
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default TeamSettingsTab;
