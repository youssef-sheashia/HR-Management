import { z } from "zod";
import express from "express";
const passwordSchema = z
  .string({
    required_error: "password is required",
    invalid_type_error: "password must be a string",
  })
  .superRefine((val, ctx) => {
    if (val.length < 8) {
      ctx.addIssue({
        code: "custom",
        message: "Password must be at least 8 characters long",
      });
    }

    if (!/[a-z]/.test(val)) {
      ctx.addIssue({
        code: "custom",
        message: "Password must contain at least one lowercase letter",
      });
    }

    if (!/[A-Z]/.test(val)) {
      ctx.addIssue({
        code: "custom",
        message: "Password must contain at least one uppercase letter",
      });
    }

    if (!/[0-9]/.test(val)) {
      ctx.addIssue({
        code: "custom",
        message: "Password must contain at least one number",
      });
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(val)) {
      ctx.addIssue({
        code: "custom",
        message: "Password must contain at least one special character",
      });
    }
  });

const confirmPasswordSchema = z.string({
  required_error: "confirm password is required",
  invalid_type_error: "confirm password must be a string",
});
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: passwordSchema,
});
export const verifyOTPSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  otp: z.string().min(6).max(6),
});
export const resetPasswordshema = z
  .object({
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password do not match. Please try again",
    path: ["confirmPassword"],
  });
