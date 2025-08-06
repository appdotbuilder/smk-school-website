
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Program, CreateProgramInput, UpdateProgramInput } from '../../../../server/src/schema';

export function AdminPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<CreateProgramInput>({
    name: '',
    description: '',
    duration_years: 3,
    requirements: null
  });

  const loadPrograms = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await trpc.getPrograms.query();
      setPrograms(result);
    } catch (error) {
      console.error('Failed to load programs:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration_years: 3,
      requirements: null
    });
    setEditingProgram(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await trpc.createProgram.mutate(formData);
      setPrograms((prev: Program[]) => [...prev, result]);
      setStatus({ type: 'success', message: 'Program added successfully!' });
      resetForm();
      setShowAddDialog(false);
    } catch {
      setStatus({ type: 'error', message: 'Failed to add program' });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;
    
    try {
      const updateData: UpdateProgramInput = {
        id: editingProgram.id,
        ...formData
      };
      const result = await trpc.updateProgram.mutate(updateData);
      setPrograms((prev: Program[]) => 
        prev.map((p: Program) => p.id === editingProgram.id ? result : p)
      );
      setStatus({ type: 'success', message: 'Program updated successfully!' });
      resetForm();
    } catch {
      setStatus({ type: 'error', message: 'Failed to update program' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    
    try {
      await trpc.deleteProgram.mutate({ id });
      setPrograms((prev: Program[]) => prev.filter((p: Program) => p.id !== id));
      setStatus({ type: 'success', message: 'Program deleted successfully!' });
    } catch {
      setStatus({ type: 'error', message: 'Failed to delete program' });
    }
  };

  const startEdit = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      description: program.description,
      duration_years: program.duration_years,
      requirements: program.requirements
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-red-800">📚 Manage Programs</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              ➕ Add New Program
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Program</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <Input
                placeholder="Program name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev: CreateProgramInput) => ({ ...prev, name: e.target.value }))
                }
                required
              />
              <Textarea
                placeholder="Program description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData((prev: CreateProgramInput) => ({ ...prev, description: e.target.value }))
                }
                required
              />
              <Input
                type="number"
                placeholder="Duration (years)"
                value={formData.duration_years}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev: CreateProgramInput) => ({ 
                    ...prev, 
                    duration_years: parseInt(e.target.value) || 3 
                  }))
                }
                min="1"
                max="6"
                required
              />
              <Textarea
                placeholder="Requirements (optional)"
                value={formData.requirements || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData((prev: CreateProgramInput) => ({ 
                    ...prev, 
                    requirements: e.target.value || null 
                  }))
                }
              />
              <Button type="submit" className="w-full">
                Add Program
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
        <div className="text-center py-8">Loading programs...</div>
      ) : (
        <div className="grid gap-6">
          {programs.map((program: Program) => (
            <Card key={program.id} className="shadow-lg">
              {editingProgram?.id === program.id ? (
                <CardContent className="p-6">
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <Input
                      placeholder="Program name"
                      value={formData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateProgramInput) => ({ ...prev, name: e.target.value }))
                      }
                      required
                    />
                    <Textarea
                      placeholder="Program description"
                      value={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData((prev: CreateProgramInput) => ({ ...prev, description: e.target.value }))
                      }
                      required
                    />
                    <Input
                      type="number"
                      placeholder="Duration (years)"
                      value={formData.duration_years}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateProgramInput) => ({ 
                          ...prev, 
                          duration_years: parseInt(e.target.value) || 3 
                        }))
                      }
                      min="1"
                      max="6"
                      required
                    />
                    <Textarea
                      placeholder="Requirements (optional)"
                      value={formData.requirements || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData((prev: CreateProgramInput) => ({ 
                          ...prev, 
                          requirements: e.target.value || null 
                        }))
                      }
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
                  <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                    <CardTitle>{program.name}</CardTitle>
                    <p className="text-red-100">{program.duration_years} Year Program</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-700 mb-4">{program.description}</p>
                    {program.requirements && (
                      <p className="text-sm text-gray-600 mb-4">
                        <strong>Requirements:</strong> {program.requirements}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Created: {program.created_at.toLocaleDateString()}
                      </div>
                      <div className="space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => startEdit(program)}
                        >
                          ✏️ Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(program.id)}
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
