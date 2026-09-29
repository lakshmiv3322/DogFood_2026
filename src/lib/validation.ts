import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const ScoreSubmitSchema = z.object({
  projectId: z.string().min(1, "projectId is required"),
  functionality: z.coerce
    .number({ invalid_type_error: "functionality must be a number" })
    .min(0, "functionality must be between 0 and 10")
    .max(10, "functionality must be between 0 and 10"),
  quality: z.coerce
    .number({ invalid_type_error: "quality must be a number" })
    .min(0, "quality must be between 0 and 10")
    .max(10, "quality must be between 0 and 10"),
  comment: z
    .string()
    .max(2000, "comment cannot exceed 2000 characters")
    .optional()
    .default(""),
});

const HttpUrlSchema = z
  .string()
  .url("Must be a valid URL")
  .refine(
    (url) => /^https?:\/\//i.test(url),
    "URL must use http:// or https://"
  );

export const ProjectSubmitSchema = z.object({
  title: z.string().min(1, "title is required"),
  summary: z.string().optional().default(""),
  repo_url: HttpUrlSchema.optional().or(z.literal("")),
  repoUrl: HttpUrlSchema.optional().or(z.literal("")),
  teamId: z.string().optional(),
  trackId: z.string().optional(),
});

export const RegisterSchema = z.object({
  teamName: z
    .string()
    .min(2, "Team name must be at least 2 characters")
    .max(60, "Team name cannot exceed 60 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ScoreSubmitInput = z.infer<typeof ScoreSubmitSchema>;
export type ProjectSubmitInput = z.infer<typeof ProjectSubmitSchema>;
