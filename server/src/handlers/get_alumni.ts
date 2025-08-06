
import { db } from '../db';
import { alumniTable } from '../db/schema';
import { type Alumni } from '../schema';
import { desc } from 'drizzle-orm';

export const getAlumni = async (): Promise<Alumni[]> => {
  try {
    const results = await db.select()
      .from(alumniTable)
      .orderBy(desc(alumniTable.graduation_year))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch alumni:', error);
    throw error;
  }
};
