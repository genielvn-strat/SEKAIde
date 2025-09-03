import { create } from "zustand";

type searchStore = {
    open: boolean;
    setOpen: (value: boolean) => void;
};
export const useSearchStore = create<searchStore>((set) => ({
    open: false,
    setOpen: (value) => set({ open: value }),
}));
