"use client";
import React from "react";
import { CreateProjectInput, projectSchema } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CirclePlus } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProjectActions } from "@/hooks/useProjects";
import { Textarea } from "@/components/ui/textarea";
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
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTeamWithCreateProject } from "@/hooks/useTeams";

const CreateProject: React.FC = () => {
    const router = useRouter();
    const {
        teams,
        isLoading: teamsLoading,
        isError: teamsError,
    } = useTeamWithCreateProject();

    const { createProject } = useProjectActions();
    const form = useForm<CreateProjectInput>({
        resolver: zodResolver(projectSchema),
    });
    console.log(teams, teamsError);

    const onSubmit = async (data: CreateProjectInput) => {
        try {
            const payload = {
                ...data,
            };
            const response = await createProject(payload);
            if (!response.success) {
                throw new Error(response.message);
            }
            form.reset();
            toast.success("Project has been created successfully.");
            router.push(`/projects/${response.data?.slug}`);
        } catch (e) {
            if (e instanceof Error) {
                form.setError("root", { message: e.message });
                toast.error(e.message);
                return;
            }
            form.setError("root", {
                message:
                    "An error has occured while creating your project. Please try again later or contact system administrator.",
            });
        }
    };

    return teams?.length == 0 ? (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="flex flex-row items-center" type="button">
                    <CirclePlus />
                    Create Project
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>No Teams Available</AlertDialogTitle>
                    <AlertDialogDescription>
                        You don't have any teams you own or manage as
                        a Project Manager. Would you like to create a new team?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => router.push("/teams/")}>
                        Create Team
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    ) : (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex flex-row items-center" type="button">
                    <CirclePlus />
                    Create Project
                </Button>
            </DialogTrigger>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    id="create-project"
                    className="space-y-4"
                >
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create Project</DialogTitle>
                            <DialogDescription>
                                Set your project name, description, and due
                                date.
                            </DialogDescription>
                        </DialogHeader>

                        {/* Project Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Hello World Project"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Project Description (textarea only, no duplicate input) */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Project Description (optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="A project that displays Hello World to everyone."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Due Date */}
                        <FormField
                            control={form.control}
                            name="dueDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Due date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value &&
                                                            "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(
                                                            field.value,
                                                            "PPP"
                                                        )
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date() ||
                                                    date <
                                                        new Date("1900-01-01")
                                                }
                                                captionLayout="dropdown"
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Team */}
                        <FormField
                            control={form.control}
                            name="teamId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Team</FormLabel>
                                    <Select onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a team" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {teamsLoading ? (
                                                <SelectItem
                                                    value="loading"
                                                    disabled
                                                >
                                                    Loading...
                                                </SelectItem>
                                            ) : teamsError ? (
                                                <SelectItem
                                                    value="error"
                                                    disabled
                                                >
                                                    {teamsError ??
                                                        "Failed to load teams"}
                                                </SelectItem>
                                            ) : teams?.length === 0 ? (
                                                <SelectItem
                                                    value="none"
                                                    disabled
                                                >
                                                    No teams available
                                                </SelectItem>
                                            ) : (
                                                teams?.map((team) => (
                                                    <SelectItem
                                                        value={team.id}
                                                        key={team.id}
                                                    >
                                                        {team.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
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

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                form="create-project"
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

export default CreateProject;
