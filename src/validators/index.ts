import { z } from "zod";

export const ContactValidationSchema = z.object({
  body: z.object({ fullname: z.string().min(3), email: z.string().email() }),
});
