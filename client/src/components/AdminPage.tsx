
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminPrograms } from '@/components/admin/AdminPrograms';
import { AdminDepartments } from '@/components/admin/AdminDepartments';
import { AdminEvents } from '@/components/admin/AdminEvents';
import { AdminAchievements } from '@/components/admin/AdminAchievements';
import { AdminNews } from '@/components/admin/AdminNews';
import { AdminAlumni } from '@/components/admin/AdminAlumni';
import { AdminRegistrations } from '@/components/admin/AdminRegistrations';

export function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-red-800 mb-4">
          ⚙️ Admin Dashboard
        </h1>
        <p className="text-xl text-red-700 max-w-2xl mx-auto">
          Manage all school content including programs, departments, events, achievements, 
          news articles, alumni, and student registrations.
        </p>
      </div>

      <Tabs defaultValue="programs" className="w-full">
        <TabsList className="grid w-full grid-cols-7 mb-8">
          <TabsTrigger value="programs" className="text-xs">📚 Programs</TabsTrigger>
          <TabsTrigger value="departments" className="text-xs">🏢 Departments</TabsTrigger>
          <TabsTrigger value="events" className="text-xs">📅 Events</TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs">🏆 Achievements</TabsTrigger>
          <TabsTrigger value="news" className="text-xs">📰 News</TabsTrigger>
          <TabsTrigger value="alumni" className="text-xs">👥 Alumni</TabsTrigger>
          <TabsTrigger value="registrations" className="text-xs">📝 Registrations</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-6">
          <AdminPrograms />
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <AdminDepartments />
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <AdminEvents />
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <AdminAchievements />
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <AdminNews />
        </TabsContent>

        <TabsContent value="alumni" className="space-y-6">
          <AdminAlumni />
        </TabsContent>

        <TabsContent value="registrations" className="space-y-6">
          <AdminRegistrations />
        </TabsContent>
      </Tabs>
    </div>
  );
}
