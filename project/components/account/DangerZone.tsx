import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TypographyH2 } from "../typography/TypographyH2";
import DeleteAccount from "../buttons/DeleteAccount";

const DangerZone: React.FC = () => {
    return (
        <Card className="w-full max-w-xl border-destructive">
            <CardHeader>
                <CardTitle>
                    <TypographyH2>Danger Zone</TypographyH2>
                </CardTitle>
                <CardDescription>
                    Actions that may affect your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <DeleteAccount />
            </CardContent>
        </Card>
    );
};

export default DangerZone;
