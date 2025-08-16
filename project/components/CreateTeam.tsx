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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTeamActions } from "@/hooks/useTeams";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CreateTeam: React.FC = () => {
    const router = useRouter();

    const { createTeam } = useTeamActions();
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateTeamInput>({
        resolver: zodResolver(teamSchema),
    });
    const onSubmit: SubmitHandler<CreateTeamInput> = async (data) => {
        try {
            const response = await createTeam(data);
            if (!response.success) {
                throw new Error(response.message);
            }
            reset();
            toast.success("Team has been created successfully.");
            router.push(`/teams/${response.data?.slug}`);
        } catch (e) {
            if (e instanceof Error) {
                setError("root", { message: e.message });
                toast.error(e.message);
                return;
            }
            setError("root", {
                message:
                    "An error has occured while creating your team. Please try again later or contact system administrator.",
            });
        }
    };

    return (
        <Dialog>
            <form onSubmit={handleSubmit(onSubmit)} id="create-team">
                <DialogTrigger asChild>
                    <Button
                        className="flex flex-row items-center"
                        type="button"
                    >
                        <CirclePlus />
                        Create Team
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Team</DialogTitle>
                        <DialogDescription>
                            Set your team name and start collaborating with
                            members.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Team Name</Label>
                            <Input
                                {...register("name")}
                                placeholder="Web Development Team"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.name.message}
                                </p>
                            )}
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
                            form="create-team"
                        >
                            {isSubmitting ? "Creating" : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
};

export default CreateTeam;
