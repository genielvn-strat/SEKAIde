"use client";

import { useAuthRoleByTeam } from "@/hooks/useRoles";
import React from "react";
import InviteMember from "./buttons/InviteMember";
import { DataTable } from "./DataTable";
import { TeamMemberColumns } from "./columns/TeamMemberColumns";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { DataTableSkeleton } from "./DataTableSkeleton";
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
    if (!members) return <ErrorAlert />;
    const { permitted: permittedInvite } = useAuthRoleByTeam(
        teamSlug,
        "invite_members"
    );

    return (
        <div className="flex flex-col gap-4">
            {permittedInvite && (
                <div className="flex flex-row justify-between items-center">
                    <InviteMember teamSlug={teamSlug} />
                </div>
            )}

            <DataTable columns={TeamMemberColumns(teamSlug)} data={members} />
        </div>
    );
};

export default TeamMembersTab;
