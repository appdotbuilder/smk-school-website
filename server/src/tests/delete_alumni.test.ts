
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { alumniTable } from '../db/schema';
import { type CreateAlumniInput, type IdParam } from '../schema';
import { deleteAlumni } from '../handlers/delete_alumni';
import { eq } from 'drizzle-orm';

// Test alumni data
const testAlumni: CreateAlumniInput = {
  name: 'John Smith',
  graduation_year: 2020,
  major: 'Computer Science',
  current_position: 'Software Engineer',
  company: 'Tech Corp',
  contact_email: 'john@example.com',
  bio: 'Passionate software engineer with 3 years experience'
};

describe('deleteAlumni', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete an existing alumni record', async () => {
    // Create test alumni first
    const createResult = await db.insert(alumniTable)
      .values({
        name: testAlumni.name,
        graduation_year: testAlumni.graduation_year,
        major: testAlumni.major,
        current_position: testAlumni.current_position,
        company: testAlumni.company,
        contact_email: testAlumni.contact_email,
        bio: testAlumni.bio
      })
      .returning()
      .execute();

    const alumni = createResult[0];

    // Delete the alumni
    const input: IdParam = { id: alumni.id };
    const result = await deleteAlumni(input);

    expect(result.success).toBe(true);
  });

  it('should remove alumni from database', async () => {
    // Create test alumni first
    const createResult = await db.insert(alumniTable)
      .values({
        name: testAlumni.name,
        graduation_year: testAlumni.graduation_year,
        major: testAlumni.major,
        current_position: testAlumni.current_position,
        company: testAlumni.company,
        contact_email: testAlumni.contact_email,
        bio: testAlumni.bio
      })
      .returning()
      .execute();

    const alumni = createResult[0];

    // Delete the alumni
    const input: IdParam = { id: alumni.id };
    await deleteAlumni(input);

    // Verify alumni is deleted from database
    const remainingAlumni = await db.select()
      .from(alumniTable)
      .where(eq(alumniTable.id, alumni.id))
      .execute();

    expect(remainingAlumni).toHaveLength(0);
  });

  it('should return false for non-existent alumni', async () => {
    // Attempt to delete non-existent alumni
    const input: IdParam = { id: 9999 };
    const result = await deleteAlumni(input);

    expect(result.success).toBe(false);
  });

  it('should not affect other alumni records', async () => {
    // Create multiple alumni
    const alumni1 = await db.insert(alumniTable)
      .values({
        name: 'John Smith',
        graduation_year: 2020,
        major: 'Computer Science',
        current_position: 'Software Engineer',
        company: 'Tech Corp',
        contact_email: 'john@example.com',
        bio: 'Software engineer'
      })
      .returning()
      .execute();

    const alumni2 = await db.insert(alumniTable)
      .values({
        name: 'Jane Doe',
        graduation_year: 2019,
        major: 'Business Administration',
        current_position: 'Manager',
        company: 'Business Inc',
        contact_email: 'jane@example.com',
        bio: 'Business manager'
      })
      .returning()
      .execute();

    // Delete first alumni
    const input: IdParam = { id: alumni1[0].id };
    await deleteAlumni(input);

    // Verify second alumni still exists
    const remainingAlumni = await db.select()
      .from(alumniTable)
      .where(eq(alumniTable.id, alumni2[0].id))
      .execute();

    expect(remainingAlumni).toHaveLength(1);
    expect(remainingAlumni[0].name).toBe('Jane Doe');
  });
});
