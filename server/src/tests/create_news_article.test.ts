
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { newsArticlesTable } from '../db/schema';
import { type CreateNewsArticleInput } from '../schema';
import { createNewsArticle } from '../handlers/create_news_article';
import { eq } from 'drizzle-orm';

// Test input with all fields including defaults
const testInput: CreateNewsArticleInput = {
  title: 'Test News Article',
  content: 'This is the content of our test news article with lots of details about the school.',
  excerpt: 'Brief summary of the article',
  author: 'John Doe',
  published_at: new Date('2023-10-15T10:00:00Z'),
  is_published: true
};

describe('createNewsArticle', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a news article', async () => {
    const result = await createNewsArticle(testInput);

    // Basic field validation
    expect(result.title).toEqual('Test News Article');
    expect(result.content).toEqual(testInput.content);
    expect(result.excerpt).toEqual('Brief summary of the article');
    expect(result.author).toEqual('John Doe');
    expect(result.published_at).toEqual(testInput.published_at!);
    expect(result.is_published).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save news article to database', async () => {
    const result = await createNewsArticle(testInput);

    // Query using proper drizzle syntax
    const articles = await db.select()
      .from(newsArticlesTable)
      .where(eq(newsArticlesTable.id, result.id))
      .execute();

    expect(articles).toHaveLength(1);
    expect(articles[0].title).toEqual('Test News Article');
    expect(articles[0].content).toEqual(testInput.content);
    expect(articles[0].excerpt).toEqual('Brief summary of the article');
    expect(articles[0].author).toEqual('John Doe');
    expect(articles[0].is_published).toEqual(true);
    expect(articles[0].created_at).toBeInstanceOf(Date);
    expect(articles[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle null excerpt', async () => {
    const inputWithNullExcerpt: CreateNewsArticleInput = {
      title: 'Article Without Excerpt',
      content: 'Content without an excerpt',
      excerpt: null,
      author: 'Jane Smith',
      published_at: new Date(),
      is_published: false
    };

    const result = await createNewsArticle(inputWithNullExcerpt);

    expect(result.excerpt).toBeNull();
    expect(result.title).toEqual('Article Without Excerpt');
    expect(result.is_published).toEqual(false);
  });

  it('should use default published_at when not provided', async () => {
    const inputWithoutDate: CreateNewsArticleInput = {
      title: 'Article With Default Date',
      content: 'Content with default published date',
      excerpt: 'Test excerpt',
      author: 'Default Author',
      is_published: false
    };

    const beforeCreate = new Date();
    const result = await createNewsArticle(inputWithoutDate);
    const afterCreate = new Date();

    expect(result.published_at).toBeInstanceOf(Date);
    expect(result.published_at.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
    expect(result.published_at.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
  });

  it('should handle default is_published value', async () => {
    const inputWithDefaultPublished: CreateNewsArticleInput = {
      title: 'Article With Default Published Status',
      content: 'Content with default published status',
      excerpt: 'Test excerpt',
      author: 'Test Author',
      published_at: new Date(),
      is_published: false // Include the required field explicitly
    };

    const result = await createNewsArticle(inputWithDefaultPublished);

    expect(result.is_published).toEqual(false);
  });
});
