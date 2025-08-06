
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import type { NewsArticle, CreateNewsArticleInput, UpdateNewsArticleInput } from '../../../../server/src/schema';

export function AdminNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<CreateNewsArticleInput>({
    title: '',
    content: '',
    excerpt: null,
    author: '',
    published_at: new Date(),
    is_published: false
  });

  const loadArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await trpc.getNewsArticles.query();
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

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: null,
      author: '',
      published_at: new Date(),
      is_published: false
    });
    setEditingArticle(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await trpc.createNewsArticle.mutate(formData);
      setArticles((prev: NewsArticle[]) => [...prev, result]);
      setStatus({ type: 'success', message: 'News article added successfully!' });
      resetForm();
      setShowAddDialog(false);
    } catch {
      setStatus({ type: 'error', message: 'Failed to add news article' });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    
    try {
      const updateData: UpdateNewsArticleInput = {
        id: editingArticle.id,
        ...formData
      };
      const result = await trpc.updateNewsArticle.mutate(updateData);
      setArticles((prev: NewsArticle[]) => 
        prev.map((article: NewsArticle) => article.id === editingArticle.id ? result : article)
      );
      setStatus({ type: 'success', message: 'News article updated successfully!' });
      resetForm();
    } catch {
      setStatus({ type: 'error', message: 'Failed to update news article' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this news article?')) return;
    
    try {
      await trpc.deleteNewsArticle.mutate({ id });
      setArticles((prev: NewsArticle[]) => prev.filter((article: NewsArticle) => article.id !== id));
      setStatus({ type: 'success', message: 'News article deleted successfully!' });
    } catch {
      setStatus({ type: 'error', message: 'Failed to delete news article' });
    }
  };

  const startEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      author: article.author,
      published_at: article.published_at,
      is_published: article.is_published
    });
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: CreateNewsArticleInput) => ({
      ...prev,
      published_at: new Date(e.target.value)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-red-800">📰 Manage News Articles</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              ➕ Add New Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New News Article</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <Input
                placeholder="Article title"
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev: CreateNewsArticleInput) => ({ ...prev, title: e.target.value }))
                }
                required
              />
              <Input
                placeholder="Author name"
                value={formData.author}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev: CreateNewsArticleInput) => ({ ...prev, author: e.target.value }))
                }
                required
              />
              <Textarea
                placeholder="Article excerpt (optional)"
                value={formData.excerpt || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData((prev: CreateNewsArticleInput) => ({ 
                    ...prev, 
                    excerpt: e.target.value || null 
                  }))
                }
                rows={2}
              />
              <Textarea
                placeholder="Article content"
                value={formData.content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData((prev: CreateNewsArticleInput) => ({ ...prev, content: e.target.value }))
                }
                required
                rows={6}
              />
              <Input
                type="date"
                value={formatDateForInput(formData.published_at || new Date())}
                onChange={handleDateChange}
                required
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked: boolean) =>
                    setFormData((prev: CreateNewsArticleInput) => ({ ...prev, is_published: checked }))
                  }
                />
                <label htmlFor="is_published" className="text-sm">
                  Publish this article
                </label>
              </div>
              <Button type="submit" className="w-full">
                Add Article
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {status && (
        <Alert className={status.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
          <AlertDescription className={status.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {status.type === 'success' ? '✅' : '❌'} {status.message}
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center py-8">Loading news articles...</div>
      ) : (
        <div className="grid gap-6">
          {articles.map((article: NewsArticle) => (
            <Card key={article.id} className="shadow-lg">
              {editingArticle?.id === article.id ? (
                <CardContent className="p-6">
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <Input
                      placeholder="Article title"
                      value={formData.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateNewsArticleInput) => ({ ...prev, title: e.target.value }))
                      }
                      required
                    />
                    <Input
                      placeholder="Author name"
                      value={formData.author}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateNewsArticleInput) => ({ ...prev, author: e.target.value }))
                      }
                      required
                    />
                    <Textarea
                      placeholder="Article excerpt (optional)"
                      value={formData.excerpt || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData((prev: CreateNewsArticleInput) => ({ 
                          ...prev, 
                          excerpt: e.target.value || null 
                        }))
                      }
                      rows={2}
                    />
                    <Textarea
                      placeholder="Article content"
                      value={formData.content}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData((prev: CreateNewsArticleInput) => ({ ...prev, content: e.target.value }))
                      }
                      required
                      rows={6}
                    />
                    <Input
                      type="date"
                      value={formatDateForInput(formData.published_at || new Date())}
                      onChange={handleDateChange}
                      required
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="edit_is_published"
                        checked={formData.is_published}
                        onCheckedChange={(checked: boolean) =>
                          setFormData((prev: CreateNewsArticleInput) => ({ ...prev, is_published: checked }))
                        }
                      />
                      <label htmlFor="edit_is_published" className="text-sm">
                        Publish this article
                      </label>
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        ✅ Update
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        ❌ Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              ) : (
                <>
                  <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex-1">{article.title}</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        article.is_published 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                        {article.is_published ? '✅ Published' : '📝 Draft'}
                      </span>
                    </CardTitle>
                    <p className="text-red-100">
                      By {article.author} • {article.published_at.toLocaleDateString('id-ID')}
                    </p>
                  </CardHeader>
                  <CardContent className="p-6">
                    {article.excerpt && (
                      <p className="text-gray-600 italic mb-3">{article.excerpt}</p>
                    )}
                    <p className="text-gray-700 mb-4">
                      {article.content.length > 200 
                        ? `${article.content.substring(0, 200)}...` 
                        : article.content}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Created: {article.created_at.toLocaleDateString()}
                      </div>
                      <div className="space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => startEdit(article)}
                        >
                          ✏️ Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(article.id)}
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
