
import { db } from '../db';
import { schoolEventsTable } from '../db/schema';
import { type SchoolEvent } from '../schema';

export const getSchoolEvents = async (): Promise<SchoolEvent[]> => {
  try {
    const results = await db.select()
      .from(schoolEventsTable)
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch school events:', error);
    throw error;
  }
};
