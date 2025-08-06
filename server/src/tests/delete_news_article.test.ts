
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { newsArticlesTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type IdParam, type CreateNewsArticleInput } from '../schema';
import { deleteNewsArticle } from '../handlers/delete_news_article';

// Test input for creating a news article
const testNewsArticle: CreateNewsArticleInput = {
  title: 'Test News Article',
  content: 'This is a test news article content',
  excerpt: 'Test excerpt',
  author: 'Test Author',
  published_at: new Date('2024-01-01'),
  is_published: true
};

describe('deleteNewsArticle', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete an existing news article', async () => {
    // Create a news article first
    const insertResult = await db.insert(newsArticlesTable)
      .values({
        title: testNewsArticle.title,
        content: testNewsArticle.content,
        excerpt: testNewsArticle.excerpt,
        author: testNewsArticle.author,
        published_at: testNewsArticle.published_at,
        is_published: testNewsArticle.is_published
      })
      .returning()
      .execute();

    const createdArticle = insertResult[0];
    const input: IdParam = { id: createdArticle.id };

    // Delete the news article
    const result = await deleteNewsArticle(input);

    expect(result.success).toBe(true);

    // Verify the article is deleted from database
    const articles = await db.select()
      .from(newsArticlesTable)
      .where(eq(newsArticlesTable.id, createdArticle.id))
      .execute();

    expect(articles).toHaveLength(0);
  });

  it('should return false when deleting non-existent news article', async () => {
    const input: IdParam = { id: 999999 };

    const result = await deleteNewsArticle(input);

    expect(result.success).toBe(false);
  });

  it('should not affect other news articles when deleting', async () => {
    // Create two news articles
    const article1 = await db.insert(newsArticlesTable)
      .values({
        title: 'Article 1',
        content: 'Content 1',
        excerpt: 'Excerpt 1',
        author: 'Author 1',
        published_at: new Date('2024-01-01'),
        is_published: true
      })
      .returning()
      .execute();

    const article2 = await db.insert(newsArticlesTable)
      .values({
        title: 'Article 2',
        content: 'Content 2',
        excerpt: 'Excerpt 2',
        author: 'Author 2',
        published_at: new Date('2024-01-02'),
        is_published: false
      })
      .returning()
      .execute();

    const input: IdParam = { id: article1[0].id };

    // Delete first article
    const result = await deleteNewsArticle(input);

    expect(result.success).toBe(true);

    // Verify first article is deleted
    const deletedArticles = await db.select()
      .from(newsArticlesTable)
      .where(eq(newsArticlesTable.id, article1[0].id))
      .execute();

    expect(deletedArticles).toHaveLength(0);

    // Verify second article still exists
    const remainingArticles = await db.select()
      .from(newsArticlesTable)
      .where(eq(newsArticlesTable.id, article2[0].id))
      .execute();

    expect(remainingArticles).toHaveLength(1);
    expect(remainingArticles[0].title).toBe('Article 2');
  });
});
