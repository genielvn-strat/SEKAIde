import { permissions, rolePermissions, roles } from "@/migrations/schema";
import { db } from "../db";

export const createData = {
    permissions: async () => {
        await db.insert(permissions).values([
            {
                name: "kick_members",
                description: "Remove a member from the team",
            },
            {
                name: "invite_members",
                description: "Invite new members to the team",
            },
            {
                name: "update_members",
                description: "Update roles or details of team members",
            },

            { name: "update_team", description: "Update team information" },
            { name: "delete_team", description: "Delete the team permanently" },

            { name: "create_project", description: "Create new projects" },
            { name: "update_project", description: "Update existing projects" },
            { name: "delete_project", description: "Delete projects" },
            { name: "reset_project", description: "Reset project back to default state" },

            { name: "create_list", description: "Create new lists" },
            { name: "update_list", description: "Update existing lists" },
            { name: "delete_list", description: "Delete lists" },

            { name: "create_task", description: "Create new tasks" },
            { name: "update_task", description: "Update existing tasks" },
            { name: "delete_task", description: "Delete tasks" },
            {
                name: "assign_others",
                description: "Assign tasks to other members",
            },

            { name: "create_comment", description: "Add comments to tasks" },
            { name: "update_comment", description: "Update your comments" },
            { name: "delete_comment", description: "Delete comments" },
        ]).onConflictDoNothing();
    },
    rolePermissions: async () => {
        const rolePermissionMap: Record<string, string[]> = {
            kick_members: ["owner", "project_manager"],
            invite_members: ["owner", "project_manager"],
            update_members: ["owner", "project_manager"],

            update_team: ["owner"],
            delete_team: ["owner"],

            create_project: ["owner", "project_manager"],
            update_project: ["owner", "project_manager"],
            delete_project: ["owner", "project_manager"],
            reset_project: ["owner", "project_manager"],

            create_list: ["owner", "project_manager"],
            update_list: ["owner", "project_manager"],
            delete_list: ["owner", "project_manager"],

            create_task: ["owner", "project_manager", "member"],
            update_task: ["owner", "project_manager"],
            delete_task: ["owner", "project_manager"],
            assign_others: ["owner", "project_manager"],

            create_comment: ["owner", "project_manager", "member"],
            update_comment: ["owner", "project_manager"],
            delete_comment: ["owner", "project_manager"],
        };
        // 1. Fetch all roles
        const allRoles = await db.select().from(roles);
        const roleMap = Object.fromEntries(
            allRoles.map((r) => [r.nameId, r.id])
        );

        // 2. Fetch all permissions
        const allPerms = await db.select().from(permissions);
        const permMap = Object.fromEntries(allPerms.map((p) => [p.name, p.id]));

        // 3. Build insert rows
        const inserts = [];
        for (const [permName, roleIds] of Object.entries(rolePermissionMap)) {
            const permId = permMap[permName];
            if (!permId) continue;

            for (const roleNameId of roleIds) {
                const roleId = roleMap[roleNameId];
                if (!roleId) continue;

                inserts.push({
                    roleId,
                    permissionId: permId,
                });
            }
        }

        // 4. Insert into rolePermissions with conflict safety
        if (inserts.length > 0) {
            await db
                .insert(rolePermissions)
                .values(inserts)
                .onConflictDoNothing(); // prevents duplicates
        }
    },
};
