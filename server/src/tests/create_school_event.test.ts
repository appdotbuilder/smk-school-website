
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { schoolEventsTable } from '../db/schema';
import { type CreateSchoolEventInput } from '../schema';
import { createSchoolEvent } from '../handlers/create_school_event';
import { eq, gte } from 'drizzle-orm';

// Test input with all fields
const testInput: CreateSchoolEventInput = {
  title: 'Test School Event',
  description: 'A test event for our school',
  event_date: new Date('2024-06-15T10:00:00Z'),
  location: 'Main Auditorium',
  is_past: false
};

describe('createSchoolEvent', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a school event', async () => {
    const result = await createSchoolEvent(testInput);

    // Basic field validation
    expect(result.title).toEqual('Test School Event');
    expect(result.description).toEqual(testInput.description);
    expect(result.event_date).toEqual(testInput.event_date);
    expect(result.location).toEqual('Main Auditorium');
    expect(result.is_past).toEqual(false);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save school event to database', async () => {
    const result = await createSchoolEvent(testInput);

    // Query using proper drizzle syntax
    const events = await db.select()
      .from(schoolEventsTable)
      .where(eq(schoolEventsTable.id, result.id))
      .execute();

    expect(events).toHaveLength(1);
    expect(events[0].title).toEqual('Test School Event');
    expect(events[0].description).toEqual(testInput.description);
    expect(events[0].event_date).toEqual(testInput.event_date);
    expect(events[0].location).toEqual('Main Auditorium');
    expect(events[0].is_past).toEqual(false);
    expect(events[0].created_at).toBeInstanceOf(Date);
    expect(events[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create event with null location', async () => {
    const inputWithNullLocation: CreateSchoolEventInput = {
      ...testInput,
      location: null
    };

    const result = await createSchoolEvent(inputWithNullLocation);

    expect(result.location).toBeNull();
    
    // Verify in database
    const events = await db.select()
      .from(schoolEventsTable)
      .where(eq(schoolEventsTable.id, result.id))
      .execute();

    expect(events[0].location).toBeNull();
  });

  it('should create event with is_past set to true', async () => {
    const pastEventInput: CreateSchoolEventInput = {
      ...testInput,
      title: 'Past Event',
      event_date: new Date('2020-01-01T10:00:00Z'),
      is_past: true
    };

    const result = await createSchoolEvent(pastEventInput);

    expect(result.is_past).toEqual(true);
    
    // Verify in database
    const events = await db.select()
      .from(schoolEventsTable)
      .where(eq(schoolEventsTable.id, result.id))
      .execute();

    expect(events[0].is_past).toEqual(true);
  });

  it('should handle event dates correctly', async () => {
    const futureDate = new Date('2025-12-25T15:30:00Z');
    const futureEventInput: CreateSchoolEventInput = {
      ...testInput,
      event_date: futureDate
    };

    const result = await createSchoolEvent(futureEventInput);

    expect(result.event_date).toEqual(futureDate);

    // Test date filtering - demonstration of correct date handling
    const today = new Date();
    
    const futureEvents = await db.select()
      .from(schoolEventsTable)
      .where(gte(schoolEventsTable.event_date, today))
      .execute();

    expect(futureEvents.length).toBeGreaterThan(0);
    futureEvents.forEach(event => {
      expect(event.event_date).toBeInstanceOf(Date);
      expect(event.event_date >= today).toBe(true);
    });
  });
});
