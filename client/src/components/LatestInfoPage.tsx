
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { NewsArticle } from '../../../server/src/schema';

export function LatestInfoPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const loadArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await trpc.getPublishedNewsArticles.query();
      setArticles(result);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Button 
          onClick={() => setSelectedArticle(null)}
          variant="outline"
          className="mb-6"
        >
          ← Back to Articles
        </Button>
        
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8">
            <h1 className="text-3xl font-bold mb-4">{selectedArticle.title}</h1>
            <div className="flex items-center space-x-4 text-red-100">
              <span>👤 {selectedArticle.author}</span>
              <span>📅 {selectedArticle.published_at.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
          
          <div className="p-8">
            {selectedArticle.excerpt && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                <p className="text-lg text-amber-800 italic">{selectedArticle.excerpt}</p>
              </div>
            )}
            
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              {selectedArticle.content.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-red-800 mb-4">
          📰 Latest Information
        </h1>
        <p className="text-xl text-red-700 max-w-2xl mx-auto">
          Stay informed with the latest news, updates, and announcements from SMK School. 
          Get insights into our activities, achievements, and important information.
        </p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">📰</div>
          <h3 className="text-2xl font-semibold text-red-800 mb-4">
            Coming Soon: School News!
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            We're preparing exciting news and updates about our school activities. 
            Check back soon for the latest information and announcements!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: NewsArticle) => (
            <Card key={article.id} className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
                <CardTitle className="text-lg leading-tight">
                  {article.title}
                </CardTitle>
                <div className="flex items-center justify-between text-sm text-red-100">
                  <span>👤 {article.author}</span>
                  <Badge variant="secondary" className="bg-red-200 text-red-800">
                    Published
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {article.excerpt && (
                  <p className="text-gray-600 mb-4 italic">
                    {article.excerpt}
                  </p>
                )}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {article.content.length > 150 
                    ? `${article.content.substring(0, 150)}...` 
                    : article.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    📅 {article.published_at.toLocaleDateString('id-ID')}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => setSelectedArticle(article)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Read More →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* News Categories */}
      <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-red-800 mb-6 text-center">
          📢 News Categories
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📚</span>
            </div>
            <h4 className="font-semibold text-red-800 mb-2">Academic News</h4>
            <p className="text-sm text-gray-600">
              Updates on curriculum, programs, and educational initiatives
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎉</span>
            </div>
            <h4 className="font-semibold text-red-800 mb-2">School Events</h4>
            <p className="text-sm text-gray-600">
              Coverage of school activities, celebrations, and gatherings
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🏆</span>
            </div>
            <h4 className="font-semibold text-red-800 mb-2">Achievements</h4>
            <p className="text-sm text-gray-600">
              Spotlights on student and school accomplishments
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📋</span>
            </div>
            <h4 className="font-semibold text-red-800 mb-2">Announcements</h4>
            <p className="text-sm text-gray-600">
              Important notices, policy updates, and general information
            </p>
          </div>
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-red-800 mb-4">
          📧 Stay Updated
        </h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Never miss important school news and updates. Follow our social media channels 
          and check this page regularly for the latest information from SMK School.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-red-100 px-6 py-3 rounded-full">
            <span className="text-red-800 font-semibold">📱 WhatsApp Updates</span>
          </div>
          <div className="bg-amber-100 px-6 py-3 rounded-full">
            <span className="text-amber-800 font-semibold">📺 Instagram Stories</span>
          </div>
          <div className="bg-red-100 px-6 py-3 rounded-full">
            <span className="text-red-800 font-semibold">📘 Facebook Posts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
