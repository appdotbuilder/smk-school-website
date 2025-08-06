
import { db } from '../db';
import { newsArticlesTable } from '../db/schema';
import { type NewsArticle } from '../schema';
import { eq } from 'drizzle-orm';

export const getPublishedNewsArticles = async (): Promise<NewsArticle[]> => {
  try {
    const results = await db.select()
      .from(newsArticlesTable)
      .where(eq(newsArticlesTable.is_published, true))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch published news articles:', error);
    throw error;
  }
};
