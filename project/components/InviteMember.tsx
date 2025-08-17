import React from "react";
import { Button } from "./ui/button";
import { UserPlus } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CreateTeamMemberInput, teamMemberSchema } from "@/lib/validations";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTeamMemberActions } from "@/hooks/useTeamMembers";
import { toast } from "sonner";

interface InviteMemberProps {
    teamSlug: string;
}

const InviteMember: React.FC<InviteMemberProps> = ({ teamSlug }) => {
    const { invite } = useTeamMemberActions();

    const {
        register,
        handleSubmit,
        setError,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CreateTeamMemberInput>({
        resolver: zodResolver(teamMemberSchema),
    });

    const onSubmit: SubmitHandler<CreateTeamMemberInput> = async (data) => {
        try {
            const response = await invite({ teamSlug: teamSlug, data: data });
            if (!response.success) {
                throw new Error(response.message);
            }
            reset();
            toast.success("Member has been invited successfully.");
        } catch (e) {
            if (e instanceof Error) {
                setError("root", { message: e.message });
                toast.error(e.message);
                return;
            }
            setError("root", {
                message:
                    "An error has occured while inviting a member. Please try again later or contact system administrator.",
            });
        }
    };

    return (
        <Dialog>
            <form onSubmit={handleSubmit(onSubmit)} id="invite-member">
                <DialogTrigger asChild>
                    <Button>
                        <UserPlus /> Invite Members
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Invite Members</DialogTitle>
                        <DialogDescription>
                            Invite new members to your team by entering their
                            email address or their username.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="input">Email or Username</Label>
                                <Input
                                    {...register("input")}
                                    placeholder="johndoe@example.com | johndoe"
                                />
                                {errors.input && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.input.message}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="roleId">Role</Label>
                                <Controller
                                    name="roleId"
                                    control={control}
                                    rules={{ required: "Role is required" }}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger id="role">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>
                                                        Roles
                                                    </SelectLabel>
                                                    <SelectItem value="admin">
                                                        Admin
                                                    </SelectItem>
                                                    <SelectItem value="project_manager">
                                                        Project Manager
                                                    </SelectItem>
                                                    <SelectItem value="member">
                                                        Member
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.roleId && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.roleId.message}
                                    </p>
                                )}
                            </div>
                            {errors.root && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.root.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            form="invite-member"
                        >
                            {isSubmitting ? "Inviting" : "Invite"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
};

export default InviteMember;
