import {
    updateEmail,
    updateDetails,
    updatePassword,
    deleteAccount,
    getAccountSessions,
    revokeUserSession,
} from "@/actions/accountActions";
import {
    UpdateEmailInput,
    UpdateDetailsSchema,
    UpdatePasswordInput,
} from "@/lib/validations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAccountSessions() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: [`account-sessions`],
        queryFn: () => getAccountSessions(),
    });

    return {
        sessions: data,
        isLoading,
        isError,
        error,
    };
}
export function useAccountSettingsActions() {
    const queryClient = useQueryClient();

    const changeDetails = useMutation({
        mutationFn: ({ data }: { data: UpdateDetailsSchema }) =>
            updateDetails(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [``],
            });
        },
    });
    const changeEmail = useMutation({
        mutationFn: ({ data }: { data: UpdateEmailInput }) => updateEmail(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [``],
            });
        },
    });
    const changePassword = useMutation({
        mutationFn: ({ data }: { data: UpdatePasswordInput }) =>
            updatePassword(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [``],
            });
        },
    });
    const delAccount = useMutation({
        mutationFn: () => deleteAccount(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [``],
            });
        },
    });
    const revokeSession = useMutation({
        mutationFn: ({ sessionId }: { sessionId: string }) =>
            revokeUserSession(sessionId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [`account-sessions`],
            });
        },
    });

    return {
        updatePassword: changePassword.mutateAsync,
        updateEmail: changeEmail.mutateAsync,
        updateDetails: changeDetails.mutateAsync,
        deleteAccount: delAccount.mutateAsync,
        revokeSession: revokeSession.mutateAsync,
    };
}
