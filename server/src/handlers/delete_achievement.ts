
import { db } from '../db';
import { achievementsTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type IdParam } from '../schema';

export const deleteAchievement = async (input: IdParam): Promise<{ success: boolean }> => {
  try {
    const result = await db.delete(achievementsTable)
      .where(eq(achievementsTable.id, input.id))
      .execute();

    return { success: true };
  } catch (error) {
    console.error('Achievement deletion failed:', error);
    throw error;
  }
};
