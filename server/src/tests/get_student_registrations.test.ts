
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { studentRegistrationsTable } from '../db/schema';
import { type CreateStudentRegistrationInput } from '../schema';
import { getStudentRegistrations } from '../handlers/get_student_registrations';

// Test input for student registration
const testRegistrationInput: CreateStudentRegistrationInput = {
  full_name: 'John Doe',
  date_of_birth: new Date('2000-05-15'),
  gender: 'male',
  address: '123 Main Street, City',
  phone_number: '+1234567890',
  email: 'john.doe@email.com',
  parent_name: 'Jane Doe',
  parent_phone: '+0987654321',
  previous_school: 'ABC High School',
  desired_major: 'Computer Science'
};

describe('getStudentRegistrations', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no registrations exist', async () => {
    const result = await getStudentRegistrations();
    
    expect(result).toEqual([]);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return all student registrations', async () => {
    // Create first registration
    await db.insert(studentRegistrationsTable)
      .values({
        ...testRegistrationInput,
        full_name: 'John Doe'
      })
      .execute();

    // Wait a moment to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    // Create second registration
    await db.insert(studentRegistrationsTable)
      .values({
        ...testRegistrationInput,
        full_name: 'Jane Smith',
        email: 'jane.smith@email.com',
        desired_major: 'Biology'
      })
      .execute();

    const result = await getStudentRegistrations();

    expect(result).toHaveLength(2);
    
    // Verify first registration (most recent due to desc order)
    expect(result[0].full_name).toEqual('Jane Smith'); // Should be first due to desc order
    expect(result[0].email).toEqual('jane.smith@email.com');
    expect(result[0].gender).toEqual('male');
    expect(result[0].desired_major).toEqual('Biology');
    expect(result[0].status).toEqual('pending'); // Default value
    expect(result[0].id).toBeDefined();
    expect(result[0].registration_date).toBeInstanceOf(Date);
    expect(result[0].created_at).toBeInstanceOf(Date);
    
    // Verify second registration (older)
    expect(result[1].full_name).toEqual('John Doe');
    expect(result[1].email).toEqual('john.doe@email.com');
    expect(result[1].desired_major).toEqual('Computer Science');
  });

  it('should return registrations ordered by creation date descending', async () => {
    // Create first registration
    await db.insert(studentRegistrationsTable)
      .values({
        ...testRegistrationInput,
        full_name: 'First Student'
      })
      .execute();

    // Wait a moment to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    // Create second registration
    await db.insert(studentRegistrationsTable)
      .values({
        ...testRegistrationInput,
        full_name: 'Second Student',
        email: 'second@email.com'
      })
      .execute();

    const result = await getStudentRegistrations();

    expect(result).toHaveLength(2);
    expect(result[0].full_name).toEqual('Second Student'); // Most recent first
    expect(result[1].full_name).toEqual('First Student');
    
    // Verify timestamps are ordered correctly
    expect(result[0].created_at.getTime()).toBeGreaterThan(result[1].created_at.getTime());
  });

  it('should include all required fields in response', async () => {
    await db.insert(studentRegistrationsTable)
      .values(testRegistrationInput)
      .execute();

    const result = await getStudentRegistrations();

    expect(result).toHaveLength(1);
    const registration = result[0];

    // Verify all required fields are present
    expect(registration.id).toBeDefined();
    expect(registration.full_name).toEqual('John Doe');
    expect(registration.date_of_birth).toBeInstanceOf(Date);
    expect(registration.gender).toEqual('male');
    expect(registration.address).toEqual('123 Main Street, City');
    expect(registration.phone_number).toEqual('+1234567890');
    expect(registration.email).toEqual('john.doe@email.com');
    expect(registration.parent_name).toEqual('Jane Doe');
    expect(registration.parent_phone).toEqual('+0987654321');
    expect(registration.previous_school).toEqual('ABC High School');
    expect(registration.desired_major).toEqual('Computer Science');
    expect(registration.registration_date).toBeInstanceOf(Date);
    expect(registration.status).toEqual('pending');
    expect(registration.created_at).toBeInstanceOf(Date);
  });
});
