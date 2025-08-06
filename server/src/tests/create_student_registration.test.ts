
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { studentRegistrationsTable } from '../db/schema';
import { type CreateStudentRegistrationInput } from '../schema';
import { createStudentRegistration } from '../handlers/create_student_registration';
import { eq } from 'drizzle-orm';

// Simple test input with all required fields
const testInput: CreateStudentRegistrationInput = {
  full_name: 'John Doe',
  date_of_birth: new Date('2000-05-15'),
  gender: 'male',
  address: '123 Main St, City, State',
  phone_number: '+1234567890',
  email: 'john.doe@email.com',
  parent_name: 'Jane Doe',
  parent_phone: '+1987654321',
  previous_school: 'City High School',
  desired_major: 'Computer Science'
};

describe('createStudentRegistration', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a student registration', async () => {
    const result = await createStudentRegistration(testInput);

    // Basic field validation
    expect(result.full_name).toEqual('John Doe');
    expect(result.date_of_birth).toBeInstanceOf(Date);
    expect(result.gender).toEqual('male');
    expect(result.address).toEqual(testInput.address);
    expect(result.phone_number).toEqual('+1234567890');
    expect(result.email).toEqual('john.doe@email.com');
    expect(result.parent_name).toEqual('Jane Doe');
    expect(result.parent_phone).toEqual('+1987654321');
    expect(result.previous_school).toEqual('City High School');
    expect(result.desired_major).toEqual('Computer Science');
    expect(result.status).toEqual('pending');
    expect(result.id).toBeDefined();
    expect(result.registration_date).toBeInstanceOf(Date);
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save student registration to database', async () => {
    const result = await createStudentRegistration(testInput);

    // Query using proper drizzle syntax
    const registrations = await db.select()
      .from(studentRegistrationsTable)
      .where(eq(studentRegistrationsTable.id, result.id))
      .execute();

    expect(registrations).toHaveLength(1);
    expect(registrations[0].full_name).toEqual('John Doe');
    expect(registrations[0].email).toEqual('john.doe@email.com');
    expect(registrations[0].gender).toEqual('male');
    expect(registrations[0].status).toEqual('pending');
    expect(registrations[0].date_of_birth).toBeInstanceOf(Date);
    expect(registrations[0].registration_date).toBeInstanceOf(Date);
    expect(registrations[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle female gender correctly', async () => {
    const femaleInput: CreateStudentRegistrationInput = {
      ...testInput,
      full_name: 'Sarah Smith',
      email: 'sarah.smith@email.com',
      gender: 'female'
    };

    const result = await createStudentRegistration(femaleInput);

    expect(result.gender).toEqual('female');
    expect(result.full_name).toEqual('Sarah Smith');
    expect(result.email).toEqual('sarah.smith@email.com');
  });

  it('should set default status to pending', async () => {
    const result = await createStudentRegistration(testInput);

    expect(result.status).toEqual('pending');
  });

  it('should set registration_date automatically', async () => {
    const beforeRegistration = new Date();
    const result = await createStudentRegistration(testInput);
    const afterRegistration = new Date();

    expect(result.registration_date).toBeInstanceOf(Date);
    expect(result.registration_date >= beforeRegistration).toBe(true);
    expect(result.registration_date <= afterRegistration).toBe(true);
  });
});
