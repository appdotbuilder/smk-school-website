
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Achievement, CreateAchievementInput, UpdateAchievementInput } from '../../../../server/src/schema';

export function AdminAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<CreateAchievementInput>({
    title: '',
    description: '',
    achievement_date: new Date(),
    recipient: '',
    category: ''
  });

  const loadAchievements = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await trpc.getAchievements.query();
      setAchievements(result);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      achievement_date: new Date(),
      recipient: '',
      category: ''
    });
    setEditingAchievement(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await trpc.createAchievement.mutate(formData);
      setAchievements((prev: Achievement[]) => [...prev, result]);
      setStatus({ type: 'success', message: 'Achievement added successfully!' });
      resetForm();
      setShowAddDialog(false);
    } catch {
      setStatus({ type: 'error', message: 'Failed to add achievement' });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAchievement) return;
    
    try {
      const updateData: UpdateAchievementInput = {
        id: editingAchievement.id,
        ...formData
      };
      const result = await trpc.updateAchievement.mutate(updateData);
      setAchievements((prev: Achievement[]) => 
        prev.map((achievement: Achievement) => achievement.id === editingAchievement.id ? result : achievement)
      );
      setStatus({ type: 'success', message: 'Achievement updated successfully!' });
      resetForm();
    } catch {
      setStatus({ type: 'error', message: 'Failed to update achievement' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;
    
    try {
      await trpc.deleteAchievement.mutate({ id });
      setAchievements((prev: Achievement[]) => prev.filter((achievement: Achievement) => achievement.id !== id));
      setStatus({ type: 'success', message: 'Achievement deleted successfully!' });
    } catch {
      setStatus({ type: 'error', message: 'Failed to delete achievement' });
    }
  };

  const startEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setFormData({
      title: achievement.title,
      description: achievement.description,
      achievement_date: achievement.achievement_date,
      recipient: achievement.recipient,
      category: achievement.category
    });
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: CreateAchievementInput) => ({
      ...prev,
      achievement_date: new Date(e.target.value)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-red-800">🏆 Manage Achievements</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              ➕ Add New Achievement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Achievement</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <Input
                placeholder="Achievement title"
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev: CreateAchievementInput) => ({ ...prev, title: e.target.value }))
                }
                required
              />
              <Textarea
                placeholder="Achievement description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData((prev: CreateAchievementInput) => ({ ...prev, description: e.target.value }))
                }
                required
              />
              <Input
                type="date"
                value={formatDateForInput(formData.achievement_date)}
                onChange={handleDateChange}
                required
              />
              <Input
                placeholder="Recipient name"
                value={formData.recipient}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev: CreateAchievementInput) => ({ ...prev, recipient: e.target.value }))
                }
                required
              />
              <Input
                placeholder="Category (e.g., Academic, Sports, Competition)"
                value={formData.category}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev: CreateAchievementInput) => ({ ...prev, category: e.target.value }))
                }
                required
              />
              <Button type="submit" className="w-full">
                Add Achievement
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
        <div className="text-center py-8">Loading achievements...</div>
      ) : (
        <div className="grid gap-6">
          {achievements.map((achievement: Achievement) => (
            <Card key={achievement.id} className="shadow-lg">
              {editingAchievement?.id === achievement.id ? (
                <CardContent className="p-6">
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <Input
                      placeholder="Achievement title"
                      value={formData.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateAchievementInput) => ({ ...prev, title: e.target.value }))
                      }
                      required
                    />
                    <Textarea
                      placeholder="Achievement description"
                      value={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData((prev: CreateAchievementInput) => ({ ...prev, description: e.target.value }))
                      }
                      required
                    />
                    <Input
                      type="date"
                      value={formatDateForInput(formData.achievement_date)}
                      onChange={handleDateChange}
                      required
                    />
                    <Input
                      placeholder="Recipient name"
                      value={formData.recipient}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateAchievementInput) => ({ ...prev, recipient: e.target.value }))
                      }
                      required
                    />
                    <Input
                      placeholder="Category"
                      value={formData.category}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateAchievementInput) => ({ ...prev, category: e.target.value }))
                      }
                      required
                    />
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
                  <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                    <CardTitle className="flex items-center justify-between">
                      <span>{achievement.title}</span>
                      <span className="text-sm bg-amber-200 text-amber-800 px-2 py-1 rounded">
                        {achievement.category}
                      </span>
                    </CardTitle>
                    <p className="text-amber-100">
                      {achievement.recipient} • {achievement.achievement_date.toLocaleDateString('id-ID')}
                    </p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-700 mb-4">{achievement.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Created: {achievement.created_at.toLocaleDateString()}
                      </div>
                      <div className="space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => startEdit(achievement)}
                        >
                          ✏️ Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(achievement.id)}
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
