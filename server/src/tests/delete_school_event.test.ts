
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { schoolEventsTable } from '../db/schema';
import { type IdParam } from '../schema';
import { deleteSchoolEvent } from '../handlers/delete_school_event';
import { eq } from 'drizzle-orm';

describe('deleteSchoolEvent', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete an existing school event', async () => {
    // Create a test school event first
    const testEvent = await db.insert(schoolEventsTable)
      .values({
        title: 'Test Event',
        description: 'A test event',
        event_date: new Date('2024-06-15'),
        location: 'Test Location',
        is_past: false
      })
      .returning()
      .execute();

    const eventId = testEvent[0].id;
    const input: IdParam = { id: eventId };

    // Delete the school event
    const result = await deleteSchoolEvent(input);

    // Should return success: true
    expect(result.success).toBe(true);

    // Verify the school event is actually deleted from database
    const deletedEvent = await db.select()
      .from(schoolEventsTable)
      .where(eq(schoolEventsTable.id, eventId))
      .execute();

    expect(deletedEvent).toHaveLength(0);
  });

  it('should return success: false when trying to delete non-existent school event', async () => {
    const input: IdParam = { id: 99999 };

    // Try to delete non-existent school event
    const result = await deleteSchoolEvent(input);

    // Should return success: false
    expect(result.success).toBe(false);
  });

  it('should not affect other school events when deleting one', async () => {
    // Create multiple test school events
    const events = await db.insert(schoolEventsTable)
      .values([
        {
          title: 'Event 1',
          description: 'First event',
          event_date: new Date('2024-06-15'),
          location: 'Location 1',
          is_past: false
        },
        {
          title: 'Event 2',
          description: 'Second event',
          event_date: new Date('2024-07-15'),
          location: 'Location 2',
          is_past: true
        }
      ])
      .returning()
      .execute();

    const firstEventId = events[0].id;
    const input: IdParam = { id: firstEventId };

    // Delete the first school event
    const result = await deleteSchoolEvent(input);

    expect(result.success).toBe(true);

    // Verify only the first event is deleted
    const remainingEvents = await db.select()
      .from(schoolEventsTable)
      .execute();

    expect(remainingEvents).toHaveLength(1);
    expect(remainingEvents[0].title).toBe('Event 2');
    expect(remainingEvents[0].id).toBe(events[1].id);
  });
});
