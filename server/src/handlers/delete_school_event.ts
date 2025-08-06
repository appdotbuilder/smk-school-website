
import { db } from '../db';
import { schoolEventsTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type IdParam } from '../schema';

export const deleteSchoolEvent = async (input: IdParam): Promise<{ success: boolean }> => {
  try {
    // Delete the school event by ID
    const result = await db.delete(schoolEventsTable)
      .where(eq(schoolEventsTable.id, input.id))
      .returning()
      .execute();

    // Check if any record was actually deleted
    return { success: result.length > 0 };
  } catch (error) {
    console.error('School event deletion failed:', error);
    throw error;
  }
};
