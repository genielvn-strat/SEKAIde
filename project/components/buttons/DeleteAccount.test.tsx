import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteAccount from "./DeleteAccount";
import { toast } from "sonner";

const mockDeleteAccount = jest.fn();
const mockSignOut = jest.fn();
const mockPush = jest.fn();

jest.mock("@/hooks/useAccountSettings", () => ({
    useAccountSettingsActions: () => ({
        deleteAccount: mockDeleteAccount,
    }),
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
        replace: jest.fn(),
        refresh: jest.fn(),
    }),
}));

jest.mock("@clerk/nextjs", () => ({
    useAuth: () => ({
        signOut: mockSignOut,
    }),
}));

describe("DeleteAccount", () => {
    beforeEach(() => {
        mockDeleteAccount.mockReset();
        mockSignOut.mockReset();
        (toast.success as jest.Mock).mockReset();
        (toast.error as jest.Mock).mockReset();
        mockPush.mockReset();
    });

    test("delete button disabled when confirmation text is incorrect", async () => {
        render(<DeleteAccount />);

        fireEvent.click(
            screen.getByRole("button", { name: /delete account/i })
        );

        const deleteBtn = screen.getByRole("button", { name: /delete/i });
        expect(deleteBtn).toBeDisabled();

        fireEvent.change(
            screen.getByPlaceholderText(/type confirmation text/i),
            {
                target: { value: "wrong text" },
            }
        );

        expect(deleteBtn).toBeDisabled();
    });

    test("proceeds to second chance confirmation when text matches", async () => {
        render(<DeleteAccount />);

        fireEvent.click(
            screen.getByRole("button", { name: /delete account/i })
        );

        fireEvent.change(
            screen.getByPlaceholderText(/type confirmation text/i),
            {
                target: { value: "I am sure to delete my account" },
            }
        );

        const deleteBtn = screen.getByRole("button", { name: /^delete$/i });
        expect(deleteBtn).toBeEnabled();

        fireEvent.click(deleteBtn);

        await waitFor(() => {
            expect(
                screen.getByText(/this is your last chance/i)
            ).toBeInTheDocument();
        });
    });

    test("successfully deletes the account on final confirmation", async () => {
        mockDeleteAccount.mockResolvedValueOnce({});
        mockSignOut.mockResolvedValueOnce({});

        render(<DeleteAccount />);

        fireEvent.click(
            screen.getByRole("button", { name: /delete account/i })
        );

        fireEvent.change(
            screen.getByPlaceholderText(/type confirmation text/i),
            {
                target: { value: "I am sure to delete my account" },
            }
        );

        fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));

        // Now final dialog
        fireEvent.click(
            await screen.findByRole("button", { name: /finalize my deletion/i })
        );

        await waitFor(() => {
            expect(mockDeleteAccount).toHaveBeenCalled();
            expect(mockSignOut).toHaveBeenCalled();
            expect(mockPush).toHaveBeenCalledWith("/");
        });
    });

    test("fails to delete the account", async () => {
        mockDeleteAccount.mockRejectedValueOnce(new Error("Failed to delete"));

        render(<DeleteAccount />);

        fireEvent.click(
            screen.getByRole("button", { name: /delete account/i })
        );

        fireEvent.change(
            screen.getByPlaceholderText(/type confirmation text/i),
            {
                target: { value: "I am sure to delete my account" },
            }
        );

        fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));

        fireEvent.click(
            await screen.findByRole("button", { name: /finalize my deletion/i })
        );

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Failed to delete");
        });
    });
});
