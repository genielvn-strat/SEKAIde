"use client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateTaskInput, taskSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTaskActions } from "@/hooks/useTasks";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, CirclePlus } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { FetchList } from "@/types/ServerResponses";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthRoleByProject } from "@/hooks/useRoles";
import { useTeamMembersByProject } from "@/hooks/useTeamMembers";
import { TypographyMuted } from "../typography/TypographyMuted";
import { TypographyP } from "../typography/TypographyP";

interface CreateTaskProps {
    projectSlug: string;
    list: FetchList;
}

const CreateTask: React.FC<CreateTaskProps> = ({ projectSlug, list }) => {
    const { createTask } = useTaskActions();
    const { permitted: permittedAssign } = useAuthRoleByProject(
        projectSlug,
        "assign_others"
    );

    const { members } = useTeamMembersByProject(projectSlug, {
        enabled: !!permittedAssign,
    });

    const form = useForm<CreateTaskInput>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: "",
            description: "",
            priority: "medium",
            listId: list.id,
            finished: list.isFinal,
            position: 0,
            assigneeId: undefined,
        },
    });

    const onSubmit: SubmitHandler<CreateTaskInput> = async (data) => {
        try {
            console.log(data);
            const response = await createTask({
                projectSlug,
                listId: list.id,
                data,
            });
            if (!response.success) {
                throw new Error(response.message);
            }
            toast.success("Task has been created successfully.");
            form.reset();
        } catch (e) {
            if (e instanceof Error) {
                form.setError("root", { message: e.message });
                toast.error(e.message);
                return;
            }
            form.setError("root", {
                message:
                    "An error has occurred while creating your task. Please try again later or contact the system administrator.",
            });
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" type="button">
                    <CirclePlus />
                    Add Task
                </Button>
            </DialogTrigger>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    id={`create-task-${list.id}`}
                >
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Create Task</DialogTitle>
                            <DialogDescription>
                                Add a task to {list.name} list.
                            </DialogDescription>
                        </DialogHeader>

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Task Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Implement authentication"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Add more details about this task..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Priority</FormLabel>
                                    <FormControl>
                                        <Select
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">
                                                    Low
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                    Medium
                                                </SelectItem>
                                                <SelectItem value="high">
                                                    High
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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

                        {permittedAssign ? (
                            <FormField
                                control={form.control}
                                name="assigneeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assignee</FormLabel>
                                        <FormControl>
                                            <Select
                                                defaultValue={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger
                                                    disabled={!permittedAssign}
                                                >
                                                    <SelectValue placeholder="Select assignee" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {members?.map((member) => (
                                                        <SelectItem
                                                            key={member.userId}
                                                            value={
                                                                member.userId
                                                            }
                                                            className="flex flex-row items-center gap-4"
                                                        >
                                                            <TypographyP>
                                                                {member.name}
                                                            </TypographyP>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <TypographyMuted>
                                You can only assign this task to yourself.
                            </TypographyMuted>
                        )}

                        <FormField
                            control={form.control}
                            name="finished"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormControl>
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                id="finished"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <FormLabel htmlFor="finished">
                                                Mark as finished
                                            </FormLabel>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Root errors */}
                        {form.formState.errors.root && (
                            <p className="text-sm text-red-500 mt-2">
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
                                form={`create-task-${list.id}`}
                            >
                                {form.formState.isSubmitting
                                    ? "Creating..."
                                    : "Create Task"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Form>
        </Dialog>
    );
};

export default CreateTask;
