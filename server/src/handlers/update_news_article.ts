
import { db } from '../db';
import { newsArticlesTable } from '../db/schema';
import { type UpdateNewsArticleInput, type NewsArticle } from '../schema';
import { eq } from 'drizzle-orm';

export const updateNewsArticle = async (input: UpdateNewsArticleInput): Promise<NewsArticle> => {
  try {
    // Build update data object with only provided fields
    const updateData: Record<string, any> = {
      updated_at: new Date()
    };

    if (input.title !== undefined) {
      updateData['title'] = input.title;
    }

    if (input.content !== undefined) {
      updateData['content'] = input.content;
    }

    if (input.excerpt !== undefined) {
      updateData['excerpt'] = input.excerpt;
    }

    if (input.author !== undefined) {
      updateData['author'] = input.author;
    }

    if (input.published_at !== undefined) {
      updateData['published_at'] = input.published_at;
    }

    if (input.is_published !== undefined) {
      updateData['is_published'] = input.is_published;
    }

    // Update the news article
    const result = await db.update(newsArticlesTable)
      .set(updateData)
      .where(eq(newsArticlesTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`News article with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('News article update failed:', error);
    throw error;
  }
};
