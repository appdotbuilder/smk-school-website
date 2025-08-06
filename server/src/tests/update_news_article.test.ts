
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { newsArticlesTable } from '../db/schema';
import { type CreateNewsArticleInput, type UpdateNewsArticleInput } from '../schema';
import { updateNewsArticle } from '../handlers/update_news_article';
import { eq } from 'drizzle-orm';

// Helper to create a test news article
const createTestArticle = async (): Promise<number> => {
  const testInput: CreateNewsArticleInput = {
    title: 'Original Title',
    content: 'Original content for the news article',
    excerpt: 'Original excerpt',
    author: 'Original Author',
    published_at: new Date('2024-01-01T10:00:00Z'),
    is_published: false
  };

  const result = await db.insert(newsArticlesTable)
    .values({
      ...testInput,
      published_at: testInput.published_at || new Date()
    })
    .returning()
    .execute();

  return result[0].id;
};

describe('updateNewsArticle', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update a news article with all fields', async () => {
    const articleId = await createTestArticle();
    const newDate = new Date('2024-02-01T15:00:00Z');

    const updateInput: UpdateNewsArticleInput = {
      id: articleId,
      title: 'Updated Title',
      content: 'Updated content for the news article',
      excerpt: 'Updated excerpt',
      author: 'Updated Author',
      published_at: newDate,
      is_published: true
    };

    const result = await updateNewsArticle(updateInput);

    expect(result.id).toEqual(articleId);
    expect(result.title).toEqual('Updated Title');
    expect(result.content).toEqual('Updated content for the news article');
    expect(result.excerpt).toEqual('Updated excerpt');
    expect(result.author).toEqual('Updated Author');
    expect(result.published_at).toEqual(newDate);
    expect(result.is_published).toEqual(true);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update only specified fields', async () => {
    const articleId = await createTestArticle();

    const updateInput: UpdateNewsArticleInput = {
      id: articleId,
      title: 'Partial Update Title',
      is_published: true
    };

    const result = await updateNewsArticle(updateInput);

    expect(result.id).toEqual(articleId);
    expect(result.title).toEqual('Partial Update Title');
    expect(result.content).toEqual('Original content for the news article');
    expect(result.excerpt).toEqual('Original excerpt');
    expect(result.author).toEqual('Original Author');
    expect(result.is_published).toEqual(true);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update null fields correctly', async () => {
    const articleId = await createTestArticle();

    const updateInput: UpdateNewsArticleInput = {
      id: articleId,
      excerpt: null
    };

    const result = await updateNewsArticle(updateInput);

    expect(result.id).toEqual(articleId);
    expect(result.excerpt).toBeNull();
    expect(result.title).toEqual('Original Title');
    expect(result.content).toEqual('Original content for the news article');
  });

  it('should persist changes to database', async () => {
    const articleId = await createTestArticle();

    const updateInput: UpdateNewsArticleInput = {
      id: articleId,
      title: 'Database Test Title',
      is_published: true
    };

    await updateNewsArticle(updateInput);

    // Verify changes are persisted
    const articles = await db.select()
      .from(newsArticlesTable)
      .where(eq(newsArticlesTable.id, articleId))
      .execute();

    expect(articles).toHaveLength(1);
    expect(articles[0].title).toEqual('Database Test Title');
    expect(articles[0].is_published).toEqual(true);
    expect(articles[0].updated_at).toBeInstanceOf(Date);
  });

  it('should throw error for non-existent article', async () => {
    const updateInput: UpdateNewsArticleInput = {
      id: 999999,
      title: 'Non-existent Article'
    };

    await expect(updateNewsArticle(updateInput)).rejects.toThrow(/not found/i);
  });

  it('should update the updated_at timestamp', async () => {
    const articleId = await createTestArticle();

    // Get original timestamp
    const originalArticle = await db.select()
      .from(newsArticlesTable)
      .where(eq(newsArticlesTable.id, articleId))
      .execute();

    // Wait a moment to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    const updateInput: UpdateNewsArticleInput = {
      id: articleId,
      title: 'Timestamp Test'
    };

    const result = await updateNewsArticle(updateInput);

    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(originalArticle[0].updated_at.getTime());
  });
});
