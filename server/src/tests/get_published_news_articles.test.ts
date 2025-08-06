
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { newsArticlesTable } from '../db/schema';
import { type CreateNewsArticleInput } from '../schema';
import { getPublishedNewsArticles } from '../handlers/get_published_news_articles';

// Test inputs for published and unpublished articles
const publishedArticleInput: CreateNewsArticleInput = {
  title: 'Published News Article',
  content: 'This is a published news article content',
  excerpt: 'Published article excerpt',
  author: 'Test Author',
  published_at: new Date(),
  is_published: true
};

const unpublishedArticleInput: CreateNewsArticleInput = {
  title: 'Unpublished News Article',
  content: 'This is an unpublished news article content',
  excerpt: 'Unpublished article excerpt',
  author: 'Test Author',
  published_at: new Date(),
  is_published: false
};

describe('getPublishedNewsArticles', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return only published news articles', async () => {
    // Create both published and unpublished articles
    await db.insert(newsArticlesTable)
      .values([
        {
          title: publishedArticleInput.title,
          content: publishedArticleInput.content,
          excerpt: publishedArticleInput.excerpt,
          author: publishedArticleInput.author,
          published_at: publishedArticleInput.published_at,
          is_published: publishedArticleInput.is_published
        },
        {
          title: unpublishedArticleInput.title,
          content: unpublishedArticleInput.content,
          excerpt: unpublishedArticleInput.excerpt,
          author: unpublishedArticleInput.author,
          published_at: unpublishedArticleInput.published_at,
          is_published: unpublishedArticleInput.is_published
        }
      ])
      .execute();

    const result = await getPublishedNewsArticles();

    expect(result).toHaveLength(1);
    expect(result[0].title).toEqual('Published News Article');
    expect(result[0].content).toEqual(publishedArticleInput.content);
    expect(result[0].is_published).toBe(true);
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
    expect(result[0].updated_at).toBeInstanceOf(Date);
  });

  it('should return empty array when no published articles exist', async () => {
    // Create only unpublished articles
    await db.insert(newsArticlesTable)
      .values({
        title: unpublishedArticleInput.title,
        content: unpublishedArticleInput.content,
        excerpt: unpublishedArticleInput.excerpt,
        author: unpublishedArticleInput.author,
        published_at: unpublishedArticleInput.published_at,
        is_published: unpublishedArticleInput.is_published
      })
      .execute();

    const result = await getPublishedNewsArticles();

    expect(result).toHaveLength(0);
  });

  it('should return multiple published articles when they exist', async () => {
    // Create multiple published articles
    await db.insert(newsArticlesTable)
      .values([
        {
          title: 'First Published Article',
          content: 'First article content',
          excerpt: 'First excerpt',
          author: 'Author One',
          published_at: new Date(),
          is_published: true
        },
        {
          title: 'Second Published Article',
          content: 'Second article content',
          excerpt: 'Second excerpt',
          author: 'Author Two',
          published_at: new Date(),
          is_published: true
        },
        {
          title: 'Unpublished Article',
          content: 'Unpublished content',
          excerpt: 'Unpublished excerpt',
          author: 'Author Three',
          published_at: new Date(),
          is_published: false
        }
      ])
      .execute();

    const result = await getPublishedNewsArticles();

    expect(result).toHaveLength(2);
    
    // Verify all returned articles are published
    result.forEach(article => {
      expect(article.is_published).toBe(true);
      expect(article.id).toBeDefined();
      expect(article.created_at).toBeInstanceOf(Date);
      expect(article.updated_at).toBeInstanceOf(Date);
    });

    // Check specific titles
    const titles = result.map(article => article.title);
    expect(titles).toContain('First Published Article');
    expect(titles).toContain('Second Published Article');
    expect(titles).not.toContain('Unpublished Article');
  });
});
