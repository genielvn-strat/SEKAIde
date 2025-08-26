-- Custom SQL migration file, put your code below! --
-- Insert roles

INSERT INTO roles (name, nameId, priority, color)
VALUES 
    ('Owner', 'owner', 0, 'red'),
    ('Project Manager', 'project_manager', 1, 'orange'),
    ('Member', 'member', 2, 'blue'),
    ('Guest', 'guest', 3, 'green')
ON CONFLICT DO NOTHING;

-- Insert permissions
INSERT INTO permissions (name, description)
VALUES
    ('kick_members', 'Remove a member from the team'),
    ('invite_members', 'Invite new members to the team'),
    ('update_members', 'Update roles or details of team members'),
    ('update_team', 'Update team information'),
    ('delete_team', 'Delete the team permanently'),
    ('create_project', 'Create new projects'),
    ('update_project', 'Update existing projects'),
    ('delete_project', 'Delete projects'),
    ('reset_project', 'Reset project back to default state'),
    ('create_list', 'Create new lists'),
    ('update_list', 'Update existing lists'),
    ('delete_list', 'Delete lists'),
    ('create_task', 'Create new tasks'),
    ('update_task', 'Update existing tasks'),
    ('delete_task', 'Delete tasks'),
    ('assign_others', 'Assign tasks to other members'),
    ('create_comment', 'Add comments to tasks'),
    ('update_comment', 'Update your comments'),
    ('delete_comment', 'Delete comments')
ON CONFLICT DO NOTHING;

-- ============================================
-- ============================================
-- ============================================
-- ============================================
-- ============================================

-- Role ↔ Permission mapping
-- kick_members
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'owner' AND p.name = 'kick_members'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'project_manager' AND p.name = 'kick_members'
ON CONFLICT DO NOTHING;

-- invite_members
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'owner' AND p.name = 'invite_members'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'project_manager' AND p.name = 'invite_members'
ON CONFLICT DO NOTHING;

-- update_members
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'owner' AND p.name = 'update_members'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'project_manager' AND p.name = 'update_members'
ON CONFLICT DO NOTHING;

-- update_team
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'owner' AND p.name = 'update_team'
ON CONFLICT DO NOTHING;

-- delete_team
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'owner' AND p.name = 'delete_team'
ON CONFLICT DO NOTHING;

-- create_project
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'owner' AND p.name = 'create_project'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'project_manager' AND p.name = 'create_project'
ON CONFLICT DO NOTHING;

-- update_project
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'owner' AND p.name = 'update_project'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'project_manager' AND p.name = 'update_project'
ON CONFLICT DO NOTHING;

-- delete_project
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'owner' AND p.name = 'delete_project'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'project_manager' AND p.name = 'delete_project'
ON CONFLICT DO NOTHING;

-- reset_project
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'owner' AND p.name = 'reset_project'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'project_manager' AND p.name = 'reset_project'
ON CONFLICT DO NOTHING;

-- create_list
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'owner' AND p.name = 'create_list'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'project_manager' AND p.name = 'create_list'
ON CONFLICT DO NOTHING;

-- update_list
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'owner' AND p.name = 'update_list'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'project_manager' AND p.name = 'update_list'
ON CONFLICT DO NOTHING;

-- delete_list
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'owner' AND p.name = 'delete_list'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'project_manager' AND p.name = 'delete_list'
ON CONFLICT DO NOTHING;

-- create_task
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'owner' AND p.name = 'create_task'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'project_manager' AND p.name = 'create_task'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'member' AND p.name = 'create_task'
ON CONFLICT DO NOTHING;

-- update_task
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'owner' AND p.name = 'update_task'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'project_manager' AND p.name = 'update_task'
ON CONFLICT DO NOTHING;

-- delete_task
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'owner' AND p.name = 'delete_task'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'project_manager' AND p.name = 'delete_task'
ON CONFLICT DO NOTHING;

-- assign_others
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'owner' AND p.name = 'assign_others'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'project_manager' AND p.name = 'assign_others'
ON CONFLICT DO NOTHING;

-- create_comment
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'owner' AND p.name = 'create_comment'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'project_manager' AND p.name = 'create_comment'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'member' AND p.name = 'create_comment'
ON CONFLICT DO NOTHING;

-- update_comment
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'owner' AND p.name = 'update_comment'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'project_manager' AND p.name = 'update_comment'
ON CONFLICT DO NOTHING;

-- delete_comment
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'owner' AND p.name = 'delete_comment'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.nameId = 'project_manager' AND p.name = 'delete_comment'
ON CONFLICT DO NOTHING;
