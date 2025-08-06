
import { db } from '../db';
import { programsTable } from '../db/schema';
import { type UpdateProgramInput, type Program } from '../schema';
import { eq } from 'drizzle-orm';

export const updateProgram = async (input: UpdateProgramInput): Promise<Program> => {
  try {
    // Build update object with only provided fields
    const updateData: Record<string, any> = {
      updated_at: new Date()
    };

    if (input.name !== undefined) {
      updateData['name'] = input.name;
    }
    if (input.description !== undefined) {
      updateData['description'] = input.description;
    }
    if (input.duration_years !== undefined) {
      updateData['duration_years'] = input.duration_years;
    }
    if (input.requirements !== undefined) {
      updateData['requirements'] = input.requirements;
    }

    // Update program record
    const result = await db.update(programsTable)
      .set(updateData)
      .where(eq(programsTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Program with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Program update failed:', error);
    throw error;
  }
};
