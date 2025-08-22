import { FetchProject } from "@/types/ServerResponses";
import React from "react";
import { useTeamActions } from "@/hooks/useTeams";
import {
    UpdateProjectInput,
    updateProjectSchema,
    UpdateTeamInput,
    updateTeamSchema,
} from "@/lib/validations";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, CirclePlus } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { TypographyH2 } from "./typography/TypographyH2";
import { Input } from "@/components/ui/input";
import { useProjectActions } from "@/hooks/useProjects";
import { Textarea } from "./ui/textarea";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";

interface UpdateProjectProps {
    project: FetchProject;
}

const UpdateProject: React.FC<UpdateProjectProps> = ({ project }) => {
    const { updateProject } = useProjectActions();

    const form = useForm<UpdateProjectInput>({
        resolver: zodResolver(updateProjectSchema),
        defaultValues: {
            name: project.name,
            description: project.description ?? undefined,
            dueDate: project.dueDate ? new Date(project.dueDate) : undefined
        },
    });

    const onSubmit: SubmitHandler<UpdateProjectInput> = async (data) => {
        try {
            const response = await updateProject({
                projectSlug: project.slug,
                data,
            });
            if (!response.success) {
                throw new Error(response.message);
            }
            toast.success("Project has been updated successfully.");
        } catch (e) {
            if (e instanceof Error) {
                form.setError("root", { message: e.message });
                toast.error(e.message);
                return;
            }
            form.setError("root", {
                message:
                    "An error has occured while updating your project. Please try again later or contact system administrator.",
            });
        }
    };
    return (
        <Card className="w-full max-w-xl">
            <CardHeader>
                <CardTitle>
                    <TypographyH2>Project Details</TypographyH2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        id="update-project"
                        className="flex flex-col gap-4"
                    >
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
                        <Button type="submit" form="update-project">
                            Save Changes
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default UpdateProject;
