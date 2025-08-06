
import { db } from '../db';
import { achievementsTable } from '../db/schema';
import { type CreateAchievementInput, type Achievement } from '../schema';

export const createAchievement = async (input: CreateAchievementInput): Promise<Achievement> => {
  try {
    // Insert achievement record
    const result = await db.insert(achievementsTable)
      .values({
        title: input.title,
        description: input.description,
        achievement_date: input.achievement_date,
        recipient: input.recipient,
        category: input.category
      })
      .returning()
      .execute();

    const achievement = result[0];
    return achievement;
  } catch (error) {
    console.error('Achievement creation failed:', error);
    throw error;
  }
};
