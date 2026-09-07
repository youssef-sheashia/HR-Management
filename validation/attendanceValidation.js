import { z } from "zod";
import mongoose from "mongoose";
export const updateAttendanceSchema = z.object({
  checkIn: z.coerce.date().optional(),
  checkOut: z.coerce.date().optional(),
});
export const attendanceSchema = z.object({
  employeeID: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid employee ID",
  }),
  status: z.enum(["present", "absent", "late"]),
});
const dateSchema = z.preprocess((value) => {
  if (typeof value === "string") {
    const match = value.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);

    if (match) {
      const [, day, month, year] = match;

      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  }

  return value;
}, z.coerce.date().optional());

export const attendanceQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  sort: z.string().optional(),
  date: dateSchema,
  status: z.enum(["present", "absent", "late"]).optional(),
});
