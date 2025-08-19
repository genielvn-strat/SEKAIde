"use client";
import React from "react";
import { CreateTeamInput, teamSchema } from "@/lib/validations";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
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
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTeamActions } from "@/hooks/useTeams";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CreateTeam: React.FC = () => {
    const router = useRouter();

    const { createTeam } = useTeamActions();
    const form = useForm<CreateTeamInput>({
        resolver: zodResolver(teamSchema),
    });
    const onSubmit: SubmitHandler<CreateTeamInput> = async (data) => {
        try {
            const response = await createTeam(data);
            if (!response.success) {
                throw new Error(response.message);
            }
            form.reset();
            toast.success("Team has been created successfully.");
            router.push(`/teams/${response.data?.slug}`);
        } catch (e) {
            if (e instanceof Error) {
                form.setError("root", { message: e.message });
                toast.error(e.message);
                return;
            }
            form.setError("root", {
                message:
                    "An error has occured while creating your team. Please try again later or contact system administrator.",
            });
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex flex-row items-center" type="button">
                    <CirclePlus />
                    Create Team
                </Button>
            </DialogTrigger>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} id="create-team">
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create Team</DialogTitle>
                            <DialogDescription>
                                Set your team name and start collaborating with
                                members.
                            </DialogDescription>
                        </DialogHeader>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Team Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Web Development Team"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                {form.formState.errors.root && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {form.formState.errors.root.message}
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
                                disabled={form.formState.isSubmitting}
                                form="create-team"
                            >
                                {form.formState.isSubmitting
                                    ? "Creating"
                                    : "Create"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Form>
        </Dialog>
    );
};

export default CreateTeam;
