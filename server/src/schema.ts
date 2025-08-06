
import { z } from 'zod';

// Program schema
export const programSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  duration_years: z.number().int(),
  requirements: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Program = z.infer<typeof programSchema>;

export const createProgramInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  duration_years: z.number().int().positive(),
  requirements: z.string().nullable()
});

export type CreateProgramInput = z.infer<typeof createProgramInputSchema>;

export const updateProgramInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  duration_years: z.number().int().positive().optional(),
  requirements: z.string().nullable().optional()
});

export type UpdateProgramInput = z.infer<typeof updateProgramInputSchema>;

// Department schema
export const departmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  head_of_department: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Department = z.infer<typeof departmentSchema>;

export const createDepartmentInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  head_of_department: z.string().nullable()
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentInputSchema>;

export const updateDepartmentInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  head_of_department: z.string().nullable().optional()
});

export type UpdateDepartmentInput = z.infer<typeof updateDepartmentInputSchema>;

// School Event schema
export const schoolEventSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  event_date: z.coerce.date(),
  location: z.string().nullable(),
  is_past: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type SchoolEvent = z.infer<typeof schoolEventSchema>;

export const createSchoolEventInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  event_date: z.coerce.date(),
  location: z.string().nullable(),
  is_past: z.boolean().default(false)
});

export type CreateSchoolEventInput = z.infer<typeof createSchoolEventInputSchema>;

export const updateSchoolEventInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  event_date: z.coerce.date().optional(),
  location: z.string().nullable().optional(),
  is_past: z.boolean().optional()
});

export type UpdateSchoolEventInput = z.infer<typeof updateSchoolEventInputSchema>;

// Achievement schema
export const achievementSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  achievement_date: z.coerce.date(),
  recipient: z.string(),
  category: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Achievement = z.infer<typeof achievementSchema>;

export const createAchievementInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  achievement_date: z.coerce.date(),
  recipient: z.string().min(1),
  category: z.string().min(1)
});

export type CreateAchievementInput = z.infer<typeof createAchievementInputSchema>;

export const updateAchievementInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  achievement_date: z.coerce.date().optional(),
  recipient: z.string().min(1).optional(),
  category: z.string().min(1).optional()
});

export type UpdateAchievementInput = z.infer<typeof updateAchievementInputSchema>;

// News Article schema (Latest Info)
export const newsArticleSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  excerpt: z.string().nullable(),
  author: z.string(),
  published_at: z.coerce.date(),
  is_published: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type NewsArticle = z.infer<typeof newsArticleSchema>;

export const createNewsArticleInputSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().nullable(),
  author: z.string().min(1),
  published_at: z.coerce.date().optional(),
  is_published: z.boolean().default(false)
});

export type CreateNewsArticleInput = z.infer<typeof createNewsArticleInputSchema>;

export const updateNewsArticleInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().nullable().optional(),
  author: z.string().min(1).optional(),
  published_at: z.coerce.date().optional(),
  is_published: z.boolean().optional()
});

export type UpdateNewsArticleInput = z.infer<typeof updateNewsArticleInputSchema>;

// Alumni schema
export const alumniSchema = z.object({
  id: z.number(),
  name: z.string(),
  graduation_year: z.number().int(),
  major: z.string(),
  current_position: z.string().nullable(),
  company: z.string().nullable(),
  contact_email: z.string().email().nullable(),
  bio: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Alumni = z.infer<typeof alumniSchema>;

export const createAlumniInputSchema = z.object({
  name: z.string().min(1),
  graduation_year: z.number().int().min(1950).max(new Date().getFullYear()),
  major: z.string().min(1),
  current_position: z.string().nullable(),
  company: z.string().nullable(),
  contact_email: z.string().email().nullable(),
  bio: z.string().nullable()
});

export type CreateAlumniInput = z.infer<typeof createAlumniInputSchema>;

export const updateAlumniInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  graduation_year: z.number().int().min(1950).max(new Date().getFullYear()).optional(),
  major: z.string().min(1).optional(),
  current_position: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  contact_email: z.string().email().nullable().optional(),
  bio: z.string().nullable().optional()
});

export type UpdateAlumniInput = z.infer<typeof updateAlumniInputSchema>;

// Student Registration schema
export const studentRegistrationSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  date_of_birth: z.coerce.date(),
  gender: z.enum(['male', 'female']),
  address: z.string(),
  phone_number: z.string(),
  email: z.string().email(),
  parent_name: z.string(),
  parent_phone: z.string(),
  previous_school: z.string(),
  desired_major: z.string(),
  registration_date: z.coerce.date(),
  status: z.enum(['pending', 'approved', 'rejected']),
  created_at: z.coerce.date()
});

export type StudentRegistration = z.infer<typeof studentRegistrationSchema>;

export const createStudentRegistrationInputSchema = z.object({
  full_name: z.string().min(1),
  date_of_birth: z.coerce.date(),
  gender: z.enum(['male', 'female']),
  address: z.string().min(1),
  phone_number: z.string().min(1),
  email: z.string().email(),
  parent_name: z.string().min(1),
  parent_phone: z.string().min(1),
  previous_school: z.string().min(1),
  desired_major: z.string().min(1)
});

export type CreateStudentRegistrationInput = z.infer<typeof createStudentRegistrationInputSchema>;

export const updateStudentRegistrationStatusInputSchema = z.object({
  id: z.number(),
  status: z.enum(['pending', 'approved', 'rejected'])
});

export type UpdateStudentRegistrationStatusInput = z.infer<typeof updateStudentRegistrationStatusInputSchema>;

// Query parameter schemas
export const idParamSchema = z.object({
  id: z.number()
});

export type IdParam = z.infer<typeof idParamSchema>;
