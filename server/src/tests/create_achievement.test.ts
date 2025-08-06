
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { achievementsTable } from '../db/schema';
import { type CreateAchievementInput } from '../schema';
import { createAchievement } from '../handlers/create_achievement';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateAchievementInput = {
  title: 'Outstanding Academic Performance',
  description: 'Achieved highest GPA in Computer Science program',
  achievement_date: new Date('2023-06-15'),
  recipient: 'John Doe',
  category: 'Academic Excellence'
};

describe('createAchievement', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create an achievement', async () => {
    const result = await createAchievement(testInput);

    // Basic field validation
    expect(result.title).toEqual('Outstanding Academic Performance');
    expect(result.description).toEqual(testInput.description);
    expect(result.achievement_date).toEqual(testInput.achievement_date);
    expect(result.recipient).toEqual('John Doe');
    expect(result.category).toEqual('Academic Excellence');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save achievement to database', async () => {
    const result = await createAchievement(testInput);

    // Query using proper drizzle syntax
    const achievements = await db.select()
      .from(achievementsTable)
      .where(eq(achievementsTable.id, result.id))
      .execute();

    expect(achievements).toHaveLength(1);
    expect(achievements[0].title).toEqual('Outstanding Academic Performance');
    expect(achievements[0].description).toEqual(testInput.description);
    expect(achievements[0].achievement_date).toEqual(testInput.achievement_date);
    expect(achievements[0].recipient).toEqual('John Doe');
    expect(achievements[0].category).toEqual('Academic Excellence');
    expect(achievements[0].created_at).toBeInstanceOf(Date);
    expect(achievements[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create multiple achievements with different categories', async () => {
    const academicInput: CreateAchievementInput = {
      title: 'Dean\'s List',
      description: 'Maintained 3.8+ GPA for consecutive semesters',
      achievement_date: new Date('2023-05-20'),
      recipient: 'Jane Smith',
      category: 'Academic'
    };

    const sportsInput: CreateAchievementInput = {
      title: 'Basketball Championship',
      description: 'Led team to regional championship victory',
      achievement_date: new Date('2023-03-15'),
      recipient: 'Mike Johnson',
      category: 'Sports'
    };

    const academicResult = await createAchievement(academicInput);
    const sportsResult = await createAchievement(sportsInput);

    // Verify both achievements were created
    expect(academicResult.category).toEqual('Academic');
    expect(sportsResult.category).toEqual('Sports');

    // Verify both exist in database
    const allAchievements = await db.select()
      .from(achievementsTable)
      .execute();

    expect(allAchievements).toHaveLength(2);
    const categories = allAchievements.map(a => a.category);
    expect(categories).toContain('Academic');
    expect(categories).toContain('Sports');
  });
});
