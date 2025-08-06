
import { db } from '../db';
import { studentRegistrationsTable } from '../db/schema';
import { type UpdateStudentRegistrationStatusInput, type StudentRegistration } from '../schema';
import { eq } from 'drizzle-orm';

export const updateStudentRegistrationStatus = async (input: UpdateStudentRegistrationStatusInput): Promise<StudentRegistration> => {
  try {
    // Update the student registration status
    const result = await db.update(studentRegistrationsTable)
      .set({
        status: input.status
      })
      .where(eq(studentRegistrationsTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Student registration with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Student registration status update failed:', error);
    throw error;
  }
};
