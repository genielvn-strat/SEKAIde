"use client";
import React, { Dispatch, SetStateAction } from "react";
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
import { FetchList, FetchTask } from "@/types/ServerResponses";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthRoleByProject } from "@/hooks/useRoles";
import { useTeamMembersByProject } from "@/hooks/useTeamMembers";
import { TypographyMuted } from "../typography/TypographyMuted";
import { TypographyP } from "../typography/TypographyP";
import { useLists } from "@/hooks/useLists";

interface EditTaskProps {
    task: FetchTask;
    projectSlug: string;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const EditTask: React.FC<EditTaskProps> = ({ task, projectSlug, setOpen }) => {
    const { updateTask } = useTaskActions();
    const { permitted: permittedAssign } = useAuthRoleByProject(
        projectSlug,
        "assign_others"
    );
    const { lists } = useLists(projectSlug);

    const { members } = useTeamMembersByProject(projectSlug, {
        enabled: !!permittedAssign,
    });

    const form = useForm<CreateTaskInput>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: task.title,
            description: task.description ?? undefined,
            assigneeId: task.assigneeId,
            priority: task.priority,
            listId: task.listId ?? undefined,
            finished: task.finished,
            position: task.position,
        },
    });

    const onSubmit: SubmitHandler<CreateTaskInput> = async (data) => {
        try {
            const response = await updateTask({
                taskSlug: task.slug,
                projectSlug,
                data,
            });
            if (!response.success) {
                throw new Error(response.message);
            }
            toast.success("Task has been updated successfully.");
        } catch (e) {
            if (e instanceof Error) {
                form.setError("root", { message: e.message });
                toast.error(e.message);
                return;
            }
            form.setError("root", {
                message:
                    "An error has occurred while editing your task. Please try again later or contact the system administrator.",
            });
        }
    };

    return (
        <Dialog
            open
            onOpenChange={() => {
                setOpen(false);
            }}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    id={`edit-task-${task.id}`}
                >
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Edit Task</DialogTitle>
                            <DialogDescription>
                                Change information for {task.title}
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

                        <FormField
                            control={form.control}
                            name="listId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>List</FormLabel>
                                    <FormControl>
                                        <Select
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select list" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {lists?.map((list) => (
                                                    <SelectItem
                                                        key={list.id}
                                                        value={list.id}
                                                        className={`flex flex-row items-center gap-4 text-rainbow-${list.color}`}
                                                    >
                                                        {list.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
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
                                form={`edit-task-${task.id}`}
                            >
                                {form.formState.isSubmitting
                                    ? "Editing..."
                                    : "Edit Task"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Form>
        </Dialog>
    );
};

export default EditTask;
