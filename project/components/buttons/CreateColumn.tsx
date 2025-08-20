"use client";
import React from "react";
import { useListActions } from "@/hooks/useLists";
import { CreateListInput, listSchema } from "@/lib/validations";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FetchProject } from "@/types/ServerResponses";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CirclePlus } from "lucide-react";
import { TypographyMuted } from "../typography/TypographyMuted";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
interface CreateColumnProps {
    project: FetchProject;
}

const CreateColumn: React.FC<CreateColumnProps> = ({ project }) => {
    const { createList } = useListActions();
    const form = useForm<CreateListInput>({
        resolver: zodResolver(listSchema),
        defaultValues: {
            name: "",
            description: "",
            isFinal: false,
            position: 0,
        },
    });

    const onSubmit: SubmitHandler<CreateListInput> = async (data) => {
        try {
            const response = await createList({
                projectSlug: project.slug,
                data,
            });
            if (!response.success) {
                throw new Error(response.message);
            }
            form.reset();
            toast.success("Team has been created successfully.");
        } catch (e) {
            if (e instanceof Error) {
                form.setError("root", { message: e.message });
                toast.error(e.message);
                return;
            }
            form.setError("root", {
                message:
                    "An error has occured while creating your list. Please try again later or contact system administrator.",
            });
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="flex-shrink-0 w-80 border-dashed bg-transparent cursor-pointer hover:bg-accent/30">
                    <CardContent className="flex flex-col justify-center items-center h-full gap-4">
                        <CirclePlus />
                        <TypographyMuted>Add Column</TypographyMuted>
                    </CardContent>
                </Card>
            </DialogTrigger>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} id="create-list">
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create Column</DialogTitle>
                            <DialogDescription>
                                Define your list name and details.
                            </DialogDescription>
                        </DialogHeader>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Column Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="To Do" />
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
                                        <Input
                                            {...field}
                                            placeholder="Tasks to be done"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isFinal"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormControl>
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                id="isFinal"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <FormLabel htmlFor="isFinal">
                                                Mark tasks as finished when
                                                moved to this column
                                            </FormLabel>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                form="create-list"
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

export default CreateColumn;
