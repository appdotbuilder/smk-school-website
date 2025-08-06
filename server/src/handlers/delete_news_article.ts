
import { db } from '../db';
import { newsArticlesTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type IdParam } from '../schema';

export const deleteNewsArticle = async (input: IdParam): Promise<{ success: boolean }> => {
  try {
    // Delete the news article by ID
    const result = await db.delete(newsArticlesTable)
      .where(eq(newsArticlesTable.id, input.id))
      .execute();

    // Check if any rows were affected (article existed and was deleted)
    return { success: (result.rowCount ?? 0) > 0 };
  } catch (error) {
    console.error('News article deletion failed:', error);
    throw error;
  }
};
