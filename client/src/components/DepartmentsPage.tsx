
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Department } from '../../../server/src/schema';

export function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-red-800 mb-4">
          🏢 Academic Departments
        </h1>
        <p className="text-xl text-red-700 max-w-2xl mx-auto">
          Explore our specialized departments, each led by experienced faculty 
          and equipped with modern facilities to support your learning journey
        </p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      ) : departments.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">🏢</div>
          <h3 className="text-2xl font-semibold text-red-800 mb-4">
            Departments Information Coming Soon!
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            We're currently organizing our department information. Please check back 
            soon to learn about our specialized academic departments and their offerings.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department: Department) => (
            <Card key={department.id} className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <span className="mr-2">🎯</span>
                  {department.name}
                </CardTitle>
                {department.head_of_department && (
                  <CardDescription className="text-amber-100">
                    Head: {department.head_of_department}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {department.description}
                </p>
                <div className="text-xs text-gray-500">
                  Established: {department.created_at.toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Department Features */}
      <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-red-800 mb-6 text-center">
          🎓 What Our Departments Offer
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <h4 className="font-semibold text-red-800 mb-2">Expert Faculty</h4>
            <p className="text-sm text-gray-600">
              Experienced instructors with industry expertise and advanced degrees
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔬</span>
            </div>
            <h4 className="font-semibold text-red-800 mb-2">Modern Labs</h4>
            <p className="text-sm text-gray-600">
              State-of-the-art laboratories and workshops for hands-on learning
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🤝</span>
            </div>
            <h4 className="font-semibold text-red-800 mb-2">Industry Links</h4>
            <p className="text-sm text-gray-600">
              Strong partnerships with leading companies for internships and jobs
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📈</span>
            </div>
            <h4 className="font-semibold text-red-800 mb-2">Career Growth</h4>
            <p className="text-sm text-gray-600">
              Comprehensive career development and job placement support
            </p>
          </div>
        </div>
      </div>

      {/* Department Statistics */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-red-800 mb-6 text-center">
          📊 Department Overview
        </h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div className="p-4">
            <div className="text-3xl font-bold text-red-600 mb-2">8+</div>
            <div className="text-sm text-gray-600">Academic Departments</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-amber-600 mb-2">50+</div>
            <div className="text-sm text-gray-600">Qualified Instructors</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-red-600 mb-2">25+</div>
            <div className="text-sm text-gray-600">Modern Laboratories</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-amber-600 mb-2">95%</div>
            <div className="text-sm text-gray-600">Graduate Employment</div>
          </div>
        </div>
      </div>
    </div>
  );
}
