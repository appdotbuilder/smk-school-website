
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { programsTable } from '../db/schema';
import { type CreateProgramInput, type IdParam } from '../schema';
import { deleteProgram } from '../handlers/delete_program';
import { eq } from 'drizzle-orm';

// Test program input
const testProgramInput: CreateProgramInput = {
  name: 'Test Program',
  description: 'A program for testing deletion',
  duration_years: 4,
  requirements: 'Test requirements'
};

describe('deleteProgram', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete an existing program', async () => {
    // Create a program to delete
    const createdProgram = await db.insert(programsTable)
      .values(testProgramInput)
      .returning()
      .execute();

    const programId = createdProgram[0].id;
    const input: IdParam = { id: programId };

    // Delete the program
    const result = await deleteProgram(input);

    expect(result.success).toBe(true);

    // Verify the program was deleted
    const programs = await db.select()
      .from(programsTable)
      .where(eq(programsTable.id, programId))
      .execute();

    expect(programs).toHaveLength(0);
  });

  it('should return success false when program does not exist', async () => {
    const input: IdParam = { id: 999 }; // Non-existent ID

    const result = await deleteProgram(input);

    expect(result.success).toBe(false);
  });

  it('should not affect other programs when deleting one', async () => {
    // Create two programs
    const program1 = await db.insert(programsTable)
      .values({
        ...testProgramInput,
        name: 'Program 1'
      })
      .returning()
      .execute();

    const program2 = await db.insert(programsTable)
      .values({
        ...testProgramInput,
        name: 'Program 2'
      })
      .returning()
      .execute();

    // Delete the first program
    const input: IdParam = { id: program1[0].id };
    const result = await deleteProgram(input);

    expect(result.success).toBe(true);

    // Verify only the first program was deleted
    const remainingPrograms = await db.select()
      .from(programsTable)
      .execute();

    expect(remainingPrograms).toHaveLength(1);
    expect(remainingPrograms[0].id).toBe(program2[0].id);
    expect(remainingPrograms[0].name).toBe('Program 2');
  });
});
