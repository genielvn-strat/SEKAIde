import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import KickMember from "@/components/modals/KickMember";
import UpdateMember from "../modals/UpdateMember";
import useModalStore from "@/stores/modalStores";
import React from "react";
import { FetchTeamMember } from "@/types/ServerResponses";

interface TeamMemberDropDownProps {
    teamMember: FetchTeamMember;
    teamSlug: string;
}

const TeamMemberDropDown: React.FC<TeamMemberDropDownProps> = ({
    teamMember,
    teamSlug,
}) => {
    const { setUpdateMemberId, setKickMemberId } = useModalStore();

    const permittedKick = teamMember.allowKick;
    const permittedUpdate = teamMember.allowUpdate;
    const memberId = teamMember.userId;
    const memberName = teamMember.name;
    return (
        (permittedKick || permittedUpdate) && (
            <>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {permittedUpdate && (
                            <DropdownMenuItem
                                onClick={() => setUpdateMemberId(memberId)}
                            >
                                Update
                            </DropdownMenuItem>
                        )}
                        {permittedKick && (
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setKickMemberId(memberId)}
                            >
                                Kick
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                <KickMember
                    teamSlug={teamSlug}
                    memberUserId={memberId}
                    memberName={memberName}
                />

                <UpdateMember teamMember={teamMember} teamSlug={teamSlug} />
            </>
        )
    );
};

export default TeamMemberDropDown;
