
import { db } from '../db';
import { studentRegistrationsTable } from '../db/schema';
import { type CreateStudentRegistrationInput, type StudentRegistration } from '../schema';

export const createStudentRegistration = async (input: CreateStudentRegistrationInput): Promise<StudentRegistration> => {
  try {
    // Insert student registration record
    const result = await db.insert(studentRegistrationsTable)
      .values({
        full_name: input.full_name,
        date_of_birth: input.date_of_birth,
        gender: input.gender,
        address: input.address,
        phone_number: input.phone_number,
        email: input.email,
        parent_name: input.parent_name,
        parent_phone: input.parent_phone,
        previous_school: input.previous_school,
        desired_major: input.desired_major
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Student registration creation failed:', error);
    throw error;
  }
};
