
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { programsTable } from '../db/schema';
import { type CreateProgramInput } from '../schema';
import { createProgram } from '../handlers/create_program';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateProgramInput = {
  name: 'Computer Science',
  description: 'A comprehensive program in computer science and software engineering',
  duration_years: 4,
  requirements: 'High school diploma with strong math background'
};

describe('createProgram', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a program', async () => {
    const result = await createProgram(testInput);

    // Basic field validation
    expect(result.name).toEqual('Computer Science');
    expect(result.description).toEqual(testInput.description);
    expect(result.duration_years).toEqual(4);
    expect(result.requirements).toEqual(testInput.requirements);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save program to database', async () => {
    const result = await createProgram(testInput);

    // Query using proper drizzle syntax
    const programs = await db.select()
      .from(programsTable)
      .where(eq(programsTable.id, result.id))
      .execute();

    expect(programs).toHaveLength(1);
    expect(programs[0].name).toEqual('Computer Science');
    expect(programs[0].description).toEqual(testInput.description);
    expect(programs[0].duration_years).toEqual(4);
    expect(programs[0].requirements).toEqual(testInput.requirements);
    expect(programs[0].created_at).toBeInstanceOf(Date);
    expect(programs[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create program with null requirements', async () => {
    const inputWithNullRequirements: CreateProgramInput = {
      name: 'Art History',
      description: 'Study of art through historical periods',
      duration_years: 3,
      requirements: null
    };

    const result = await createProgram(inputWithNullRequirements);

    expect(result.name).toEqual('Art History');
    expect(result.description).toEqual(inputWithNullRequirements.description);
    expect(result.duration_years).toEqual(3);
    expect(result.requirements).toBeNull();
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create multiple programs with unique IDs', async () => {
    const firstProgram = await createProgram(testInput);
    
    const secondInput: CreateProgramInput = {
      name: 'Business Administration',
      description: 'Comprehensive business management program',
      duration_years: 4,
      requirements: 'High school diploma'
    };
    
    const secondProgram = await createProgram(secondInput);

    expect(firstProgram.id).not.toEqual(secondProgram.id);
    expect(firstProgram.name).toEqual('Computer Science');
    expect(secondProgram.name).toEqual('Business Administration');

    // Verify both are in database
    const programs = await db.select()
      .from(programsTable)
      .execute();

    expect(programs).toHaveLength(2);
  });
});
