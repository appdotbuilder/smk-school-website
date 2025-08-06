
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { alumniTable } from '../db/schema';
import { type CreateAlumniInput, type UpdateAlumniInput } from '../schema';
import { updateAlumni } from '../handlers/update_alumni';
import { eq } from 'drizzle-orm';

// Test data for creating initial alumni record
const testAlumniInput: CreateAlumniInput = {
  name: 'John Smith',
  graduation_year: 2020,
  major: 'Computer Science',
  current_position: 'Software Engineer',
  company: 'Tech Corp',
  contact_email: 'john.smith@email.com',
  bio: 'Alumni bio description'
};

describe('updateAlumni', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update alumni fields', async () => {
    // Create initial alumni record
    const createResult = await db.insert(alumniTable)
      .values(testAlumniInput)
      .returning()
      .execute();
    
    const alumniId = createResult[0].id;

    // Update alumni
    const updateInput: UpdateAlumniInput = {
      id: alumniId,
      name: 'Jane Doe',
      graduation_year: 2021,
      major: 'Data Science',
      current_position: 'Data Scientist',
      company: 'AI Company',
      contact_email: 'jane.doe@email.com',
      bio: 'Updated bio description'
    };

    const result = await updateAlumni(updateInput);

    // Verify updated fields
    expect(result.id).toEqual(alumniId);
    expect(result.name).toEqual('Jane Doe');
    expect(result.graduation_year).toEqual(2021);
    expect(result.major).toEqual('Data Science');
    expect(result.current_position).toEqual('Data Scientist');
    expect(result.company).toEqual('AI Company');
    expect(result.contact_email).toEqual('jane.doe@email.com');
    expect(result.bio).toEqual('Updated bio description');
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should update only specified fields', async () => {
    // Create initial alumni record
    const createResult = await db.insert(alumniTable)
      .values(testAlumniInput)
      .returning()
      .execute();
    
    const alumniId = createResult[0].id;

    // Update only name and current_position
    const updateInput: UpdateAlumniInput = {
      id: alumniId,
      name: 'Updated Name',
      current_position: 'Senior Developer'
    };

    const result = await updateAlumni(updateInput);

    // Verify only specified fields were updated
    expect(result.id).toEqual(alumniId);
    expect(result.name).toEqual('Updated Name');
    expect(result.current_position).toEqual('Senior Developer');
    // Other fields should remain unchanged
    expect(result.graduation_year).toEqual(2020);
    expect(result.major).toEqual('Computer Science');
    expect(result.company).toEqual('Tech Corp');
    expect(result.contact_email).toEqual('john.smith@email.com');
    expect(result.bio).toEqual('Alumni bio description');
  });

  it('should save changes to database', async () => {
    // Create initial alumni record
    const createResult = await db.insert(alumniTable)
      .values(testAlumniInput)
      .returning()
      .execute();
    
    const alumniId = createResult[0].id;

    // Update alumni
    const updateInput: UpdateAlumniInput = {
      id: alumniId,
      name: 'Database Test',
      graduation_year: 2022
    };

    await updateAlumni(updateInput);

    // Verify changes were saved to database
    const savedAlumni = await db.select()
      .from(alumniTable)
      .where(eq(alumniTable.id, alumniId))
      .execute();

    expect(savedAlumni).toHaveLength(1);
    expect(savedAlumni[0].name).toEqual('Database Test');
    expect(savedAlumni[0].graduation_year).toEqual(2022);
    expect(savedAlumni[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle nullable fields correctly', async () => {
    // Create initial alumni record
    const createResult = await db.insert(alumniTable)
      .values(testAlumniInput)
      .returning()
      .execute();
    
    const alumniId = createResult[0].id;

    // Update with null values
    const updateInput: UpdateAlumniInput = {
      id: alumniId,
      current_position: null,
      company: null,
      contact_email: null,
      bio: null
    };

    const result = await updateAlumni(updateInput);

    // Verify nullable fields are set to null
    expect(result.current_position).toBeNull();
    expect(result.company).toBeNull();
    expect(result.contact_email).toBeNull();
    expect(result.bio).toBeNull();
    // Non-nullable fields should remain unchanged
    expect(result.name).toEqual('John Smith');
    expect(result.graduation_year).toEqual(2020);
    expect(result.major).toEqual('Computer Science');
  });

  it('should throw error when alumni not found', async () => {
    const updateInput: UpdateAlumniInput = {
      id: 99999,
      name: 'Non-existent Alumni'
    };

    await expect(updateAlumni(updateInput)).rejects.toThrow(/Alumni with id 99999 not found/i);
  });

  it('should update updated_at timestamp', async () => {
    // Create initial alumni record
    const createResult = await db.insert(alumniTable)
      .values(testAlumniInput)
      .returning()
      .execute();
    
    const alumniId = createResult[0].id;
    const originalUpdatedAt = createResult[0].updated_at;

    // Wait a small amount to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    // Update alumni
    const updateInput: UpdateAlumniInput = {
      id: alumniId,
      name: 'Updated Name'
    };

    const result = await updateAlumni(updateInput);

    // Verify updated_at was changed
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
  });
});
