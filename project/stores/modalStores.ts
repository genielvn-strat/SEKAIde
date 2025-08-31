import { create } from "zustand";

type ModalStore = {
  // generic modals that don't belong to a specific entity
  modals: {
    taskDetails: boolean;
  };

  // entity-specific modals (store ID instead of boolean)
  editTaskId: string | null;
  deleteTaskId: string | null;

  editListId: string | null;
  deleteListId: string | null;

  editCommentId: string | null;
  deleteCommentId: string | null;

  updateMemberId: string | null;
  kickMemberId: string | null;

  // setters
  setOpen: (key: keyof ModalStore["modals"], open: boolean) => void;
  setEditTaskId: (id: string | null) => void;
  setDeleteTaskId: (id: string | null) => void;

  setEditListId: (id: string | null) => void;
  setDeleteListId: (id: string | null) => void;

  setEditCommentId: (id: string | null) => void;
  setDeleteCommentId: (id: string | null) => void;

  setUpdateMemberId: (id: string | null) => void;
  setKickMemberId: (id: string | null) => void;
};

const useModalStore = create<ModalStore>((set) => ({
  modals: {
    taskDetails: false,
  },

  editTaskId: null,
  deleteTaskId: null,

  editListId: null,
  deleteListId: null,

  editCommentId: null,
  deleteCommentId: null,

  updateMemberId: null,
  kickMemberId: null,

  setOpen: (key, open) =>
    set((state) => ({
      modals: { ...state.modals, [key]: open },
    })),

  setEditTaskId: (id) => set({ editTaskId: id }),
  setDeleteTaskId: (id) => set({ deleteTaskId: id }),

  setEditListId: (id) => set({ editListId: id }),
  setDeleteListId: (id) => set({ deleteListId: id }),

  setEditCommentId: (id) => set({ editCommentId: id }),
  setDeleteCommentId: (id) => set({ deleteCommentId: id }),

  setUpdateMemberId: (id) => set({ updateMemberId: id }),
  setKickMemberId: (id) => set({ kickMemberId: id }),
}));

export default useModalStore;
