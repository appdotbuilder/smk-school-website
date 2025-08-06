
import { db } from '../db';
import { departmentsTable } from '../db/schema';
import { type CreateDepartmentInput, type Department } from '../schema';

export const createDepartment = async (input: CreateDepartmentInput): Promise<Department> => {
  try {
    // Insert department record
    const result = await db.insert(departmentsTable)
      .values({
        name: input.name,
        description: input.description,
        head_of_department: input.head_of_department
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Department creation failed:', error);
    throw error;
  }
};
