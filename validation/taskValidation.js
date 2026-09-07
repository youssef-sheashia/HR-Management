import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .max(200, "Task title must not exceed 200 characters"),

  description: z.string().trim().min(1, "Task description is required"),

  status: z
    .enum(["pending", "in progress", "completed"])
    .default("pending")
    .optional(),

  assignedTo: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid assignedTo ID")
    .optional(),

  assignedBy: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid assignedBy ID")
    .optional(),

  deadline: z.coerce
    .date()
    .refine((date) => date >= new Date(), "Deadline must be in the future"),

  department: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid department ID")
    .optional(),
});
