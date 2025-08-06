
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { achievementsTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { deleteAchievement } from '../handlers/delete_achievement';
import { type IdParam } from '../schema';

describe('deleteAchievement', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete an achievement successfully', async () => {
    // Create test achievement
    const testAchievement = await db.insert(achievementsTable)
      .values({
        title: 'Test Achievement',
        description: 'A test achievement',
        achievement_date: new Date(),
        recipient: 'Test Student',
        category: 'Academic'
      })
      .returning()
      .execute();

    const achievementId = testAchievement[0].id;

    // Delete the achievement
    const input: IdParam = { id: achievementId };
    const result = await deleteAchievement(input);

    expect(result.success).toBe(true);

    // Verify achievement was deleted
    const achievements = await db.select()
      .from(achievementsTable)
      .where(eq(achievementsTable.id, achievementId))
      .execute();

    expect(achievements).toHaveLength(0);
  });

  it('should succeed even when achievement does not exist', async () => {
    const input: IdParam = { id: 999 };
    const result = await deleteAchievement(input);

    expect(result.success).toBe(true);
  });

  it('should not affect other achievements', async () => {
    // Create multiple test achievements
    const achievements = await db.insert(achievementsTable)
      .values([
        {
          title: 'Achievement 1',
          description: 'First achievement',
          achievement_date: new Date(),
          recipient: 'Student 1',
          category: 'Academic'
        },
        {
          title: 'Achievement 2',
          description: 'Second achievement',
          achievement_date: new Date(),
          recipient: 'Student 2',
          category: 'Sports'
        }
      ])
      .returning()
      .execute();

    // Delete only the first achievement
    const input: IdParam = { id: achievements[0].id };
    const result = await deleteAchievement(input);

    expect(result.success).toBe(true);

    // Verify only first achievement was deleted
    const remainingAchievements = await db.select()
      .from(achievementsTable)
      .execute();

    expect(remainingAchievements).toHaveLength(1);
    expect(remainingAchievements[0].id).toBe(achievements[1].id);
    expect(remainingAchievements[0].title).toBe('Achievement 2');
  });
});
