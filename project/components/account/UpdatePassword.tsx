import React from "react";
import { UpdatePasswordInput, updatePasswordSchema } from "@/lib/validations";
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
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TypographyH2 } from "../typography/TypographyH2";
import { Input } from "@/components/ui/input";
import { useAccountSettingsActions } from "@/hooks/useAccountSettings";

const UpdatePassword: React.FC = () => {
    const { updatePassword } = useAccountSettingsActions();

    const form = useForm<UpdatePasswordInput>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            password: "",
            currentPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit: SubmitHandler<UpdatePasswordInput> = async (data) => {
        try {
            await updatePassword({
                data,
            });
            toast.success("Password has changed successfully");
            form.reset();
        } catch (e) {
            if (e instanceof Error) {
                form.setError("root", { message: e.message });
                toast.error(e.message);
                return;
            }
            form.setError("root", {
                message:
                    "An error has occured while changing your password. Please try again later or contact system administrator.",
            });
        }
    };
    return (
        <Card className="w-full max-w-xl">
            <CardHeader>
                <CardTitle>
                    <TypographyH2>Password</TypographyH2>
                </CardTitle>
                <CardDescription>
                    It is recommended to change your password regularly.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        id="update-password"
                        className="flex flex-col gap-4"
                    >
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
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
                            form="update-password"
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

export default UpdatePassword;
