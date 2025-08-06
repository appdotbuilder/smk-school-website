
import { db } from '../db';
import { programsTable } from '../db/schema';
import { type CreateProgramInput, type Program } from '../schema';

export const createProgram = async (input: CreateProgramInput): Promise<Program> => {
  try {
    // Insert program record
    const result = await db.insert(programsTable)
      .values({
        name: input.name,
        description: input.description,
        duration_years: input.duration_years,
        requirements: input.requirements
      })
      .returning()
      .execute();

    // Return the created program
    const program = result[0];
    return program;
  } catch (error) {
    console.error('Program creation failed:', error);
    throw error;
  }
};
