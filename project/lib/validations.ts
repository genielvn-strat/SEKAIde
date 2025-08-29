import { z } from "zod";

export const accountSchema = z.object({
    email: z.string().email(),
    currentPassword: z.string(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one symbol"),
    confirmPassword: z.string(),
    firstName: z.string().max(50),
    lastName: z.string().max(50),
    avatar: z
        .any() // Use .any() to handle the File type
        .refine((file) => !file || file.size <= 1000000, {
            message: "Max size is 1MB",
        })
        .refine((file) => !file || file.type.startsWith("image/"), {
            message: "Only images are allowed",
        })
        .optional(),
});

export const updateEmailSchema = accountSchema.pick({ email: true });
export const updatePasswordSchema = accountSchema
    .pick({
        currentPassword: true,
        password: true,
        confirmPassword: true,
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });
export const updateDetailsSchema = accountSchema.pick({
    firstName: true,
    lastName: true,
    avatar: true,
});
export type UpdateEmailInput = z.infer<typeof updateEmailSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type UpdateDetailsSchema = z.infer<typeof updateDetailsSchema>;

export const userSchema = z.object({
    clerkId: z.string().min(1),
    email: z.string().email(),
    username: z.string().min(1),
    name: z.string().min(1),
});

export const createUserSchema = userSchema;
export const updateUserSchema = userSchema.partial();
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const projectSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name is too long"),
    description: z.string().max(50, "Description is too long").optional(),
    teamId: z.string().min(1, "Please select a team."),
    dueDate: z.date().min(new Date(), "Due date must be in future").optional(),
});
export const createProjectSchema = projectSchema;
export const updateProjectSchema = projectSchema.partial();
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export const teamSchema = z.object({
    name: z
        .string()
        .min(1, "Your team name is required")
        .max(100, "The team name is too long"),
});
export const createTeamSchema = teamSchema;
export const updateTeamSchema = teamSchema.partial();
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;

export const teamMemberSchema = z.object({
    input: z.string().min(1, "Input an email or a username"),
    roleId: z.string().min(1, "Role selection is required"),
});
export const createTeamMemberSchema = teamMemberSchema;
export const updateTeamMemberSchema = teamMemberSchema.partial();
export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;

export const taskSchema = z.object({
    title: z
        .string()
        .min(5, "Title is too short.")
        .max(50, "Title is too long"),
    description: z.string().max(1000, "Description is too long").optional(),
    priority: z.enum(["low", "medium", "high"]),
    listId: z.string(),
    assigneeId: z.string().uuid().optional(),
    position: z.number().nonnegative("Position must be positive").optional(),
    finished: z.boolean(),
    dueDate: z.date().min(new Date(), "Due date must be in future").optional(),
});
export const createTaskSchema = taskSchema;
export const updateTaskSchema = taskSchema.partial();
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const listSchema = z.object({
    name: z.string().min(5, "Name is too short.").max(100, "Name is too long"),
    description: z.string().max(200, "Description too long.").optional(),
    isFinal: z.boolean(),
    position: z.number().nonnegative("Position must be positive"),
    color: z
        .enum(["red", "orange", "yellow", "green", "blue", "violet"])
        .optional(),
});
export const createListSchema = listSchema;
export const updateListSchema = listSchema.partial();
export type CreateListInput = z.infer<typeof createListSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;

export const commentSchema = z.object({
    content: z
        .string()
        .min(3, "Content is too short.")
        .max(1000, "Content is too long."),
});
export const createCommentSchema = commentSchema;
export const updateCommentSchema = commentSchema;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;

// TODO: Task 3.6 - Set up data validation with Zod schemas

/*
TODO: Implementation Notes for Interns:

1. Install Zod: pnpm add zod
2. Create validation schemas for all forms and API endpoints
3. Add proper error messages
4. Set up client and server-side validation

Example schemas needed:
- Project creation/update
- Task creation/update
- User profile update
- List/column management
- Comment creation

Example structure:

export const projectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  dueDate: z.date().min(new Date(), 'Due date must be in future').optional(),
})

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.date().optional(),
  assigneeId: z.string().uuid().optional(),
  })
  */

// Placeholder exports to prevent import errors
