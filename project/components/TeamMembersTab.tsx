"use client";

import { useAuthRoleByTeam } from "@/hooks/useRoles";
import React from "react";
import InviteMember from "./buttons/InviteMember";
import { DataTable } from "./DataTable";
import { TeamMemberColumns } from "./columns/TeamMemberColumns";
import { FetchTeamMember } from "@/types/ServerResponses";
import ErrorAlert from "./ErrorAlert";

interface TeamMembersTabProps {
    members?: FetchTeamMember[] | null;
    teamSlug: string;
}

const TeamMembersTab: React.FC<TeamMembersTabProps> = ({
    members,
    teamSlug,
}) => {
    const { permitted: permittedInvite } = useAuthRoleByTeam(
        teamSlug,
        "invite_members"
    );
    if (!members) return <ErrorAlert />;

    return (
        <div className="flex flex-col gap-4">
            <DataTable
                columns={TeamMemberColumns(teamSlug)}
                data={members}
                children={
                    permittedInvite && (
                        <div className="flex flex-row justify-between items-center">
                            <InviteMember teamSlug={teamSlug} />
                        </div>
                    )
                }
            />
        </div>
    );
};

export default TeamMembersTab;
