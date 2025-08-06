
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { alumniTable } from '../db/schema';
import { type CreateAlumniInput } from '../schema';
import { createAlumni } from '../handlers/create_alumni';
import { eq } from 'drizzle-orm';

// Test input with all fields
const testInput: CreateAlumniInput = {
  name: 'John Doe',
  graduation_year: 2020,
  major: 'Computer Science',
  current_position: 'Software Engineer',
  company: 'Tech Corp',
  contact_email: 'john.doe@example.com',
  bio: 'Experienced software engineer with focus on web development'
};

// Test input with minimal required fields
const minimalInput: CreateAlumniInput = {
  name: 'Jane Smith',
  graduation_year: 2019,
  major: 'Business Administration',
  current_position: null,
  company: null,
  contact_email: null,
  bio: null
};

describe('createAlumni', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create an alumni record with all fields', async () => {
    const result = await createAlumni(testInput);

    // Verify all fields are set correctly
    expect(result.name).toEqual('John Doe');
    expect(result.graduation_year).toEqual(2020);
    expect(result.major).toEqual('Computer Science');
    expect(result.current_position).toEqual('Software Engineer');
    expect(result.company).toEqual('Tech Corp');
    expect(result.contact_email).toEqual('john.doe@example.com');
    expect(result.bio).toEqual('Experienced software engineer with focus on web development');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create an alumni record with minimal fields', async () => {
    const result = await createAlumni(minimalInput);

    // Verify required fields
    expect(result.name).toEqual('Jane Smith');
    expect(result.graduation_year).toEqual(2019);
    expect(result.major).toEqual('Business Administration');
    
    // Verify nullable fields are null
    expect(result.current_position).toBeNull();
    expect(result.company).toBeNull();
    expect(result.contact_email).toBeNull();
    expect(result.bio).toBeNull();
    
    // Verify auto-generated fields
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save alumni record to database', async () => {
    const result = await createAlumni(testInput);

    // Query database to verify record was saved
    const savedRecords = await db.select()
      .from(alumniTable)
      .where(eq(alumniTable.id, result.id))
      .execute();

    expect(savedRecords).toHaveLength(1);
    const savedRecord = savedRecords[0];
    
    expect(savedRecord.name).toEqual('John Doe');
    expect(savedRecord.graduation_year).toEqual(2020);
    expect(savedRecord.major).toEqual('Computer Science');
    expect(savedRecord.current_position).toEqual('Software Engineer');
    expect(savedRecord.company).toEqual('Tech Corp');
    expect(savedRecord.contact_email).toEqual('john.doe@example.com');
    expect(savedRecord.bio).toEqual('Experienced software engineer with focus on web development');
    expect(savedRecord.created_at).toBeInstanceOf(Date);
    expect(savedRecord.updated_at).toBeInstanceOf(Date);
  });

  it('should handle valid graduation year boundaries', async () => {
    // Test minimum valid year
    const earlyGradInput: CreateAlumniInput = {
      name: 'Early Graduate',
      graduation_year: 1950,
      major: 'History',
      current_position: null,
      company: null,
      contact_email: null,
      bio: null
    };

    const earlyResult = await createAlumni(earlyGradInput);
    expect(earlyResult.graduation_year).toEqual(1950);

    // Test current year
    const currentYear = new Date().getFullYear();
    const recentGradInput: CreateAlumniInput = {
      name: 'Recent Graduate',
      graduation_year: currentYear,
      major: 'Engineering',
      current_position: null,
      company: null,
      contact_email: null,
      bio: null
    };

    const recentResult = await createAlumni(recentGradInput);
    expect(recentResult.graduation_year).toEqual(currentYear);
  });
});
