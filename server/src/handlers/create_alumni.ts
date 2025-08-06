
import { db } from '../db';
import { alumniTable } from '../db/schema';
import { type CreateAlumniInput, type Alumni } from '../schema';

export const createAlumni = async (input: CreateAlumniInput): Promise<Alumni> => {
  try {
    // Insert alumni record
    const result = await db.insert(alumniTable)
      .values({
        name: input.name,
        graduation_year: input.graduation_year,
        major: input.major,
        current_position: input.current_position,
        company: input.company,
        contact_email: input.contact_email,
        bio: input.bio
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Alumni creation failed:', error);
    throw error;
  }
};
