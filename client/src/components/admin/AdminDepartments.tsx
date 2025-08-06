
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Department, CreateDepartmentInput, UpdateDepartmentInput } from '../../../../server/src/schema';

export function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<CreateDepartmentInput>({
    name: '',
    description: '',
    head_of_department: null
  });

  const loadDepartments = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await trpc.getDepartments.query();
      setDepartments(result);
    } catch (error) {
      console.error('Failed to load departments:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      head_of_department: null
    });
    setEditingDepartment(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await trpc.createDepartment.mutate(formData);
      setDepartments((prev: Department[]) => [...prev, result]);
      setStatus({ type: 'success', message: 'Department added successfully!' });
      resetForm();
      setShowAddDialog(false);
    } catch {
      setStatus({ type: 'error', message: 'Failed to add department' });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDepartment) return;
    
    try {
      const updateData: UpdateDepartmentInput = {
        id: editingDepartment.id,
        ...formData
      };
      const result = await trpc.updateDepartment.mutate(updateData);
      setDepartments((prev: Department[]) => 
        prev.map((d: Department) => d.id === editingDepartment.id ? result : d)
      );
      setStatus({ type: 'success', message: 'Department updated successfully!' });
      resetForm();
    } catch {
      setStatus({ type: 'error', message: 'Failed to update department' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    
    try {
      await trpc.deleteDepartment.mutate({ id });
      setDepartments((prev: Department[]) => prev.filter((d: Department) => d.id !== id));
      setStatus({ type: 'success', message: 'Department deleted successfully!' });
    } catch {
      setStatus({ type: 'error', message: 'Failed to delete department' });
    }
  };

  const startEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description,
      head_of_department: department.head_of_department
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-red-800">🏢 Manage Departments</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              ➕ Add New Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <Input
                placeholder="Department name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev: CreateDepartmentInput) => ({ ...prev, name: e.target.value }))
                }
                required
              />
              <Textarea
                placeholder="Department description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData((prev: CreateDepartmentInput) => ({ ...prev, description: e.target.value }))
                }
                required
              />
              <Input
                placeholder="Head of department (optional)"
                value={formData.head_of_department || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev: CreateDepartmentInput) => ({ 
                    ...prev, 
                    head_of_department: e.target.value || null 
                  }))
                }
              />
              <Button type="submit" className="w-full">
                Add Department
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
        <div className="text-center py-8">Loading departments...</div>
      ) : (
        <div className="grid gap-6">
          {departments.map((department: Department) => (
            <Card key={department.id} className="shadow-lg">
              {editingDepartment?.id === department.id ? (
                <CardContent className="p-6">
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <Input
                      placeholder="Department name"
                      value={formData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateDepartmentInput) => ({ ...prev, name: e.target.value }))
                      }
                      required
                    />
                    <Textarea
                      placeholder="Department description"
                      value={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData((prev: CreateDepartmentInput) => ({ ...prev, description: e.target.value }))
                      }
                      required
                    />
                    <Input
                      placeholder="Head of department (optional)"
                      value={formData.head_of_department || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateDepartmentInput) => ({ 
                          ...prev, 
                          head_of_department: e.target.value || null 
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
                  <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                    <CardTitle>{department.name}</CardTitle>
                    {department.head_of_department && (
                      <p className="text-amber-100">Head: {department.head_of_department}</p>
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-700 mb-4">{department.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Created: {department.created_at.toLocaleDateString()}
                      </div>
                      <div className="space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => startEdit(department)}
                        >
                          ✏️ Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(department.id)}
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
