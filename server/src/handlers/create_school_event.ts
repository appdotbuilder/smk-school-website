
import { db } from '../db';
import { schoolEventsTable } from '../db/schema';
import { type CreateSchoolEventInput, type SchoolEvent } from '../schema';

export const createSchoolEvent = async (input: CreateSchoolEventInput): Promise<SchoolEvent> => {
  try {
    // Insert school event record
    const result = await db.insert(schoolEventsTable)
      .values({
        title: input.title,
        description: input.description,
        event_date: input.event_date,
        location: input.location,
        is_past: input.is_past
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('School event creation failed:', error);
    throw error;
  }
};
