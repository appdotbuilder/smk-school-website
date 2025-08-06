
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { achievementsTable } from '../db/schema';
import { type CreateAchievementInput, type UpdateAchievementInput } from '../schema';
import { updateAchievement } from '../handlers/update_achievement';
import { eq } from 'drizzle-orm';

// Create test achievement data
const createTestAchievement = async (): Promise<number> => {
  const testAchievement = {
    title: 'Original Achievement',
    description: 'Original description',
    achievement_date: new Date('2024-01-01'),
    recipient: 'Original Recipient',
    category: 'Original Category'
  };

  const result = await db.insert(achievementsTable)
    .values(testAchievement)
    .returning()
    .execute();

  return result[0].id;
};

const testUpdateInput: UpdateAchievementInput = {
  id: 1, // Will be set in tests
  title: 'Updated Achievement Title',
  description: 'Updated achievement description',
  achievement_date: new Date('2024-02-01'),
  recipient: 'Updated Recipient',
  category: 'Updated Category'
};

describe('updateAchievement', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update all fields of an achievement', async () => {
    const achievementId = await createTestAchievement();
    const updateInput = { ...testUpdateInput, id: achievementId };

    const result = await updateAchievement(updateInput);

    expect(result.id).toEqual(achievementId);
    expect(result.title).toEqual('Updated Achievement Title');
    expect(result.description).toEqual('Updated achievement description');
    expect(result.achievement_date).toEqual(new Date('2024-02-01'));
    expect(result.recipient).toEqual('Updated Recipient');
    expect(result.category).toEqual('Updated Category');
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update only provided fields', async () => {
    const achievementId = await createTestAchievement();
    
    const partialUpdate: UpdateAchievementInput = {
      id: achievementId,
      title: 'Partially Updated Title',
      category: 'New Category'
    };

    const result = await updateAchievement(partialUpdate);

    expect(result.id).toEqual(achievementId);
    expect(result.title).toEqual('Partially Updated Title');
    expect(result.description).toEqual('Original description'); // Should remain unchanged
    expect(result.achievement_date).toEqual(new Date('2024-01-01')); // Should remain unchanged
    expect(result.recipient).toEqual('Original Recipient'); // Should remain unchanged
    expect(result.category).toEqual('New Category');
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save updated achievement to database', async () => {
    const achievementId = await createTestAchievement();
    const updateInput = { ...testUpdateInput, id: achievementId };

    await updateAchievement(updateInput);

    const achievements = await db.select()
      .from(achievementsTable)
      .where(eq(achievementsTable.id, achievementId))
      .execute();

    expect(achievements).toHaveLength(1);
    expect(achievements[0].title).toEqual('Updated Achievement Title');
    expect(achievements[0].description).toEqual('Updated achievement description');
    expect(achievements[0].achievement_date).toEqual(new Date('2024-02-01'));
    expect(achievements[0].recipient).toEqual('Updated Recipient');
    expect(achievements[0].category).toEqual('Updated Category');
    expect(achievements[0].updated_at).toBeInstanceOf(Date);
  });

  it('should throw error when achievement does not exist', async () => {
    const nonExistentId = 99999;
    const updateInput = { ...testUpdateInput, id: nonExistentId };

    expect(updateAchievement(updateInput)).rejects.toThrow(/not found/i);
  });

  it('should update the updated_at timestamp', async () => {
    const achievementId = await createTestAchievement();
    
    // Get original timestamp
    const originalRecord = await db.select()
      .from(achievementsTable)
      .where(eq(achievementsTable.id, achievementId))
      .execute();
    const originalUpdatedAt = originalRecord[0].updated_at;

    // Wait a bit to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    const updateInput = { ...testUpdateInput, id: achievementId };
    const result = await updateAchievement(updateInput);

    expect(result.updated_at.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
  });
});
