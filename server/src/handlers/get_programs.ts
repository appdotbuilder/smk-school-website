
import { db } from '../db';
import { programsTable } from '../db/schema';
import { type Program } from '../schema';

export const getPrograms = async (): Promise<Program[]> => {
  try {
    const results = await db.select()
      .from(programsTable)
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch programs:', error);
    throw error;
  }
};
