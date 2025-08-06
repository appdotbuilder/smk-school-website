
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import type { SchoolEvent, CreateSchoolEventInput, UpdateSchoolEventInput } from '../../../../server/src/schema';

export function AdminEvents() {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SchoolEvent | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<CreateSchoolEventInput>({
    title: '',
    description: '',
    event_date: new Date(),
    location: null,
    is_past: false
  });

  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await trpc.getSchoolEvents.query();
      setEvents(result);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_date: new Date(),
      location: null,
      is_past: false
    });
    setEditingEvent(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await trpc.createSchoolEvent.mutate(formData);
      setEvents((prev: SchoolEvent[]) => [...prev, result]);
      setStatus({ type: 'success', message: 'Event added successfully!' });
      resetForm();
      setShowAddDialog(false);
    } catch {
      setStatus({ type: 'error', message: 'Failed to add event' });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    
    try {
      const updateData: UpdateSchoolEventInput = {
        id: editingEvent.id,
        ...formData
      };
      const result = await trpc.updateSchoolEvent.mutate(updateData);
      setEvents((prev: SchoolEvent[]) => 
        prev.map((event: SchoolEvent) => event.id === editingEvent.id ? result : event)
      );
      setStatus({ type: 'success', message: 'Event updated successfully!' });
      resetForm();
    } catch {
      setStatus({ type: 'error', message: 'Failed to update event' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await trpc.deleteSchoolEvent.mutate({ id });
      setEvents((prev: SchoolEvent[]) => prev.filter((event: SchoolEvent) => event.id !== id));
      setStatus({ type: 'success', message: 'Event deleted successfully!' });
    } catch {
      setStatus({ type: 'error', message: 'Failed to delete event' });
    }
  };

  const startEdit = (event: SchoolEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      location: event.location,
      is_past: event.is_past
    });
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: CreateSchoolEventInput) => ({
      ...prev,
      event_date: new Date(e.target.value)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-red-800">📅 Manage School Events</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              ➕ Add New Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <Input
                placeholder="Event title"
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev: CreateSchoolEventInput) => ({ ...prev, title: e.target.value }))
                }
                required
              />
              <Textarea
                placeholder="Event description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData((prev: CreateSchoolEventInput) => ({ ...prev, description: e.target.value }))
                }
                required
              />
              <Input
                type="date"
                value={formatDateForInput(formData.event_date)}
                onChange={handleDateChange}
                required
              />
              <Input
                placeholder="Location (optional)"
                value={formData.location || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev: CreateSchoolEventInput) => ({ 
                    ...prev, 
                    location: e.target.value || null 
                  }))
                }
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_past"
                  checked={formData.is_past}
                  onCheckedChange={(checked: boolean) =>
                    setFormData((prev: CreateSchoolEventInput) => ({ ...prev, is_past: checked }))
                  }
                />
                <label htmlFor="is_past" className="text-sm">
                  This is a past event
                </label>
              </div>
              <Button type="submit" className="w-full">
                Add Event
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
        <div className="text-center py-8">Loading events...</div>
      ) : (
        <div className="grid gap-6">
          {events.map((event: SchoolEvent) => (
            <Card key={event.id} className="shadow-lg">
              {editingEvent?.id === event.id ? (
                <CardContent className="p-6">
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <Input
                      placeholder="Event title"
                      value={formData.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateSchoolEventInput) => ({ ...prev, title: e.target.value }))
                      }
                      required
                    />
                    <Textarea
                      placeholder="Event description"
                      value={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData((prev: CreateSchoolEventInput) => ({ ...prev, description: e.target.value }))
                      }
                      required
                    />
                    <Input
                      type="date"
                      value={formatDateForInput(formData.event_date)}
                      onChange={handleDateChange}
                      required
                    />
                    <Input
                      placeholder="Location (optional)"
                      value={formData.location || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateSchoolEventInput) => ({ 
                          ...prev, 
                          location: e.target.value || null 
                        }))
                      }
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="edit_is_past"
                        checked={formData.is_past}
                        onCheckedChange={(checked: boolean) =>
                          setFormData((prev: CreateSchoolEventInput) => ({ ...prev, is_past: checked }))
                        }
                      />
                      <label htmlFor="edit_is_past" className="text-sm">
                        This is a past event
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
                  <CardHeader className={`${event.is_past 
                    ? 'bg-gradient-to-r from-gray-400 to-gray-500' 
                    : 'bg-gradient-to-r from-red-500 to-red-600'} text-white`}>
                    <CardTitle className="flex items-center justify-between">
                      <span>{event.title}</span>
                      <span className="text-sm">{event.is_past ? '📅 Past' : '🎉 Upcoming'}</span>
                    </CardTitle>
                    <p className="text-red-100">
                      {event.event_date.toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-700 mb-4">{event.description}</p>
                    {event.location && (
                      <p className="text-sm text-gray-600 mb-4">
                        <strong>📍 Location:</strong> {event.location}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Created: {event.created_at.toLocaleDateString()}
                      </div>
                      <div className="space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => startEdit(event)}
                        >
                          ✏️ Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(event.id)}
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
