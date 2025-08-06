
import { db } from '../db';
import { newsArticlesTable } from '../db/schema';
import { type NewsArticle } from '../schema';
import { desc } from 'drizzle-orm';

export const getNewsArticles = async (): Promise<NewsArticle[]> => {
  try {
    const result = await db.select()
      .from(newsArticlesTable)
      .orderBy(desc(newsArticlesTable.published_at))
      .execute();

    return result;
  } catch (error) {
    console.error('News articles retrieval failed:', error);
    throw error;
  }
};
