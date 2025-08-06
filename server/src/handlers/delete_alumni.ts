
import { db } from '../db';
import { alumniTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type IdParam } from '../schema';

export const deleteAlumni = async (input: IdParam): Promise<{ success: boolean }> => {
  try {
    // Delete alumni record by ID
    const result = await db.delete(alumniTable)
      .where(eq(alumniTable.id, input.id))
      .returning()
      .execute();

    // Return success based on whether a record was actually deleted
    return { success: result.length > 0 };
  } catch (error) {
    console.error('Alumni deletion failed:', error);
    throw error;
  }
};
