
import { db } from '../db';
import { departmentsTable } from '../db/schema';
import { type Department } from '../schema';

export const getDepartments = async (): Promise<Department[]> => {
  try {
    const result = await db.select()
      .from(departmentsTable)
      .execute();

    return result;
  } catch (error) {
    console.error('Failed to fetch departments:', error);
    throw error;
  }
};
