
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { departmentsTable } from '../db/schema';
import { type CreateDepartmentInput, type UpdateDepartmentInput } from '../schema';
import { updateDepartment } from '../handlers/update_department';
import { eq } from 'drizzle-orm';

// Test setup data
const testDepartment: CreateDepartmentInput = {
  name: 'Computer Science',
  description: 'Department of Computer Science and Technology',
  head_of_department: 'Dr. John Smith'
};

describe('updateDepartment', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update department name', async () => {
    // Create initial department
    const created = await db.insert(departmentsTable)
      .values(testDepartment)
      .returning()
      .execute();

    const departmentId = created[0].id;

    const updateInput: UpdateDepartmentInput = {
      id: departmentId,
      name: 'Information Technology'
    };

    const result = await updateDepartment(updateInput);

    expect(result.id).toEqual(departmentId);
    expect(result.name).toEqual('Information Technology');
    expect(result.description).toEqual('Department of Computer Science and Technology');
    expect(result.head_of_department).toEqual('Dr. John Smith');
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > result.created_at).toBe(true);
  });

  it('should update description', async () => {
    // Create initial department
    const created = await db.insert(departmentsTable)
      .values(testDepartment)
      .returning()
      .execute();

    const departmentId = created[0].id;

    const updateInput: UpdateDepartmentInput = {
      id: departmentId,
      description: 'Updated Department Description'
    };

    const result = await updateDepartment(updateInput);

    expect(result.name).toEqual('Computer Science');
    expect(result.description).toEqual('Updated Department Description');
    expect(result.head_of_department).toEqual('Dr. John Smith');
  });

  it('should update head of department', async () => {
    // Create initial department
    const created = await db.insert(departmentsTable)
      .values(testDepartment)
      .returning()
      .execute();

    const departmentId = created[0].id;

    const updateInput: UpdateDepartmentInput = {
      id: departmentId,
      head_of_department: 'Dr. Jane Doe'
    };

    const result = await updateDepartment(updateInput);

    expect(result.name).toEqual('Computer Science');
    expect(result.description).toEqual('Department of Computer Science and Technology');
    expect(result.head_of_department).toEqual('Dr. Jane Doe');
  });

  it('should set head of department to null', async () => {
    // Create initial department
    const created = await db.insert(departmentsTable)
      .values(testDepartment)
      .returning()
      .execute();

    const departmentId = created[0].id;

    const updateInput: UpdateDepartmentInput = {
      id: departmentId,
      head_of_department: null
    };

    const result = await updateDepartment(updateInput);

    expect(result.head_of_department).toBeNull();
  });

  it('should update multiple fields', async () => {
    // Create initial department
    const created = await db.insert(departmentsTable)
      .values(testDepartment)
      .returning()
      .execute();

    const departmentId = created[0].id;

    const updateInput: UpdateDepartmentInput = {
      id: departmentId,
      name: 'Software Engineering',
      description: 'Department of Software Engineering and Development',
      head_of_department: 'Dr. Alice Johnson'
    };

    const result = await updateDepartment(updateInput);

    expect(result.name).toEqual('Software Engineering');
    expect(result.description).toEqual('Department of Software Engineering and Development');
    expect(result.head_of_department).toEqual('Dr. Alice Johnson');
  });

  it('should save changes to database', async () => {
    // Create initial department
    const created = await db.insert(departmentsTable)
      .values(testDepartment)
      .returning()
      .execute();

    const departmentId = created[0].id;

    const updateInput: UpdateDepartmentInput = {
      id: departmentId,
      name: 'Mathematics'
    };

    await updateDepartment(updateInput);

    // Verify changes in database
    const departments = await db.select()
      .from(departmentsTable)
      .where(eq(departmentsTable.id, departmentId))
      .execute();

    expect(departments).toHaveLength(1);
    expect(departments[0].name).toEqual('Mathematics');
    expect(departments[0].description).toEqual('Department of Computer Science and Technology');
    expect(departments[0].head_of_department).toEqual('Dr. John Smith');
  });

  it('should throw error when department does not exist', async () => {
    const updateInput: UpdateDepartmentInput = {
      id: 999,
      name: 'Non-existent Department'
    };

    expect(updateDepartment(updateInput)).rejects.toThrow(/not found/i);
  });

  it('should update updated_at timestamp', async () => {
    // Create initial department
    const created = await db.insert(departmentsTable)
      .values(testDepartment)
      .returning()
      .execute();

    const departmentId = created[0].id;
    const originalUpdatedAt = created[0].updated_at;

    // Wait a moment to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    const updateInput: UpdateDepartmentInput = {
      id: departmentId,
      name: 'Updated Name'
    };

    const result = await updateDepartment(updateInput);

    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
  });
});
