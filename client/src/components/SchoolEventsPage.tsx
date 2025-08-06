
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { SchoolEvent } from '../../../server/src/schema';

export function SchoolEventsPage() {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const upcomingEvents = events.filter((event: SchoolEvent) => !event.is_past);
  const pastEvents = events.filter((event: SchoolEvent) => event.is_past);

  const EventCard = ({ event }: { event: SchoolEvent }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
      <CardHeader className={`${event.is_past 
        ? 'bg-gradient-to-r from-gray-400 to-gray-500' 
        : 'bg-gradient-to-r from-red-500 to-red-600'} text-white rounded-t-lg`}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2">{event.is_past ? '📅' : '🎉'}</span>
            {event.title}
          </div>
          <Badge variant="secondary" className={`${event.is_past 
            ? 'bg-gray-200 text-gray-700' 
            : 'bg-amber-200 text-amber-800'}`}>
            {event.is_past ? 'Past' : 'Upcoming'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-gray-700 mb-4 leading-relaxed">
          {event.description}
        </p>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="mr-2">📅</span>
            <span className="font-semibold text-red-800">Date:</span>
            <span className="ml-2">{event.event_date.toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          {event.location && (
            <div className="flex items-center text-sm">
              <span className="mr-2">📍</span>
              <span className="font-semibold text-red-800">Location:</span>
              <span className="ml-2">{event.location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-red-800 mb-4">
          📅 School Events
        </h1>
        <p className="text-xl text-red-700 max-w-2xl mx-auto">
          Stay updated with our latest school events, activities, and important dates. 
          Join us in celebrating achievements and building our community together.
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="upcoming" className="flex items-center">
            <span className="mr-2">🎉</span>
            Upcoming Events ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center">
            <span className="mr-2">📋</span>
            Past Events ({pastEvents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📅</div>
              <h3 className="text-2xl font-semibold text-red-800 mb-4">
                No Upcoming Events Yet
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We're planning exciting events for our school community. 
                Check back soon for updates on upcoming activities and celebrations!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingEvents.map((event: SchoolEvent) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          ) : pastEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📋</div>
              <h3 className="text-2xl font-semibold text-red-800 mb-4">
                No Past Events to Display
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Our event history will appear here once we start hosting activities. 
                Stay tuned for exciting upcoming events!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {pastEvents.map((event: SchoolEvent) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Event Categories */}
      <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-red-800 mb-6 text-center">
          🎯 Types of Events We Host
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎓</span>
            </div>
            <h4 className="font-semibold text-red-800 mb-2">Academic Events</h4>
            <p className="text-sm text-gray-600">
              Graduations, award ceremonies, and academic competitions
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎨</span>
            </div>
            <h4 className="font-semibold text-red-800 mb-2">Cultural Events</h4>
            <p className="text-sm text-gray-600">
              Art exhibitions, cultural festivals, and talent shows
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🏃‍♂️</span>
            </div>
            <h4 className="font-semibold text-red-800 mb-2">Sports Events</h4>
            <p className="text-sm text-gray-600">
              Sports competitions, tournaments, and fitness activities
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🤝</span>
            </div>
            <h4 className="font-semibold text-red-800 mb-2">Community Events</h4>
            <p className="text-sm text-gray-600">
              Community service, workshops, and networking events
            </p>
          </div>
        </div>
      </div>

      {/* Event Calendar Notice */}
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-red-800 mb-4">
          📆 Stay Connected
        </h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Don't miss out on exciting school events! Follow our official social media channels 
          and check this page regularly for the latest updates on upcoming activities.
        </p>
        <div className="flex justify-center space-x-4">
          <div className="bg-red-100 px-4 py-2 rounded-full">
            <span className="text-red-800 font-semibold">📧 Newsletter</span>
          </div>
          <div className="bg-amber-100 px-4 py-2 rounded-full">
            <span className="text-amber-800 font-semibold">📱 Social Media</span>
          </div>
          <div className="bg-red-100 px-4 py-2 rounded-full">
            <span className="text-red-800 font-semibold">📢 Announcements</span>
          </div>
        </div>
      </div>
    </div>
  );
}
