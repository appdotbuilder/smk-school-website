
import { db } from '../db';
import { studentRegistrationsTable } from '../db/schema';
import { type StudentRegistration } from '../schema';
import { desc } from 'drizzle-orm';

export const getStudentRegistrations = async (): Promise<StudentRegistration[]> => {
  try {
    // Fetch all student registrations, ordered by most recent first
    const results = await db.select()
      .from(studentRegistrationsTable)
      .orderBy(desc(studentRegistrationsTable.created_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch student registrations:', error);
    throw error;
  }
};
