"use server"
import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";

export const fetchItems = async () => {
    const userId = await getUserDbId();
    const result = await queries.search.fetchItems(userId)
    return result;
};
