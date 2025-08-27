import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleX } from "lucide-react";

interface ErrorAlertProps {
    message?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
    return (
        <Alert variant="destructive">
            <CircleX />
            <AlertTitle className="flex flex-row items-center gap-2">
                An error has occurred.
            </AlertTitle>
            <AlertDescription>
                <p>
                    Something went wrong. Please try again later. If the error
                    persists, please report this bug on GitHub.
                </p>
                {message && (
                    <div className="mt-3 rounded-md bg-red-100 p-2 text-sm text-red-700">
                        <span className="font-medium">Details:</span> {message}
                    </div>
                )}
            </AlertDescription>
        </Alert>
    );
};

export default ErrorAlert;
