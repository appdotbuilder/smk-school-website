
import { db } from '../db';
import { achievementsTable } from '../db/schema';
import { type Achievement } from '../schema';
import { desc } from 'drizzle-orm';

export const getAchievements = async (): Promise<Achievement[]> => {
  try {
    const results = await db.select()
      .from(achievementsTable)
      .orderBy(desc(achievementsTable.achievement_date))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch achievements:', error);
    throw error;
  }
};
