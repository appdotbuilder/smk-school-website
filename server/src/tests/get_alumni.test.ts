
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { alumniTable } from '../db/schema';
import { type CreateAlumniInput } from '../schema';
import { getAlumni } from '../handlers/get_alumni';

// Test alumni data
const testAlumni: CreateAlumniInput[] = [
  {
    name: 'John Smith',
    graduation_year: 2020,
    major: 'Computer Science',
    current_position: 'Software Engineer',
    company: 'Tech Corp',
    contact_email: 'john.smith@email.com',
    bio: 'Passionate software developer'
  },
  {
    name: 'Jane Doe',
    graduation_year: 2022,
    major: 'Business Administration',
    current_position: 'Marketing Manager',
    company: 'Business Inc',
    contact_email: 'jane.doe@email.com',
    bio: 'Marketing professional with 2 years experience'
  },
  {
    name: 'Bob Wilson',
    graduation_year: 2019,
    major: 'Engineering',
    current_position: null,
    company: null,
    contact_email: null,
    bio: null
  }
];

describe('getAlumni', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no alumni exist', async () => {
    const result = await getAlumni();

    expect(result).toEqual([]);
  });

  it('should fetch all alumni', async () => {
    // Insert test alumni
    await db.insert(alumniTable)
      .values(testAlumni)
      .execute();

    const result = await getAlumni();

    expect(result).toHaveLength(3);
    expect(result[0].name).toEqual('Jane Doe');
    expect(result[0].graduation_year).toEqual(2022);
    expect(result[0].major).toEqual('Business Administration');
    expect(result[0].current_position).toEqual('Marketing Manager');
    expect(result[0].company).toEqual('Business Inc');
    expect(result[0].contact_email).toEqual('jane.doe@email.com');
    expect(result[0].bio).toEqual('Marketing professional with 2 years experience');
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
    expect(result[0].updated_at).toBeInstanceOf(Date);
  });

  it('should return alumni ordered by graduation year descending', async () => {
    // Insert test alumni
    await db.insert(alumniTable)
      .values(testAlumni)
      .execute();

    const result = await getAlumni();

    expect(result).toHaveLength(3);
    // Should be ordered by graduation_year DESC: 2022, 2020, 2019
    expect(result[0].graduation_year).toEqual(2022);
    expect(result[1].graduation_year).toEqual(2020);
    expect(result[2].graduation_year).toEqual(2019);
  });

  it('should handle alumni with null values', async () => {
    // Insert test alumni
    await db.insert(alumniTable)
      .values(testAlumni)
      .execute();

    const result = await getAlumni();

    // Find Bob Wilson (has null values)
    const bobWilson = result.find(alumni => alumni.name === 'Bob Wilson');
    expect(bobWilson).toBeDefined();
    expect(bobWilson!.current_position).toBeNull();
    expect(bobWilson!.company).toBeNull();
    expect(bobWilson!.contact_email).toBeNull();
    expect(bobWilson!.bio).toBeNull();
  });

  it('should include all required fields', async () => {
    // Insert single alumni
    await db.insert(alumniTable)
      .values([testAlumni[0]])
      .execute();

    const result = await getAlumni();

    expect(result).toHaveLength(1);
    const alumni = result[0];
    
    // Check all required fields are present
    expect(typeof alumni.id).toBe('number');
    expect(typeof alumni.name).toBe('string');
    expect(typeof alumni.graduation_year).toBe('number');
    expect(typeof alumni.major).toBe('string');
    expect(alumni.created_at).toBeInstanceOf(Date);
    expect(alumni.updated_at).toBeInstanceOf(Date);
  });
});
