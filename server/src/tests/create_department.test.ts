
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { departmentsTable } from '../db/schema';
import { type CreateDepartmentInput } from '../schema';
import { createDepartment } from '../handlers/create_department';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateDepartmentInput = {
  name: 'Computer Science',
  description: 'Department of Computer Science and Engineering',
  head_of_department: 'Dr. John Smith'
};

const testInputWithoutHead: CreateDepartmentInput = {
  name: 'Mathematics',
  description: 'Department of Mathematics and Statistics',
  head_of_department: null
};

describe('createDepartment', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a department with head', async () => {
    const result = await createDepartment(testInput);

    // Basic field validation
    expect(result.name).toEqual('Computer Science');
    expect(result.description).toEqual(testInput.description);
    expect(result.head_of_department).toEqual('Dr. John Smith');
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('number');
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create a department without head', async () => {
    const result = await createDepartment(testInputWithoutHead);

    // Basic field validation
    expect(result.name).toEqual('Mathematics');
    expect(result.description).toEqual(testInputWithoutHead.description);
    expect(result.head_of_department).toBeNull();
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('number');
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save department to database', async () => {
    const result = await createDepartment(testInput);

    // Query using proper drizzle syntax
    const departments = await db.select()
      .from(departmentsTable)
      .where(eq(departmentsTable.id, result.id))
      .execute();

    expect(departments).toHaveLength(1);
    expect(departments[0].name).toEqual('Computer Science');
    expect(departments[0].description).toEqual(testInput.description);
    expect(departments[0].head_of_department).toEqual('Dr. John Smith');
    expect(departments[0].created_at).toBeInstanceOf(Date);
    expect(departments[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle null head_of_department correctly', async () => {
    const result = await createDepartment(testInputWithoutHead);

    // Verify in database
    const departments = await db.select()
      .from(departmentsTable)
      .where(eq(departmentsTable.id, result.id))
      .execute();

    expect(departments).toHaveLength(1);
    expect(departments[0].head_of_department).toBeNull();
  });

  it('should generate unique IDs for multiple departments', async () => {
    const result1 = await createDepartment(testInput);
    const result2 = await createDepartment(testInputWithoutHead);

    expect(result1.id).not.toEqual(result2.id);
    expect(typeof result1.id).toBe('number');
    expect(typeof result2.id).toBe('number');

    // Verify both exist in database
    const departments = await db.select()
      .from(departmentsTable)
      .execute();

    expect(departments).toHaveLength(2);
  });
});
