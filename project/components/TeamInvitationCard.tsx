import { FetchInvitedTeams } from "@/types/ServerResponses";
import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { TypographyP } from "./typography/TypographyP";

interface TeamInvitationCardProps {
    team: FetchInvitedTeams;
}

const TeamInvitationCard: React.FC<TeamInvitationCardProps> = ({ team }) => {
    const handleAccept = async () => {
        console.log("TODO: accept", team.teamId);
    };

    const handleReject = async () => {
        console.log("TODO: reject", team.teamId);
    };

    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <span className="font-semibold">{team.teamName}</span> has
                    invited you as{" "}
                    <span className="font-semibold">{team.roleName}</span>.
                </div>
                <div className="flex gap-2">
                    <Button variant="default" onClick={handleAccept}>
                        Accept
                    </Button>
                    <Button variant="destructive" onClick={handleReject}>
                        Decline
                    </Button>
                </div>
            </CardHeader>
        </Card>
    );
};

export default TeamInvitationCard;
