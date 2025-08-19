"use client";

import { useAuthRoleByTeam } from "@/hooks/useRoles";
import React from "react";
import InviteMember from "./buttons/InviteMember";
import { DataTable } from "./DataTable";
import { TeamMemberColumns } from "./columns/TeamMemberColumns";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { DataTableSkeleton } from "./DataTableSkeleton";

interface TeamMembersTabProps {
    teamSlug: string;
}

const TeamMembersTab: React.FC<TeamMembersTabProps> = ({ teamSlug }) => {
    const { members, isLoading, isError } = useTeamMembers(teamSlug);
    const { permitted: permittedInvite } = useAuthRoleByTeam(
        teamSlug,
        "invite_members"
    );
    if (isLoading) return <DataTableSkeleton />;
    if (!members || isError)
        return "An error has occurred while loading members";
    return (
        <>
            {permittedInvite && (
                <div className="flex flex-row justify-between items-center">
                    <InviteMember teamSlug={teamSlug} />
                </div>
            )}

            <DataTable columns={TeamMemberColumns(teamSlug)} data={members} />
        </>
    );
};

export default TeamMembersTab;
