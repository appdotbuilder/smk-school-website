
import { db } from '../db';
import { departmentsTable } from '../db/schema';
import { type UpdateDepartmentInput, type Department } from '../schema';
import { eq } from 'drizzle-orm';

export const updateDepartment = async (input: UpdateDepartmentInput): Promise<Department> => {
  try {
    // Build update object with only provided fields
    const updateData: any = {
      updated_at: new Date()
    };

    if (input.name !== undefined) {
      updateData.name = input.name;
    }
    if (input.description !== undefined) {
      updateData.description = input.description;
    }
    if (input.head_of_department !== undefined) {
      updateData.head_of_department = input.head_of_department;
    }

    // Update department record
    const result = await db.update(departmentsTable)
      .set(updateData)
      .where(eq(departmentsTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error('Department not found');
    }

    return result[0];
  } catch (error) {
    console.error('Department update failed:', error);
    throw error;
  }
};
