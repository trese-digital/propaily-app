import { z } from "zod";

export const documentSchema = z.object({
  propertyId: z.string().uuid(),
  category: z.enum(["deed", "tax", "insurance", "lease", "maintenance", "other"]),
  name: z.string().min(2).max(160),
  expiresAt: z.coerce.date().optional()
});

export type DocumentInput = z.infer<typeof documentSchema>;
