import { create } from "zustand";
import { persist } from "zustand/middleware";

type RecentDetails = {
    type: "task" | "team" | "project";
    title: string;
    link: string;
};

type RecentStore = {
    recents: RecentDetails[];
    setRecent: (item: RecentDetails) => void;
    clearRecent: () => void;
};

export const useRecentStore = create<RecentStore>()(
    persist(
        (set) => ({
            recents: [],
            setRecent: (item) =>
                set((state) => {
                    const filtered = state.recents.filter(
                        (r) => r.link !== item.link
                    );
                    const updated = [item, ...filtered].slice(0, 10);
                    return { recents: updated };
                }),
            clearRecent: () => set({ recents: [] }),
        }),
        {
            name: "recents",
        }
    )
);
