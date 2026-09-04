import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Department name must be at least 2 characters")
    .max(100, "Department name must not exceed 100 characters"),

  manager: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Manager must be a valid MongoDB ObjectId"),
});
