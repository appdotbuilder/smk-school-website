
import { serial, text, pgTable, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const genderEnum = pgEnum('gender', ['male', 'female']);
export const registrationStatusEnum = pgEnum('registration_status', ['pending', 'approved', 'rejected']);

// Programs table
export const programsTable = pgTable('programs', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  duration_years: integer('duration_years').notNull(),
  requirements: text('requirements'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Departments table
export const departmentsTable = pgTable('departments', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  head_of_department: text('head_of_department'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// School Events table
export const schoolEventsTable = pgTable('school_events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  event_date: timestamp('event_date').notNull(),
  location: text('location'),
  is_past: boolean('is_past').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Achievements table
export const achievementsTable = pgTable('achievements', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  achievement_date: timestamp('achievement_date').notNull(),
  recipient: text('recipient').notNull(),
  category: text('category').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// News Articles table (Latest Info)
export const newsArticlesTable = pgTable('news_articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  author: text('author').notNull(),
  published_at: timestamp('published_at').defaultNow().notNull(),
  is_published: boolean('is_published').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Alumni table
export const alumniTable = pgTable('alumni', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  graduation_year: integer('graduation_year').notNull(),
  major: text('major').notNull(),
  current_position: text('current_position'),
  company: text('company'),
  contact_email: text('contact_email'),
  bio: text('bio'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Student Registration table
export const studentRegistrationsTable = pgTable('student_registrations', {
  id: serial('id').primaryKey(),
  full_name: text('full_name').notNull(),
  date_of_birth: timestamp('date_of_birth').notNull(),
  gender: genderEnum('gender').notNull(),
  address: text('address').notNull(),
  phone_number: text('phone_number').notNull(),
  email: text('email').notNull(),
  parent_name: text('parent_name').notNull(),
  parent_phone: text('parent_phone').notNull(),
  previous_school: text('previous_school').notNull(),
  desired_major: text('desired_major').notNull(),
  registration_date: timestamp('registration_date').defaultNow().notNull(),
  status: registrationStatusEnum('status').default('pending').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// TypeScript types for the table schemas
export type Program = typeof programsTable.$inferSelect;
export type NewProgram = typeof programsTable.$inferInsert;

export type Department = typeof departmentsTable.$inferSelect;
export type NewDepartment = typeof departmentsTable.$inferInsert;

export type SchoolEvent = typeof schoolEventsTable.$inferSelect;
export type NewSchoolEvent = typeof schoolEventsTable.$inferInsert;

export type Achievement = typeof achievementsTable.$inferSelect;
export type NewAchievement = typeof achievementsTable.$inferInsert;

export type NewsArticle = typeof newsArticlesTable.$inferSelect;
export type NewNewsArticle = typeof newsArticlesTable.$inferInsert;

export type Alumni = typeof alumniTable.$inferSelect;
export type NewAlumni = typeof alumniTable.$inferInsert;

export type StudentRegistration = typeof studentRegistrationsTable.$inferSelect;
export type NewStudentRegistration = typeof studentRegistrationsTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  programs: programsTable,
  departments: departmentsTable,
  schoolEvents: schoolEventsTable,
  achievements: achievementsTable,
  newsArticles: newsArticlesTable,
  alumni: alumniTable,
  studentRegistrations: studentRegistrationsTable
};
