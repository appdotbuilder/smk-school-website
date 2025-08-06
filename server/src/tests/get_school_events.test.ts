
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { schoolEventsTable } from '../db/schema';
import { getSchoolEvents } from '../handlers/get_school_events';

// Test data
const testEvent1 = {
  title: 'Annual Science Fair',
  description: 'A showcase of student science projects',
  event_date: new Date('2024-06-15'),
  location: 'Main Auditorium',
  is_past: false
};

const testEvent2 = {
  title: 'Graduation Ceremony',
  description: 'Celebration of graduating students',
  event_date: new Date('2024-07-20'),
  location: 'Sports Complex',
  is_past: false
};

describe('getSchoolEvents', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no events exist', async () => {
    const result = await getSchoolEvents();
    
    expect(result).toEqual([]);
  });

  it('should return all school events', async () => {
    // Create test events
    await db.insert(schoolEventsTable)
      .values([testEvent1, testEvent2])
      .execute();

    const result = await getSchoolEvents();

    expect(result).toHaveLength(2);
    
    // Check first event
    const event1 = result.find(e => e.title === 'Annual Science Fair');
    expect(event1).toBeDefined();
    expect(event1!.description).toEqual('A showcase of student science projects');
    expect(event1!.location).toEqual('Main Auditorium');
    expect(event1!.is_past).toEqual(false);
    expect(event1!.event_date).toBeInstanceOf(Date);
    expect(event1!.created_at).toBeInstanceOf(Date);
    expect(event1!.updated_at).toBeInstanceOf(Date);
    expect(event1!.id).toBeDefined();

    // Check second event
    const event2 = result.find(e => e.title === 'Graduation Ceremony');
    expect(event2).toBeDefined();
    expect(event2!.description).toEqual('Celebration of graduating students');
    expect(event2!.location).toEqual('Sports Complex');
    expect(event2!.is_past).toEqual(false);
    expect(event2!.event_date).toBeInstanceOf(Date);
  });

  it('should handle events with null location', async () => {
    const eventWithoutLocation = {
      title: 'Online Workshop',
      description: 'Virtual learning session',
      event_date: new Date('2024-08-10'),
      location: null,
      is_past: false
    };

    await db.insert(schoolEventsTable)
      .values(eventWithoutLocation)
      .execute();

    const result = await getSchoolEvents();

    expect(result).toHaveLength(1);
    expect(result[0].title).toEqual('Online Workshop');
    expect(result[0].location).toBeNull();
  });

  it('should return events with past status correctly', async () => {
    const pastEvent = {
      title: 'Past Event',
      description: 'An event that already happened',
      event_date: new Date('2023-12-01'),
      location: 'Library',
      is_past: true
    };

    await db.insert(schoolEventsTable)
      .values(pastEvent)
      .execute();

    const result = await getSchoolEvents();

    expect(result).toHaveLength(1);
    expect(result[0].title).toEqual('Past Event');
    expect(result[0].is_past).toEqual(true);
  });
});
