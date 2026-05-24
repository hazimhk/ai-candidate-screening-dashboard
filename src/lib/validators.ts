import { z } from "zod";

export const candidateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  skills: z.array(z.string().min(1)).default([]),
  experienceYears: z.coerce.number().int().min(0).max(60).default(0),
  resumeText: z.string().min(20),
  status: z.enum(["SHORTLISTED", "PENDING", "REJECTED"]).default("PENDING")
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
