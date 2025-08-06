
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { achievementsTable } from '../db/schema';
import { type CreateAchievementInput } from '../schema';
import { getAchievements } from '../handlers/get_achievements';

const testAchievement1: CreateAchievementInput = {
  title: 'Academic Excellence Award',
  description: 'Awarded for outstanding academic performance',
  achievement_date: new Date('2023-06-15'),
  recipient: 'John Smith',
  category: 'Academic'
};

const testAchievement2: CreateAchievementInput = {
  title: 'Sports Championship',
  description: 'Won first place in regional basketball tournament',
  achievement_date: new Date('2023-08-20'),
  recipient: 'Basketball Team',
  category: 'Sports'
};

const testAchievement3: CreateAchievementInput = {
  title: 'Community Service Award',
  description: 'Recognition for outstanding community service',
  achievement_date: new Date('2023-05-10'),
  recipient: 'Sarah Johnson',
  category: 'Community Service'
};

describe('getAchievements', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no achievements exist', async () => {
    const result = await getAchievements();
    expect(result).toEqual([]);
  });

  it('should return all achievements', async () => {
    // Create test achievements
    await db.insert(achievementsTable).values([
      testAchievement1,
      testAchievement2,
      testAchievement3
    ]).execute();

    const result = await getAchievements();

    expect(result).toHaveLength(3);
    
    // Check that all achievements are returned
    const titles = result.map(a => a.title);
    expect(titles).toContain('Academic Excellence Award');
    expect(titles).toContain('Sports Championship');
    expect(titles).toContain('Community Service Award');

    // Verify structure of first achievement
    const firstAchievement = result[0];
    expect(firstAchievement.id).toBeDefined();
    expect(typeof firstAchievement.title).toBe('string');
    expect(typeof firstAchievement.description).toBe('string');
    expect(firstAchievement.achievement_date).toBeInstanceOf(Date);
    expect(typeof firstAchievement.recipient).toBe('string');
    expect(typeof firstAchievement.category).toBe('string');
    expect(firstAchievement.created_at).toBeInstanceOf(Date);
    expect(firstAchievement.updated_at).toBeInstanceOf(Date);
  });

  it('should return achievements ordered by achievement_date descending', async () => {
    // Create test achievements with different dates
    await db.insert(achievementsTable).values([
      testAchievement1, // 2023-06-15
      testAchievement2, // 2023-08-20 (most recent)
      testAchievement3  // 2023-05-10 (oldest)
    ]).execute();

    const result = await getAchievements();

    expect(result).toHaveLength(3);
    
    // Verify order: most recent first
    expect(result[0].title).toBe('Sports Championship'); // 2023-08-20
    expect(result[1].title).toBe('Academic Excellence Award'); // 2023-06-15
    expect(result[2].title).toBe('Community Service Award'); // 2023-05-10

    // Verify dates are in descending order
    expect(result[0].achievement_date >= result[1].achievement_date).toBe(true);
    expect(result[1].achievement_date >= result[2].achievement_date).toBe(true);
  });

  it('should handle achievements with same date correctly', async () => {
    const sameDate = new Date('2023-07-01');
    
    await db.insert(achievementsTable).values([
      { ...testAchievement1, achievement_date: sameDate },
      { ...testAchievement2, achievement_date: sameDate }
    ]).execute();

    const result = await getAchievements();

    expect(result).toHaveLength(2);
    result.forEach(achievement => {
      expect(achievement.achievement_date.getTime()).toBe(sameDate.getTime());
    });
  });
});
