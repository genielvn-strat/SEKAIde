import React from "react";
import { Button } from "../ui/button";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CreateTeamMemberInput, teamMemberSchema } from "@/lib/validations";
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

interface InviteMemberProps {
    teamSlug: string;
}

const InviteMember: React.FC<InviteMemberProps> = ({ teamSlug }) => {
    const { invite } = useTeamMemberActions();
    const {
        roles,
        isLoading: rolesLoading,
        isError: rolesIsError,
    } = useRoles(teamSlug);

    const form = useForm<CreateTeamMemberInput>({
        resolver: zodResolver(teamMemberSchema),
        defaultValues: {
            input: "",
            roleId: "",
        },
    });

    const onSubmit = async (data: CreateTeamMemberInput) => {
        try {
            const response = await invite({ teamSlug, data });
            if (!response.success) {
                throw new Error(response.message);
            }
            form.reset();
            toast.success("Member has been invited successfully.");
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
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <UserPlus /> Invite Members
                </Button>
            </DialogTrigger>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} id="invite-member">
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Invite Members</DialogTitle>
                            <DialogDescription>
                                Invite new members to your team by entering
                                their email address or their username.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4">
                            {/* Input field */}
                            <FormField
                                control={form.control}
                                name="input"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email or Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="johndoe@example.com | johndoe"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                <p className="text-sm text-red-500 mt-1">
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
                                form="invite-member"
                            >
                                {form.formState.isSubmitting
                                    ? "Inviting"
                                    : "Invite"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Form>
        </Dialog>
    );
};

export default InviteMember;
