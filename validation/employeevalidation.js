import { email, number, z } from "zod";
import { passwordSchema } from "./authValidation.js";
export const createEmployeeSchema = z.object({
  firstName: z
    .string({ error: "first name is required" })
    .min(3, "first name should be 3 character at lest")
    .max(15),
  lastName: z
    .string({ error: "last name is required" })
    .min(3, "last name should be 3 character at lest")
    .max(15),
  email: z.email("invalid email"),
  password: passwordSchema,
  role: z.enum(["employee", "admin", "security", "manager", "hr"]),
  nationalId: z
    .string({ error: "national id is required" })
    .length(14, "national id must be 14 numbers")
    .regex(
      /^[1-9]\d{13}$/,
      "National ID must be exactly 14 digits and cannot start with 0",
    ),
  department: z.string({ error: "department is requierd" }),
  jobTitle: z.string().optional(),
  contractType: z.string().optional(),
  hireDate: z.coerce.date(),
  salaryGrade: z.string(),
  baseSalary: number().min(2000),
  allowances: z
    .object({
      transport: z.number().min(0),
      housing: z.number().min(0),
      medical: z.number().min(0),
    })
    .optional(),

  bankDetails: z
    .object({
      bankName: z.string().trim().min(2, "Bank name is required"),
      accountNumber: z.string().regex(/^\d{10,20}$/, "Invalid account number"),
      iban: z.string().regex(/^EG\d{27}$/, "Invalid Egyptian IBAN"),
    })
    .optional(),

  emergencyContact: z
    .object({
      name: z.string().trim().min(3, "Contact name is required"),
      phone: z
        .string()
        .regex(/^(\+20|0)1[0125]\d{8}$/, "Invalid Egyptian phone number"),
      relation: z.string().trim().min(2),
    })
    .optional(),

  status: z.enum(["active", "on_leave", "suspended", "terminated"]).optional(),
});
export const updateEmployeeSchema = createEmployeeSchema.partial();
