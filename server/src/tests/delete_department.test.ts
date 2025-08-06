
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { departmentsTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type IdParam } from '../schema';
import { deleteDepartment } from '../handlers/delete_department';

describe('deleteDepartment', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete a department successfully', async () => {
    // Create a test department
    const [department] = await db.insert(departmentsTable)
      .values({
        name: 'Test Department',
        description: 'A test department',
        head_of_department: 'Dr. Test'
      })
      .returning()
      .execute();

    const input: IdParam = { id: department.id };

    // Delete the department
    const result = await deleteDepartment(input);

    // Verify success response
    expect(result.success).toBe(true);

    // Verify department was removed from database
    const departments = await db.select()
      .from(departmentsTable)
      .where(eq(departmentsTable.id, department.id))
      .execute();

    expect(departments).toHaveLength(0);
  });

  it('should handle deletion of non-existent department', async () => {
    const input: IdParam = { id: 9999 };

    // Should not throw error even if department doesn't exist
    const result = await deleteDepartment(input);
    expect(result.success).toBe(true);
  });

  it('should not affect other departments', async () => {
    // Create multiple test departments
    const [dept1] = await db.insert(departmentsTable)
      .values({
        name: 'Department 1',
        description: 'First test department',
        head_of_department: 'Dr. One'
      })
      .returning()
      .execute();

    const [dept2] = await db.insert(departmentsTable)
      .values({
        name: 'Department 2',
        description: 'Second test department',
        head_of_department: 'Dr. Two'
      })
      .returning()
      .execute();

    const input: IdParam = { id: dept1.id };

    // Delete first department
    const result = await deleteDepartment(input);
    expect(result.success).toBe(true);

    // Verify first department is deleted
    const deletedDepts = await db.select()
      .from(departmentsTable)
      .where(eq(departmentsTable.id, dept1.id))
      .execute();
    expect(deletedDepts).toHaveLength(0);

    // Verify second department still exists
    const remainingDepts = await db.select()
      .from(departmentsTable)
      .where(eq(departmentsTable.id, dept2.id))
      .execute();
    expect(remainingDepts).toHaveLength(1);
    expect(remainingDepts[0].name).toBe('Department 2');
  });
});
