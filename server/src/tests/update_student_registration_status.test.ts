
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { studentRegistrationsTable } from '../db/schema';
import { type UpdateStudentRegistrationStatusInput, type CreateStudentRegistrationInput } from '../schema';
import { updateStudentRegistrationStatus } from '../handlers/update_student_registration_status';
import { eq } from 'drizzle-orm';

// Test input for creating a student registration
const testRegistrationInput: CreateStudentRegistrationInput = {
  full_name: 'John Doe',
  date_of_birth: new Date('2000-01-01'),
  gender: 'male',
  address: '123 Test Street',
  phone_number: '555-1234',
  email: 'john.doe@test.com',
  parent_name: 'Jane Doe',
  parent_phone: '555-5678',
  previous_school: 'Test High School',
  desired_major: 'Computer Science'
};

describe('updateStudentRegistrationStatus', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update student registration status to approved', async () => {
    // Create a student registration first
    const createdRegistration = await db.insert(studentRegistrationsTable)
      .values({
        ...testRegistrationInput,
        registration_date: new Date(),
        status: 'pending'
      })
      .returning()
      .execute();

    const registrationId = createdRegistration[0].id;

    const updateInput: UpdateStudentRegistrationStatusInput = {
      id: registrationId,
      status: 'approved'
    };

    const result = await updateStudentRegistrationStatus(updateInput);

    // Verify the update
    expect(result.id).toEqual(registrationId);
    expect(result.status).toEqual('approved');
    expect(result.full_name).toEqual('John Doe');
    expect(result.email).toEqual('john.doe@test.com');
  });

  it('should update student registration status to rejected', async () => {
    // Create a student registration first
    const createdRegistration = await db.insert(studentRegistrationsTable)
      .values({
        ...testRegistrationInput,
        registration_date: new Date(),
        status: 'pending'
      })
      .returning()
      .execute();

    const registrationId = createdRegistration[0].id;

    const updateInput: UpdateStudentRegistrationStatusInput = {
      id: registrationId,
      status: 'rejected'
    };

    const result = await updateStudentRegistrationStatus(updateInput);

    // Verify the update
    expect(result.id).toEqual(registrationId);
    expect(result.status).toEqual('rejected');
  });

  it('should persist status change in database', async () => {
    // Create a student registration first
    const createdRegistration = await db.insert(studentRegistrationsTable)
      .values({
        ...testRegistrationInput,
        registration_date: new Date(),
        status: 'pending'
      })
      .returning()
      .execute();

    const registrationId = createdRegistration[0].id;

    const updateInput: UpdateStudentRegistrationStatusInput = {
      id: registrationId,
      status: 'approved'
    };

    await updateStudentRegistrationStatus(updateInput);

    // Query database to verify persistence
    const updatedRegistrations = await db.select()
      .from(studentRegistrationsTable)
      .where(eq(studentRegistrationsTable.id, registrationId))
      .execute();

    expect(updatedRegistrations).toHaveLength(1);
    expect(updatedRegistrations[0].status).toEqual('approved');
    expect(updatedRegistrations[0].id).toEqual(registrationId);
  });

  it('should throw error for non-existent registration', async () => {
    const updateInput: UpdateStudentRegistrationStatusInput = {
      id: 99999, // Non-existent ID
      status: 'approved'
    };

    await expect(updateStudentRegistrationStatus(updateInput))
      .rejects.toThrow(/not found/i);
  });

  it('should update from approved back to pending', async () => {
    // Create a student registration with approved status
    const createdRegistration = await db.insert(studentRegistrationsTable)
      .values({
        ...testRegistrationInput,
        registration_date: new Date(),
        status: 'approved'
      })
      .returning()
      .execute();

    const registrationId = createdRegistration[0].id;

    const updateInput: UpdateStudentRegistrationStatusInput = {
      id: registrationId,
      status: 'pending'
    };

    const result = await updateStudentRegistrationStatus(updateInput);

    // Verify the update
    expect(result.id).toEqual(registrationId);
    expect(result.status).toEqual('pending');
  });
});
