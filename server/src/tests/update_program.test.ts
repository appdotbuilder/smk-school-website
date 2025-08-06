
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { programsTable } from '../db/schema';
import { type UpdateProgramInput } from '../schema';
import { updateProgram } from '../handlers/update_program';
import { eq } from 'drizzle-orm';

describe('updateProgram', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update a program with all fields', async () => {
    // Create initial program
    const initialProgram = await db.insert(programsTable)
      .values({
        name: 'Original Program',
        description: 'Original description',
        duration_years: 3,
        requirements: 'Original requirements'
      })
      .returning()
      .execute();

    const programId = initialProgram[0].id;

    const updateInput: UpdateProgramInput = {
      id: programId,
      name: 'Updated Program',
      description: 'Updated description',
      duration_years: 4,
      requirements: 'Updated requirements'
    };

    const result = await updateProgram(updateInput);

    expect(result.id).toEqual(programId);
    expect(result.name).toEqual('Updated Program');
    expect(result.description).toEqual('Updated description');
    expect(result.duration_years).toEqual(4);
    expect(result.requirements).toEqual('Updated requirements');
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should update only provided fields', async () => {
    // Create initial program
    const initialProgram = await db.insert(programsTable)
      .values({
        name: 'Original Program',
        description: 'Original description',
        duration_years: 3,
        requirements: 'Original requirements'
      })
      .returning()
      .execute();

    const programId = initialProgram[0].id;

    const updateInput: UpdateProgramInput = {
      id: programId,
      name: 'Updated Name Only'
    };

    const result = await updateProgram(updateInput);

    expect(result.id).toEqual(programId);
    expect(result.name).toEqual('Updated Name Only');
    expect(result.description).toEqual('Original description'); // Should remain unchanged
    expect(result.duration_years).toEqual(3); // Should remain unchanged
    expect(result.requirements).toEqual('Original requirements'); // Should remain unchanged
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save updated program to database', async () => {
    // Create initial program
    const initialProgram = await db.insert(programsTable)
      .values({
        name: 'Original Program',
        description: 'Original description',
        duration_years: 3,
        requirements: 'Original requirements'
      })
      .returning()
      .execute();

    const programId = initialProgram[0].id;

    const updateInput: UpdateProgramInput = {
      id: programId,
      name: 'Database Test Program',
      duration_years: 5
    };

    await updateProgram(updateInput);

    // Verify in database
    const programs = await db.select()
      .from(programsTable)
      .where(eq(programsTable.id, programId))
      .execute();

    expect(programs).toHaveLength(1);
    expect(programs[0].name).toEqual('Database Test Program');
    expect(programs[0].duration_years).toEqual(5);
    expect(programs[0].description).toEqual('Original description'); // Unchanged
  });

  it('should update requirements to null', async () => {
    // Create initial program with requirements
    const initialProgram = await db.insert(programsTable)
      .values({
        name: 'Test Program',
        description: 'Test description',
        duration_years: 3,
        requirements: 'Some requirements'
      })
      .returning()
      .execute();

    const programId = initialProgram[0].id;

    const updateInput: UpdateProgramInput = {
      id: programId,
      requirements: null
    };

    const result = await updateProgram(updateInput);

    expect(result.requirements).toBeNull();
  });

  it('should throw error when program not found', async () => {
    const updateInput: UpdateProgramInput = {
      id: 999999, // Non-existent ID
      name: 'Non-existent Program'
    };

    expect(updateProgram(updateInput)).rejects.toThrow(/not found/i);
  });

  it('should update updated_at timestamp', async () => {
    // Create initial program
    const initialProgram = await db.insert(programsTable)
      .values({
        name: 'Test Program',
        description: 'Test description',
        duration_years: 3,
        requirements: null
      })
      .returning()
      .execute();

    const programId = initialProgram[0].id;
    const originalUpdatedAt = initialProgram[0].updated_at;

    // Wait a moment to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    const updateInput: UpdateProgramInput = {
      id: programId,
      name: 'Updated Program'
    };

    const result = await updateProgram(updateInput);

    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
  });
});
