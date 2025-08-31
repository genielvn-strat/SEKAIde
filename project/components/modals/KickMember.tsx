import { useTeamMemberActions } from "@/hooks/useTeamMembers";
import React, { Dispatch, SetStateAction } from "react";
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
import { toast } from "sonner";
import { Button } from "../ui/button";
import useModalStore from "@/stores/modalStores";

interface KickMemberProps {
    teamSlug: string;
    memberUserId: string;
    memberName: string;
}

const KickMember: React.FC<KickMemberProps> = ({
    teamSlug,
    memberUserId,
    memberName,
}) => {
    const { kickMemberId, setKickMemberId} = useModalStore();
    const { kick } = useTeamMemberActions();

    const handleKick = async () => {
        try {
            const result = await kick({ teamSlug, targetUserId: memberUserId });
            if (!result.success) {
                throw new Error(result.message);
            }
            toast.success(`${memberName} has been kicked from the team.`);
        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);
                return;
            }
        } finally {
            setKickMemberId(null)
        }
    };

    return (
        <AlertDialog
            open={memberUserId == kickMemberId}
            onOpenChange={(open: boolean) => setKickMemberId(open ? memberUserId : null)}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Kick {memberName}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to kick {memberName} from this
                        team? Any tasks currently assigned to them will be
                        unassigned.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button variant="destructive" onClick={handleKick}>
                        Kick
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default KickMember;
