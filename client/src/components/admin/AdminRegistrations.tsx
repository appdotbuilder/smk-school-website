
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { StudentRegistration, UpdateStudentRegistrationStatusInput } from '../../../../server/src/schema';

export function AdminRegistrations() {
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const loadRegistrations = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await trpc.getStudentRegistrations.query();
      setRegistrations(result);
    } catch {
      console.error('Failed to load registrations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  const handleStatusChange = async (id: number, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      const updateData: UpdateStudentRegistrationStatusInput = { id, status: newStatus };
      const result = await trpc.updateStudentRegistrationStatus.mutate(updateData);
      setRegistrations((prev: StudentRegistration[]) => 
        prev.map((reg: StudentRegistration) => reg.id === id ? result : reg)
      );
      setStatus({ type: 'success', message: `Registration ${newStatus} successfully!` });
    } catch {
      setStatus({ type: 'error', message: 'Failed to update registration status' });
    }
  };

  const filteredRegistrations = filterStatus === 'all' 
    ? registrations 
    : registrations.filter((reg: StudentRegistration) => reg.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      default: return '📝';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-red-800">📝 Manage Student Registrations</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          <Select value={filterStatus} onValueChange={(value: 'all' | 'pending' | 'approved' | 'rejected') => setFilterStatus(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Registrations</SelectItem>
              <SelectItem value="pending">⏳ Pending</SelectItem>
              <SelectItem value="approved">✅ Approved</SelectItem>
              <SelectItem value="rejected">❌ Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {status && (
        <Alert className={status.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
          <AlertDescription className={status.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {status.type === 'success' ? '✅' : '❌'} {status.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{registrations.length}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {registrations.filter((r: StudentRegistration) => r.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {registrations.filter((r: StudentRegistration) => r.status === 'approved').length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {registrations.filter((r: StudentRegistration) => r.status === 'rejected').length}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading registrations...</div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {filterStatus === 'all' ? 'No Registrations Yet' : `No ${filterStatus} registrations`}
          </h3>
          <p className="text-gray-500">
            {filterStatus === 'all' 
              ? 'Student registrations will appear here once submitted.' 
              : `No registrations with ${filterStatus} status found.`
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredRegistrations.map((registration: StudentRegistration) => (
            <Card key={registration.id} className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="mr-2">👨‍🎓</span>
                    {registration.full_name}
                  </span>
                  <Badge className={getStatusColor(registration.status)}>
                    {getStatusIcon(registration.status)} {registration.status.toUpperCase()}
                  </Badge>
                </CardTitle>
                <p className="text-red-100">
                  Applied: {registration.registration_date.toLocaleDateString('id-ID')} • 
                  Desired Major: {registration.desired_major}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-red-800">Personal Information:</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Date of Birth:</strong> {registration.date_of_birth.toLocaleDateString('id-ID')}</p>
                      <p><strong>Gender:</strong> {registration.gender}</p>
                      <p><strong>Email:</strong> {registration.email}</p>
                      <p><strong>Phone:</strong> {registration.phone_number}</p>
                      <p><strong>Address:</strong> {registration.address}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-red-800">Academic & Family Info:</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Previous School:</strong> {registration.previous_school}</p>
                      <p><strong>Parent/Guardian:</strong> {registration.parent_name}</p>
                      <p><strong>Parent Phone:</strong> {registration.parent_phone}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Application ID: #{registration.id} • Submitted: {registration.created_at.toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Update Status:</span>
                      <Select
                        value={registration.status}
                        onValueChange={(value: 'pending' | 'approved' | 'rejected') => 
                          handleStatusChange(registration.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">⏳ Pending</SelectItem>
                          <SelectItem value="approved">✅ Approve</SelectItem>
                          <SelectItem value="rejected">❌ Reject</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
