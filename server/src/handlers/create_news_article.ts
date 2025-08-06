
import { db } from '../db';
import { newsArticlesTable } from '../db/schema';
import { type CreateNewsArticleInput, type NewsArticle } from '../schema';

export const createNewsArticle = async (input: CreateNewsArticleInput): Promise<NewsArticle> => {
  try {
    // Insert news article record
    const result = await db.insert(newsArticlesTable)
      .values({
        title: input.title,
        content: input.content,
        excerpt: input.excerpt,
        author: input.author,
        published_at: input.published_at || new Date(),
        is_published: input.is_published
      })
      .returning()
      .execute();

    const newsArticle = result[0];
    return newsArticle;
  } catch (error) {
    console.error('News article creation failed:', error);
    throw error;
  }
};
