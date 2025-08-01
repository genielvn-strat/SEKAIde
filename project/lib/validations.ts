import { z } from "zod";
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
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    description: z.string().max(500, "Description too long").optional(),
    dueDate: z.date().min(new Date(), "Due date must be in future").optional(),
});
export const createProjectSchema = projectSchema;
export const updateProjectSchema = projectSchema.partial();
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export const taskSchema = z.object({
    title: z
        .string()
        .min(5, "Title is too short.")
        .max(200, "Title is too long"),
    description: z.string().max(1000, "Description too long").optional(),
    priority: z.enum(["low", "medium", "high"]),
    assigneeId: z.string().uuid().optional(),
    dueDate: z.date().min(new Date(), "Due date must be in future").optional(),
});
export const createTaskSchema = taskSchema;
export const updateTaskSchema = taskSchema.partial();
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const listSchema = z.object({
    name: z.string().min(5, "Name is too short.").max(100, "Name is too long"),
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
export const updateCommentSchema = commentSchema.partial();
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
