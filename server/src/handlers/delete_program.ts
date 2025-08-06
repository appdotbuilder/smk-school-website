
import { db } from '../db';
import { programsTable } from '../db/schema';
import { type IdParam } from '../schema';
import { eq } from 'drizzle-orm';

export const deleteProgram = async (input: IdParam): Promise<{ success: boolean }> => {
  try {
    const result = await db.delete(programsTable)
      .where(eq(programsTable.id, input.id))
      .returning()
      .execute();

    // Return success true if a record was actually deleted
    return { success: result.length > 0 };
  } catch (error) {
    console.error('Program deletion failed:', error);
    throw error;
  }
};
