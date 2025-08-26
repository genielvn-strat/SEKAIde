"use client";

import TeamInvitationCard from "@/components/TeamInvitationCard";
import { TypographyH1 } from "@/components/typography/TypographyH1";
import { TypographyH2 } from "@/components/typography/TypographyH2";
import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { Separator } from "@/components/ui/separator";
import { useInvitedTeams } from "@/hooks/useTeams";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageCircleQuestion } from "lucide-react";
import LoadingSkeletonCards from "@/components/LoadingSkeletonCards";

export default function NotificationsPage() {
    const {
        teams,
        isError: teamsIsError,
        isLoading: teamsIsLoading,
    } = useInvitedTeams();

    return (
        <>
            <div className="doc-header flex flex-row justify-between items-center">
                <div className="left">
                    <TypographyH1>Notifications</TypographyH1>
                    <TypographyMuted>
                        View your team invitations and assigned tasks
                    </TypographyMuted>
                </div>
                <div className="right"></div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4 w-full">
                <TypographyH2>Team Invitations</TypographyH2>
                <div className="space-y-4 w-full">
                    {teamsIsLoading ? (
                        <LoadingSkeletonCards />
                    ) : teamsIsError ? (
                        "=== ERROR ==="
                    ) : teams?.length == 0 ? (
                        <Alert variant="default">
                            <MessageCircleQuestion />
                            <AlertTitle>No team invitations</AlertTitle>
                            <AlertDescription>
                                You don't have any pending invitations right
                                now. When someone invites you to join their
                                team, you'll see it here.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        teams?.map((t) => (
                            <TeamInvitationCard team={t} key={t.teamMemberId} />
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
