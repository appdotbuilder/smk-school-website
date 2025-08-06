
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Alumni, CreateAlumniInput, UpdateAlumniInput } from '../../../../server/src/schema';

export function AdminAlumni() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<Alumni | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<CreateAlumniInput>({
    name: '',
    graduation_year: new Date().getFullYear(),
    major: '',
    current_position: null,
    company: null,
    contact_email: null,
    bio: null
  });

  const loadAlumni = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await trpc.getAlumni.query();
      setAlumni(result);
    } catch (error) {
      console.error('Failed to load alumni:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlumni();
  }, [loadAlumni]);

  const resetForm = () => {
    setFormData({
      name: '',
      graduation_year: new Date().getFullYear(),
      major: '',
      current_position: null,
      company: null,
      contact_email: null,
      bio: null
    });
    setEditingAlumni(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await trpc.createAlumni.mutate(formData);
      setAlumni((prev: Alumni[]) => [...prev, result]);
      setStatus({ type: 'success', message: 'Alumni added successfully!' });
      resetForm();
      setShowAddDialog(false);
    } catch {
      setStatus({ type: 'error', message: 'Failed to add alumni' });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlumni) return;
    
    try {
      const updateData: UpdateAlumniInput = {
        id: editingAlumni.id,
        ...formData
      };
      const result = await trpc.updateAlumni.mutate(updateData);
      setAlumni((prev: Alumni[]) => 
        prev.map((alum: Alumni) => alum.id === editingAlumni.id ? result : alum)
      );
      setStatus({ type: 'success', message: 'Alumni updated successfully!' });
      resetForm();
    } catch {
      setStatus({ type: 'error', message: 'Failed to update alumni' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this alumni record?')) return;
    
    try {
      await trpc.deleteAlumni.mutate({ id });
      setAlumni((prev: Alumni[]) => prev.filter((alum: Alumni) => alum.id !== id));
      setStatus({ type: 'success', message: 'Alumni deleted successfully!' });
    } catch {
      setStatus({ type: 'error', message: 'Failed to delete alumni' });
    }
  };

  const startEdit = (alum: Alumni) => {
    setEditingAlumni(alum);
    setFormData({
      name: alum.name,
      graduation_year: alum.graduation_year,
      major: alum.major,
      current_position: alum.current_position,
      company: alum.company,
      contact_email: alum.contact_email,
      bio: alum.bio
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-red-800">👥 Manage Alumni</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              ➕ Add New Alumni
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Alumni</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateAlumniInput) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
                <Input
                  type="number"
                  placeholder="Graduation year"
                  value={formData.graduation_year}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateAlumniInput) => ({ 
                      ...prev, 
                      graduation_year: parseInt(e.target.value) || new Date().getFullYear() 
                    }))
                  }
                  min="1950"
                  max={new Date().getFullYear()}
                  required
                />
              </div>
              <Input
                placeholder="Major/Program of study"
                value={formData.major}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev: CreateAlumniInput) => ({ ...prev, major: e.target.value }))
                }
                required
              />
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Current position (optional)"
                  value={formData.current_position || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateAlumniInput) => ({ 
                      ...prev, 
                      current_position: e.target.value || null 
                    }))
                  }
                />
                <Input
                  placeholder="Company (optional)"
                  value={formData.company || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateAlumniInput) => ({ 
                      ...prev, 
                      company: e.target.value || null 
                    }))
                  }
                />
              </div>
              <Input
                type="email"
                placeholder="Contact email (optional)"
                value={formData.contact_email || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev: CreateAlumniInput) => ({ 
                    ...prev, 
                    contact_email: e.target.value || null 
                  }))
                }
              />
              <Textarea
                placeholder="Bio/Description (optional)"
                value={formData.bio || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData((prev: CreateAlumniInput) => ({ 
                    ...prev, 
                    bio: e.target.value || null 
                  }))
                }
                rows={3}
              />
              <Button type="submit" className="w-full">
                Add Alumni
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
        <div className="text-center py-8">Loading alumni...</div>
      ) : (
        <div className="grid gap-6">
          {alumni.map((alum: Alumni) => (
            <Card key={alum.id} className="shadow-lg">
              {editingAlumni?.id === alum.id ? (
                <CardContent className="p-6">
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Full name"
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev: CreateAlumniInput) => ({ ...prev, name: e.target.value }))
                        }
                        required
                      />
                      <Input
                        type="number"
                        placeholder="Graduation year"
                        value={formData.graduation_year}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev: CreateAlumniInput) => ({ 
                            ...prev, 
                            graduation_year: parseInt(e.target.value) || new Date().getFullYear() 
                          }))
                        }
                        min="1950"
                        max={new Date().getFullYear()}
                        required
                      />
                    </div>
                    <Input
                      placeholder="Major/Program of study"
                      value={formData.major}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateAlumniInput) => ({ ...prev, major: e.target.value }))
                      }
                      required
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Current position (optional)"
                        value={formData.current_position || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev: CreateAlumniInput) => ({ 
                            ...prev, 
                            current_position: e.target.value || null 
                          }))
                        }
                      />
                      <Input
                        placeholder="Company (optional)"
                        value={formData.company || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev: CreateAlumniInput) => ({ 
                            ...prev, 
                            company: e.target.value || null 
                          }))
                        }
                      />
                    </div>
                    <Input
                      type="email"
                      placeholder="Contact email (optional)"
                      value={formData.contact_email || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateAlumniInput) => ({ 
                          ...prev, 
                          contact_email: e.target.value || null 
                        }))
                      }
                    />
                    <Textarea
                      placeholder="Bio/Description (optional)"
                      value={formData.bio || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData((prev: CreateAlumniInput) => ({ 
                          ...prev, 
                          bio: e.target.value || null 
                        }))
                      }
                      rows={3}
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
                      <span>{alum.name}</span>
                      <span className="text-sm bg-amber-200 text-amber-800 px-2 py-1 rounded">
                        Class of {alum.graduation_year}
                      </span>
                    </CardTitle>
                    <p className="text-amber-100">{alum.major}</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-2 mb-4">
                      {alum.current_position && (
                        <p className="text-sm">
                          <strong>Position:</strong> {alum.current_position}
                        </p>
                      )}
                      {alum.company && (
                        <p className="text-sm">
                          <strong>Company:</strong> {alum.company}
                        </p>
                      )}
                      {alum.contact_email && (
                        <p className="text-sm">
                          <strong>Email:</strong> {alum.contact_email}
                        </p>
                      )}
                    </div>
                    {alum.bio && (
                      <p className="text-gray-700 mb-4 text-sm">{alum.bio}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Added: {alum.created_at.toLocaleDateString()}
                      </div>
                      <div className="space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => startEdit(alum)}
                        >
                          ✏️ Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(alum.id)}
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
