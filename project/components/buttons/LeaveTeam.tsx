import { FetchTeamDetails } from "@/types/ServerResponses";
import React from "react";
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
import { Button } from "@/components/ui/button";
import { useTeamMemberActions } from "@/hooks/useTeamMembers";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LeaveTeamProps {
    teamDetails: FetchTeamDetails;
}

const LeaveTeam: React.FC<LeaveTeamProps> = ({ teamDetails }) => {
    const { leave } = useTeamMemberActions();
    const router = useRouter();

    const handleLeave = async () => {
        try {
            const result = await leave({teamSlug: teamDetails.slug});
            if (!result.success) throw new Error(result.message);
            toast.success("Team left successfully.");
            router.push(`/teams/`);
        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);
                return;
            }
        }
    };
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>Leave Team</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Leave team?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You will be removed from{" "}
                        <span className="font-semibold">
                            {teamDetails.name}
                        </span>
                        . You can only rejoin if invited again.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLeave}>
                        Leave
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default LeaveTeam;
