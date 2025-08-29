import React, { useEffect } from "react";
import { UpdateDetailsSchema, updateDetailsSchema } from "@/lib/validations";
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
import { TypographyH2 } from "../typography/TypographyH2";
import { Input } from "@/components/ui/input";
import { useAccountSettingsActions } from "@/hooks/useAccountSettings";
import { useSession } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const UpdateDetails: React.FC = () => {
    const { updateDetails: updateName } = useAccountSettingsActions();
    const { session } = useSession();

    const form = useForm<UpdateDetailsSchema>({
        resolver: zodResolver(updateDetailsSchema),
        defaultValues: {
            firstName: session?.user.firstName ?? "",
            lastName: session?.user.lastName ?? "",
        },
    });

    useEffect(() => {
        if (session?.user) {
            form.reset({
                firstName: session.user.firstName ?? "",
                lastName: session.user.lastName ?? "",
            });
        }
    }, [session?.user?.firstName, session?.user?.lastName]);

    const onSubmit: SubmitHandler<UpdateDetailsSchema> = async (data) => {
        try {
            await updateName({
                data,
            });
            toast.success("Your account details has changed successfully");
            window.location.reload();
        } catch (e) {
            if (e instanceof Error) {
                form.setError("root", { message: e.message });
                toast.error(e.message);
                return;
            }
            form.setError("root", {
                message:
                    "An error has occured while changing your account details. Please try again later or contact system administrator.",
            });
        }
    };
    return (
        <Card className="w-full max-w-xl">
            <CardHeader>
                <CardTitle>
                    <TypographyH2>Account Details</TypographyH2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        id="update-name"
                        className="flex flex-col gap-4"
                    >
                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Avatar</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-row items-center gap-4">
                                            <Avatar>
                                                <AvatarImage
                                                    className="object-cover"
                                                    src={
                                                        field.value instanceof
                                                        File
                                                            ? URL.createObjectURL(
                                                                  field.value
                                                              ) // preview uploaded file
                                                            : session?.user
                                                                  ?.imageUrl ||
                                                              undefined
                                                    }
                                                />
                                                <AvatarFallback>
                                                    U
                                                </AvatarFallback>
                                            </Avatar>
                                            <Input
                                                name={field.name}
                                                type="file"
                                                accept="image/png,image/jpeg,image/webp"
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files?.[0];
                                                    field.onChange(file);
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {form.formState.errors.root && (
                            <p className="text-sm text-red-500 mt-1">
                                {form.formState.errors.root.message}
                            </p>
                        )}

                        <Button
                            type="submit"
                            form="update-name"
                            disabled={form.formState.isSubmitting}
                        >
                            Update
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default UpdateDetails;
