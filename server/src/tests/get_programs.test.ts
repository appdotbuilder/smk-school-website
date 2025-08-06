
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { programsTable } from '../db/schema';
import { type CreateProgramInput } from '../schema';
import { getPrograms } from '../handlers/get_programs';

// Test program data
const testProgram1: CreateProgramInput = {
  name: 'Computer Science',
  description: 'A comprehensive program covering software development and algorithms',
  duration_years: 4,
  requirements: 'High school diploma, Mathematics proficiency'
};

const testProgram2: CreateProgramInput = {
  name: 'Business Administration',
  description: 'Management and business strategy program',
  duration_years: 3,
  requirements: null
};

describe('getPrograms', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no programs exist', async () => {
    const result = await getPrograms();

    expect(result).toEqual([]);
  });

  it('should return all programs', async () => {
    // Create test programs
    await db.insert(programsTable)
      .values([testProgram1, testProgram2])
      .execute();

    const result = await getPrograms();

    expect(result).toHaveLength(2);
    
    // Check first program
    const program1 = result.find(p => p.name === 'Computer Science');
    expect(program1).toBeDefined();
    expect(program1!.description).toEqual(testProgram1.description);
    expect(program1!.duration_years).toEqual(4);
    expect(program1!.requirements).toEqual(testProgram1.requirements);
    expect(program1!.id).toBeDefined();
    expect(program1!.created_at).toBeInstanceOf(Date);
    expect(program1!.updated_at).toBeInstanceOf(Date);

    // Check second program
    const program2 = result.find(p => p.name === 'Business Administration');
    expect(program2).toBeDefined();
    expect(program2!.description).toEqual(testProgram2.description);
    expect(program2!.duration_years).toEqual(3);
    expect(program2!.requirements).toBeNull();
    expect(program2!.id).toBeDefined();
    expect(program2!.created_at).toBeInstanceOf(Date);
    expect(program2!.updated_at).toBeInstanceOf(Date);
  });

  it('should return programs with all required fields', async () => {
    // Create single test program
    await db.insert(programsTable)
      .values(testProgram1)
      .execute();

    const result = await getPrograms();

    expect(result).toHaveLength(1);
    const program = result[0];

    // Verify all fields are present
    expect(typeof program.id).toBe('number');
    expect(typeof program.name).toBe('string');
    expect(typeof program.description).toBe('string');
    expect(typeof program.duration_years).toBe('number');
    expect(program.requirements === null || typeof program.requirements === 'string').toBe(true);
    expect(program.created_at).toBeInstanceOf(Date);
    expect(program.updated_at).toBeInstanceOf(Date);
  });
});
