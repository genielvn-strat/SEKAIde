import { userQueries } from "./queries/userQueries";
import { teamQueries } from "./queries/teamQueries";
import { teamMemberQueries } from "./queries/teamMemberQueries";
import { projectQueries } from "./queries/projectQueries";
import { listQueries } from "./queries/listQueries";
import { taskQueries } from "./queries/taskQueries";
import { commentQueries } from "./queries/commentQueries";
import { roleQueries } from "./queries/roleQueries";
import { dashboardQueries } from "./queries/dashboardQueries";
import { activityQueries } from "./queries/activityQueries";

export const queries = {
    dashboard: dashboardQueries,
    users: userQueries,
    teams: teamQueries,
    teamActivity: activityQueries,
    teamMembers: teamMemberQueries,
    projects: projectQueries,
    lists: listQueries,
    tasks: taskQueries,
    comments: commentQueries,
    roles: roleQueries,
};
