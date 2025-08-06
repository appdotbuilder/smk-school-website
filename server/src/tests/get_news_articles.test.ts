
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { newsArticlesTable } from '../db/schema';
import { type CreateNewsArticleInput } from '../schema';
import { getNewsArticles } from '../handlers/get_news_articles';

// Test inputs for creating news articles
const testArticle1: CreateNewsArticleInput = {
  title: 'First News Article',
  content: 'This is the content of the first news article.',
  excerpt: 'First article excerpt',
  author: 'John Doe',
  published_at: new Date('2023-01-15'),
  is_published: true
};

const testArticle2: CreateNewsArticleInput = {
  title: 'Second News Article',
  content: 'This is the content of the second news article.',
  excerpt: 'Second article excerpt',
  author: 'Jane Smith',
  published_at: new Date('2023-02-20'),
  is_published: false
};

const testArticle3: CreateNewsArticleInput = {
  title: 'Third News Article',
  content: 'This is the content of the third news article.',
  excerpt: null,
  author: 'Bob Wilson',
  published_at: new Date('2023-03-10'),
  is_published: true
};

describe('getNewsArticles', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no news articles exist', async () => {
    const result = await getNewsArticles();

    expect(result).toEqual([]);
  });

  it('should return all news articles', async () => {
    // Create test news articles
    await db.insert(newsArticlesTable)
      .values([
        {
          title: testArticle1.title,
          content: testArticle1.content,
          excerpt: testArticle1.excerpt,
          author: testArticle1.author,
          published_at: testArticle1.published_at,
          is_published: testArticle1.is_published
        },
        {
          title: testArticle2.title,
          content: testArticle2.content,
          excerpt: testArticle2.excerpt,
          author: testArticle2.author,
          published_at: testArticle2.published_at,
          is_published: testArticle2.is_published
        },
        {
          title: testArticle3.title,
          content: testArticle3.content,
          excerpt: testArticle3.excerpt,
          author: testArticle3.author,
          published_at: testArticle3.published_at,
          is_published: testArticle3.is_published
        }
      ])
      .execute();

    const result = await getNewsArticles();

    expect(result).toHaveLength(3);
    
    // Verify all articles are returned with correct data
    const titles = result.map(article => article.title);
    expect(titles).toContain('First News Article');
    expect(titles).toContain('Second News Article');
    expect(titles).toContain('Third News Article');
    
    // Verify structure of returned data
    result.forEach(article => {
      expect(article.id).toBeDefined();
      expect(article.title).toBeDefined();
      expect(article.content).toBeDefined();
      expect(article.author).toBeDefined();
      expect(article.published_at).toBeInstanceOf(Date);
      expect(typeof article.is_published).toBe('boolean');
      expect(article.created_at).toBeInstanceOf(Date);
      expect(article.updated_at).toBeInstanceOf(Date);
    });
  });

  it('should return news articles ordered by published_at descending', async () => {
    // Create test news articles with different published dates
    await db.insert(newsArticlesTable)
      .values([
        {
          title: testArticle1.title,
          content: testArticle1.content,
          excerpt: testArticle1.excerpt,
          author: testArticle1.author,
          published_at: testArticle1.published_at, // 2023-01-15
          is_published: testArticle1.is_published
        },
        {
          title: testArticle3.title,
          content: testArticle3.content,
          excerpt: testArticle3.excerpt,
          author: testArticle3.author,
          published_at: testArticle3.published_at, // 2023-03-10 (latest)
          is_published: testArticle3.is_published
        },
        {
          title: testArticle2.title,
          content: testArticle2.content,
          excerpt: testArticle2.excerpt,
          author: testArticle2.author,
          published_at: testArticle2.published_at, // 2023-02-20
          is_published: testArticle2.is_published
        }
      ])
      .execute();

    const result = await getNewsArticles();

    expect(result).toHaveLength(3);
    
    // Verify articles are ordered by published_at descending
    expect(result[0].title).toEqual('Third News Article'); // Latest (2023-03-10)
    expect(result[1].title).toEqual('Second News Article'); // Middle (2023-02-20)
    expect(result[2].title).toEqual('First News Article'); // Earliest (2023-01-15)
    
    // Verify the published dates are in descending order
    expect(result[0].published_at >= result[1].published_at).toBe(true);
    expect(result[1].published_at >= result[2].published_at).toBe(true);
  });

  it('should handle null excerpt values correctly', async () => {
    // Create article with null excerpt
    await db.insert(newsArticlesTable)
      .values({
        title: testArticle3.title,
        content: testArticle3.content,
        excerpt: testArticle3.excerpt, // null
        author: testArticle3.author,
        published_at: testArticle3.published_at,
        is_published: testArticle3.is_published
      })
      .execute();

    const result = await getNewsArticles();

    expect(result).toHaveLength(1);
    expect(result[0].excerpt).toBeNull();
  });
});
