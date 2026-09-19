import { z } from "zod";

export const authSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscores are allowed"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export type AuthFormValues = z.infer<typeof authSchema>;
