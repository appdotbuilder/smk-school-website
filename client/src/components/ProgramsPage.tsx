
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Program } from '../../../server/src/schema';

export function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-red-800 mb-4">
          🎓 Academic Programs
        </h1>
        <p className="text-xl text-red-700 max-w-2xl mx-auto">
          Discover our comprehensive technical programs designed to prepare you for 
          successful careers in today's dynamic industries
        </p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : programs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">📚</div>
          <h3 className="text-2xl font-semibold text-red-800 mb-4">
            Programs Coming Soon!
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            We're currently updating our program offerings. Check back soon to see 
            our exciting technical programs and specializations.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program: Program) => (
            <Card key={program.id} className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <span className="mr-2">🎯</span>
                  {program.name}
                </CardTitle>
                <CardDescription className="text-red-100">
                  {program.duration_years} Year Program
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {program.description}
                </p>
                {program.requirements && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-red-800 mb-2">Requirements:</h4>
                    <p className="text-sm text-gray-600">{program.requirements}</p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    {program.duration_years} Years
                  </Badge>
                  <div className="text-xs text-gray-500">
                    Est. {program.created_at.getFullYear()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Program Categories Info */}
      <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-red-800 mb-6 text-center">
          🏢 Program Categories
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💻</span>
            </div>
            <h4 className="font-semibold text-red-800">Information Technology</h4>
            <p className="text-sm text-gray-600">Software development, networking, cybersecurity</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚙️</span>
            </div>
            <h4 className="font-semibold text-red-800">Engineering</h4>
            <p className="text-sm text-gray-600">Mechanical, electrical, civil engineering</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🏭</span>
            </div>
            <h4 className="font-semibold text-red-800">Manufacturing</h4>
            <p className="text-sm text-gray-600">Production, quality control, automation</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💼</span>
            </div>
            <h4 className="font-semibold text-red-800">Business</h4>
            <p className="text-sm text-gray-600">Management, marketing, entrepreneurship</p>
          </div>
        </div>
      </div>
    </div>
  );
}
