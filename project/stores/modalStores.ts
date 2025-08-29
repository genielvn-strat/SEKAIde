import { create } from "zustand";

type ModalKeys =
    | "deleteComment"
    | "deleteList"
    | "deleteTask"
    | "editComment"
    | "editList"
    | "editTask"
    | "taskDetails"
    | "kickMember"
    | "updateMember";

type ModalStore = {
    modals: Record<ModalKeys, boolean>;
    setOpen: (key: ModalKeys, open: boolean) => void;
};

const useModalStore = create<ModalStore>((set) => ({
    modals: {
        deleteComment: false,
        deleteList: false,
        deleteTask: false,
        editComment: false,
        editList: false,
        editTask: false,
        taskDetails: false,
        kickMember: false,
        updateMember: false,
    },
    setOpen: (key, open) =>
        set((state) => ({
            modals: { ...state.modals, [key]: open },
        })),
}));

export default useModalStore;
