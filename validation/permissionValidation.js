import { z } from "zod";

const createPermissionSchema = z.object({
  type: z.enum(["annual", "emergency", "sick", "unpaid"]),
  reason: z.string().max(200).optional(),
  attachment: z.string().url().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});
