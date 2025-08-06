
import { db } from '../db';
import { alumniTable } from '../db/schema';
import { type UpdateAlumniInput, type Alumni } from '../schema';
import { eq } from 'drizzle-orm';

export const updateAlumni = async (input: UpdateAlumniInput): Promise<Alumni> => {
  try {
    // Build update object with only provided fields
    const updateData: Partial<typeof alumniTable.$inferInsert> = {
      updated_at: new Date()
    };

    if (input.name !== undefined) {
      updateData.name = input.name;
    }

    if (input.graduation_year !== undefined) {
      updateData.graduation_year = input.graduation_year;
    }

    if (input.major !== undefined) {
      updateData.major = input.major;
    }

    if (input.current_position !== undefined) {
      updateData.current_position = input.current_position;
    }

    if (input.company !== undefined) {
      updateData.company = input.company;
    }

    if (input.contact_email !== undefined) {
      updateData.contact_email = input.contact_email;
    }

    if (input.bio !== undefined) {
      updateData.bio = input.bio;
    }

    // Update alumni record
    const result = await db.update(alumniTable)
      .set(updateData)
      .where(eq(alumniTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Alumni with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Alumni update failed:', error);
    throw error;
  }
};
