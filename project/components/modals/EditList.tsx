"use client";
import React, { Dispatch, SetStateAction } from "react";
import { useListActions } from "@/hooks/useLists";
import { CreateListInput, listSchema } from "@/lib/validations";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FetchList, FetchProject } from "@/types/ServerResponses";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import useModalStore from "@/stores/modalStores";
interface UpdateListProps {
    list: FetchList;
    projectSlug: string;
}

const EditList: React.FC<UpdateListProps> = ({ list, projectSlug }) => {
    const { editListId, setEditListId } = useModalStore();
    const { updateList } = useListActions(projectSlug);
    const form = useForm<CreateListInput>({
        resolver: zodResolver(listSchema),
        defaultValues: {
            name: list.name,
            description: list.description ?? undefined,
            isFinal: list.isFinal,
            position: list.position,
            color: list.color ?? undefined,
        },
    });

    const onSubmit: SubmitHandler<CreateListInput> = async (data) => {
        try {
            const response = await updateList({
                projectSlug,
                listId: list.id,
                data,
            });
            if (!response.success) {
                throw new Error(response.message);
            }
            toast.success("List has been edited successfully.");
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
        <Dialog
            open={list.id == editListId}
            onOpenChange={(open: boolean) =>
                setEditListId(open ? list.id : null)
            }
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} id={`edit-list-${list.id}`}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit List</DialogTitle>
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
                            name="color"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Color</FormLabel>
                                    <Select
                                        onValueChange={(val) =>
                                            field.onChange(
                                                val === "none" ? undefined : val
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a color" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                None
                                            </SelectItem>
                                            <SelectItem
                                                value="red"
                                                className="text-rainbow-red"
                                            >
                                                Red
                                            </SelectItem>
                                            <SelectItem
                                                value="orange"
                                                className="text-rainbow-orange"
                                            >
                                                Orange
                                            </SelectItem>
                                            <SelectItem
                                                value="yellow"
                                                className="text-rainbow-yellow"
                                            >
                                                Yellow
                                            </SelectItem>
                                            <SelectItem
                                                value="green"
                                                className="text-rainbow-green"
                                            >
                                                Green
                                            </SelectItem>
                                            <SelectItem
                                                value="blue"
                                                className="text-rainbow-blue"
                                            >
                                                Blue
                                            </SelectItem>
                                            <SelectItem
                                                value="violet"
                                                className="text-rainbow-violet"
                                            >
                                                Violet
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                form={`edit-list-${list.id}`}
                            >
                                {form.formState.isSubmitting
                                    ? "Editing"
                                    : "Edit"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Form>
        </Dialog>
    );
};

export default EditList;
