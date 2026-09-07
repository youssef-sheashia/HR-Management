import { z } from "zod";
export const payrollSchema = z.object({
  month: z
    .number()
    .int()
    .min(1)
    .max(12, { message: "Month must be between 1 and 12" }),
  year: z
    .number()
    .int()
    .min(1900, { message: "Year must be greater than or equal to 1900" }),
});

export const updatePayrollSchema = z.object({
  baseSalary: z.number().positive().optional(),

  allowances: z
    .object({
      transport: z.number().min(0).optional(),
      housing: z.number().min(0).optional(),
      medical: z.number().min(0).optional(),
    })
    .optional(),

  deductions: z
    .object({
      absence: z.number().min(0).optional(),
      late: z.number().min(0).optional(),
    })
    .optional(),
});
