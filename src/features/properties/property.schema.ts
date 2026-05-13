import { z } from "zod";

export const propertySchema = z.object({
  name: z.string().min(2).max(120),
  type: z.enum(["house", "apartment", "land", "commercial", "industrial", "other"]),
  address: z.string().min(5).max(240),
  city: z.string().min(2).max(100),
  country: z.string().min(2).max(100),
  estimatedValueCents: z.number().int().nonnegative(),
  currency: z.string().length(3)
});

export type PropertyInput = z.infer<typeof propertySchema>;
