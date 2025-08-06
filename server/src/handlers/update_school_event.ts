
import { db } from '../db';
import { schoolEventsTable } from '../db/schema';
import { type UpdateSchoolEventInput, type SchoolEvent } from '../schema';
import { eq } from 'drizzle-orm';

export const updateSchoolEvent = async (input: UpdateSchoolEventInput): Promise<SchoolEvent> => {
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
    if (input.event_date !== undefined) {
      updateData['event_date'] = input.event_date;
    }
    if (input.location !== undefined) {
      updateData['location'] = input.location;
    }
    if (input.is_past !== undefined) {
      updateData['is_past'] = input.is_past;
    }

    // Update the school event
    const result = await db.update(schoolEventsTable)
      .set(updateData)
      .where(eq(schoolEventsTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`School event with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('School event update failed:', error);
    throw error;
  }
};
