
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { schoolEventsTable } from '../db/schema';
import { type CreateSchoolEventInput, type UpdateSchoolEventInput } from '../schema';
import { updateSchoolEvent } from '../handlers/update_school_event';
import { eq } from 'drizzle-orm';

const testCreateInput: CreateSchoolEventInput = {
  title: 'Original Event',
  description: 'Original description',
  event_date: new Date('2024-06-15T10:00:00Z'),
  location: 'Original Location',
  is_past: false
};

const testUpdateInput: UpdateSchoolEventInput = {
  id: 1,
  title: 'Updated Event',
  description: 'Updated description',
  event_date: new Date('2024-07-20T14:00:00Z'),
  location: 'Updated Location',
  is_past: true
};

describe('updateSchoolEvent', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update a school event', async () => {
    // Create initial event
    const [created] = await db.insert(schoolEventsTable)
      .values(testCreateInput)
      .returning()
      .execute();

    // Update the event
    const result = await updateSchoolEvent({
      ...testUpdateInput,
      id: created.id
    });

    // Verify updated fields
    expect(result.id).toEqual(created.id);
    expect(result.title).toEqual('Updated Event');
    expect(result.description).toEqual('Updated description');
    expect(result.event_date).toEqual(new Date('2024-07-20T14:00:00Z'));
    expect(result.location).toEqual('Updated Location');
    expect(result.is_past).toEqual(true);
    expect(result.created_at).toEqual(created.created_at);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(created.updated_at.getTime());
  });

  it('should update event in database', async () => {
    // Create initial event
    const [created] = await db.insert(schoolEventsTable)
      .values(testCreateInput)
      .returning()
      .execute();

    // Update the event
    await updateSchoolEvent({
      ...testUpdateInput,
      id: created.id
    });

    // Verify database was updated
    const events = await db.select()
      .from(schoolEventsTable)
      .where(eq(schoolEventsTable.id, created.id))
      .execute();

    expect(events).toHaveLength(1);
    const event = events[0];
    expect(event.title).toEqual('Updated Event');
    expect(event.description).toEqual('Updated description');
    expect(event.event_date).toEqual(new Date('2024-07-20T14:00:00Z'));
    expect(event.location).toEqual('Updated Location');
    expect(event.is_past).toEqual(true);
    expect(event.updated_at).toBeInstanceOf(Date);
  });

  it('should update only provided fields', async () => {
    // Create initial event
    const [created] = await db.insert(schoolEventsTable)
      .values(testCreateInput)
      .returning()
      .execute();

    // Update only title and location
    const result = await updateSchoolEvent({
      id: created.id,
      title: 'Partially Updated Event',
      location: 'New Location'
    });

    // Verify only specified fields were updated
    expect(result.title).toEqual('Partially Updated Event');
    expect(result.location).toEqual('New Location');
    expect(result.description).toEqual('Original description');
    expect(result.event_date).toEqual(new Date('2024-06-15T10:00:00Z'));
    expect(result.is_past).toEqual(false);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(created.updated_at.getTime());
  });

  it('should handle nullable fields correctly', async () => {
    // Create initial event
    const [created] = await db.insert(schoolEventsTable)
      .values(testCreateInput)
      .returning()
      .execute();

    // Update location to null
    const result = await updateSchoolEvent({
      id: created.id,
      location: null
    });

    expect(result.location).toBeNull();
    expect(result.title).toEqual('Original Event'); // Should remain unchanged
  });

  it('should throw error for non-existent event', async () => {
    await expect(updateSchoolEvent({
      id: 999,
      title: 'Updated Event'
    })).rejects.toThrow(/School event with id 999 not found/);
  });
});
