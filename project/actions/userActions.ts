import { queries } from "@/lib/db";
import { getUserDbId } from "./sessionActions";

export const fetchUserId = async () => {
    return await getUserDbId();
};
