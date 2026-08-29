import { z } from "zod";

export const updateAttendanceSchema = z.object({
  checkIn: z.coerce.date().optional(),
  checkOut: z.coerce.date().optional(),
});
export const attendanceSchema = z.object({
  employeeID: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid employee ID",
  }),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date().optional(),
});
