"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TypographyMuted } from "@/components/typography/TypographyMuted";
import { useRouter } from "next/navigation";
import { useAccountSettingsActions } from "@/hooks/useAccountSettings";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

const DeleteAccount: React.FC = () => {
    const { signOut } = useAuth();
    const [confirmationText, setConfirmationText] = useState("");
    const router = useRouter();
    const { deleteAccount } = useAccountSettingsActions();
    const [secondChance, setSecondChance] = useState<boolean>(false);
    const handleDelete = async () => {
        try {
            await deleteAccount();
            await signOut().catch();
            router.push(`/`);
        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);
                return;
            }
            toast.error("An error has occurred.");
        }
    };
    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            THIS IS A DANGEROUS ACTION
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Your account will be
                            permanently be deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="py-2 flex flex-col gap-2">
                        <Input
                            placeholder="Type confirmation text..."
                            value={confirmationText}
                            onChange={(e) =>
                                setConfirmationText(e.target.value)
                            }
                        />
                        <TypographyMuted>
                            <strong>
                                Type &quot;I am sure to delete my account&quot; to
                                confirm.
                            </strong>
                        </TypographyMuted>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive dark:bg-destructive"
                            disabled={
                                confirmationText !=
                                "I am sure to delete my account"
                            }
                            onClick={() => {
                                setSecondChance(true);
                                setConfirmationText("");
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {secondChance && (
                <AlertDialog open onOpenChange={setSecondChance}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                This is your last chance.
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Confirming will now delete your account.
                                <br />
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction
                                className="bg-destructive dark:bg-destructive hover:bg-black hover:text-white dark:hover:bg-black dark:hover:text-white"
                                onClick={handleDelete}
                            >
                                Finalize my deletion
                            </AlertDialogAction>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}{" "}
        </>
    );
};

export default DeleteAccount;
