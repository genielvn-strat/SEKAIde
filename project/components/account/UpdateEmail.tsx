import React, { useEffect } from "react";
import { UpdateEmailInput, updateEmailSchema } from "@/lib/validations";
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
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TypographyH2 } from "../typography/TypographyH2";
import { Input } from "@/components/ui/input";
import { useAccountSettingsActions } from "@/hooks/useAccountSettings";
import { useSession } from "@clerk/nextjs";

const UpdateEmail: React.FC = () => {
    const { updateEmail } = useAccountSettingsActions();
    const { session } = useSession();

    

    const form = useForm<UpdateEmailInput>({
        resolver: zodResolver(updateEmailSchema),
    });
    useEffect(() => {
        if (session?.user) {
            form.reset({
                email: session.user.primaryEmailAddress?.emailAddress,
            });
        }
    }, [session?.user, form]);

    const onSubmit: SubmitHandler<UpdateEmailInput> = async (data) => {
        try {
            await updateEmail({
                data,
            });
            toast.success("Email has changed successfully");
        } catch (e) {
            if (e instanceof Error) {
                form.setError("root", { message: e.message });
                toast.error(e.message);
                return;
            }
            form.setError("root", {
                message:
                    "An error has occured while changing your email. Please try again later or contact system administrator.",
            });
        }
    };
    return (
        <Card className="w-full max-w-xl">
            <CardHeader>
                <CardTitle>
                    <TypographyH2>Email</TypographyH2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        id="update-email"
                        className="flex flex-col gap-4"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
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
                            form="update-email"
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

export default UpdateEmail;
