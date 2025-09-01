import React  from "react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    UpdateTeamMemberInput,
    updateTeamMemberSchema,
} from "@/lib/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTeamMemberActions } from "@/hooks/useTeamMembers";
import { toast } from "sonner";
import { useRoles } from "@/hooks/useRoles";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { FetchTeamMember } from "@/types/ServerResponses";
import useModalStore from "@/stores/modalStores";

interface InviteMemberProps {
    teamSlug: string;
    teamMember: FetchTeamMember;
}

const UpdateMember: React.FC<InviteMemberProps> = ({
    teamSlug,
    teamMember,
}) => {
    const { updateMemberId, setUpdateMemberId } = useModalStore();
    const { update } = useTeamMemberActions();
    const {
        roles,
        isLoading: rolesLoading,
        isError: rolesIsError,
    } = useRoles(teamSlug);

    const form = useForm<UpdateTeamMemberInput>({
        resolver: zodResolver(updateTeamMemberSchema),
        defaultValues: {
            roleId: teamMember.roleId,
        },
    });

    const onSubmit = async (data: UpdateTeamMemberInput) => {
        try {
            const response = await update({
                teamSlug,
                teamMemberUserId: teamMember.userId,
                data,
            });
            if (!response.success) {
                throw new Error(response.message);
            }
            form.reset();
            toast.success("Member has updated their role.");
        } catch (e) {
            if (e instanceof Error) {
                form.setError("root", { message: e.message });
                toast.error(e.message);
                return;
            }
            form.setError("root", {
                message:
                    "An error has occured while inviting a member. Please try again later or contact system administrator.",
            });
        }
    };

    return (
        <Dialog
            open={teamMember.userId == updateMemberId}
            onOpenChange={(open: boolean) =>
                setUpdateMemberId(open ? teamMember.userId : null)
            }
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} id={`update-member-${teamMember.userId}`}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>
                                Update Member Role for {teamMember.name}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-4">
                            {/* Role select */}
                            <FormField
                                control={form.control}
                                name="roleId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {rolesLoading ? (
                                                        <SelectItem
                                                            value="loading"
                                                            disabled
                                                        >
                                                            Loading...
                                                        </SelectItem>
                                                    ) : rolesIsError ? (
                                                        <SelectItem
                                                            value="error"
                                                            disabled
                                                        >
                                                            Failed to load roles
                                                        </SelectItem>
                                                    ) : (
                                                        roles?.map((r) => (
                                                            <SelectItem
                                                                value={r.id}
                                                                key={r.id}
                                                            >
                                                                {r.name}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Root error */}
                            {form.formState.errors.root && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.root.message}
                                </p>
                            )}
                        </div>

                        <DialogFooter className="mt-6">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                form={`update-member-${teamMember.userId}`}
                            >
                                {form.formState.isSubmitting
                                    ? "Updating"
                                    : "Update"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Form>
        </Dialog>
    );
};

export default UpdateMember;
