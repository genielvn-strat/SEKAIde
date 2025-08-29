import { FetchInvitedTeams } from "@/types/ServerResponses";
import React from "react";
import { Card, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { useTeamMemberActions } from "@/hooks/useTeamMembers";
import { toast } from "sonner";

interface TeamInvitationCardProps {
    team: FetchInvitedTeams;
}

const TeamInvitationCard: React.FC<TeamInvitationCardProps> = ({ team }) => {
    const { accept, acceptLoading, reject, rejectLoading } =
        useTeamMemberActions();

    const handleAccept = async () => {
        try {
            const response = await accept({
                teamMemberId: team.teamMemberId,
            });
            if (!response.success) {
                throw new Error(response.message);
            }
            toast.success("Team invitation accepted successfully.");
        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);
                return;
            }
        }
    };

    const handleReject = async () => {
        try {
            const response = await reject({
                teamMemberId: team.teamMemberId,
            });
            if (!response.success) {
                throw new Error(response.message);
            }
            toast.success("Team invitation rejected.");
        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);
                return;
            }
        }
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
                    <Button
                        variant="default"
                        onClick={handleAccept}
                        disabled={acceptLoading || rejectLoading}
                    >
                        Accept
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={acceptLoading || rejectLoading}
                    >
                        Decline
                    </Button>
                </div>
            </CardHeader>
        </Card>
    );
};

export default TeamInvitationCard;
