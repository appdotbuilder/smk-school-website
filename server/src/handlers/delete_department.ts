
import { db } from '../db';
import { departmentsTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type IdParam } from '../schema';

export const deleteDepartment = async (input: IdParam): Promise<{ success: boolean }> => {
  try {
    const result = await db.delete(departmentsTable)
      .where(eq(departmentsTable.id, input.id))
      .execute();

    return { success: true };
  } catch (error) {
    console.error('Department deletion failed:', error);
    throw error;
  }
};
