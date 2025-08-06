
import { db } from '../db';
import { achievementsTable } from '../db/schema';
import { type UpdateAchievementInput, type Achievement } from '../schema';
import { eq } from 'drizzle-orm';

export const updateAchievement = async (input: UpdateAchievementInput): Promise<Achievement> => {
  try {
    // Build update object with only provided fields
    const updateData: Record<string, any> = {
      updated_at: new Date()
    };

    if (input.title !== undefined) {
      updateData['title'] = input.title;
    }
    if (input.description !== undefined) {
      updateData['description'] = input.description;
    }
    if (input.achievement_date !== undefined) {
      updateData['achievement_date'] = input.achievement_date;
    }
    if (input.recipient !== undefined) {
      updateData['recipient'] = input.recipient;
    }
    if (input.category !== undefined) {
      updateData['category'] = input.category;
    }

    // Update achievement record
    const result = await db.update(achievementsTable)
      .set(updateData)
      .where(eq(achievementsTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Achievement with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Achievement update failed:', error);
    throw error;
  }
};
