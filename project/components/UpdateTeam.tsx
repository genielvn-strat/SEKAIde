import { FetchTeamDetails } from "@/types/ServerResponses";
import React from "react";
import { useTeamActions } from "@/hooks/useTeams";
import { UpdateTeamInput, updateTeamSchema } from "@/lib/validations";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TypographyH2 } from "./typography/TypographyH2";
import { Input } from "@/components/ui/input";

interface UpdateTeamProps {
    teamDetails: FetchTeamDetails;
}

const UpdateTeam: React.FC<UpdateTeamProps> = ({ teamDetails }) => {
    const { updateTeam } = useTeamActions();

    const form = useForm<UpdateTeamInput>({
        resolver: zodResolver(updateTeamSchema),
        defaultValues: {
            name: teamDetails.name,
        },
    });

    const onSubmit: SubmitHandler<UpdateTeamInput> = async (data) => {
        try {
            const response = await updateTeam({ teamId: teamDetails.id, data });
            if (!response.success) {
                throw new Error(response.message);
            }
            toast.success("Team has been created successfully.");
        } catch (e) {
            if (e instanceof Error) {
                form.setError("root", { message: e.message });
                toast.error(e.message);
                return;
            }
            form.setError("root", {
                message:
                    "An error has occured while creating your team. Please try again later or contact system administrator.",
            });
        }
    };
    return (
        <Card className="w-full max-w-xl">
            <CardHeader>
                <CardTitle>
                    <TypographyH2>Team Name</TypographyH2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        id="update-team"
                        className="flex flex-col gap-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" form="update-team">
                            Save Changes
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default UpdateTeam;
