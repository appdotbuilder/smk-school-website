
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { Alumni } from '../../../server/src/schema';

export function AlumniPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredAlumni = alumni.filter((alum: Alumni) =>
    alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alum.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (alum.company && alum.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (alum.current_position && alum.current_position.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getGraduationDecade = (year: number) => {
    const decade = Math.floor(year / 10) * 10;
    return `${decade}s`;
  };

  const groupedAlumni = filteredAlumni.reduce((acc: Record<string, Alumni[]>, alum: Alumni) => {
    const decade = getGraduationDecade(alum.graduation_year);
    if (!acc[decade]) {
      acc[decade] = [];
    }
    acc[decade].push(alum);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-red-800 mb-4">
          👥 Our Alumni Network
        </h1>
        <p className="text-xl text-red-700 max-w-2xl mx-auto">
          Meet our successful graduates who have made their mark in various industries. 
          Our alumni are a testament to the quality education and values we provide.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="max-w-md mx-auto">
          <Input
            type="text"
            placeholder="🔍 Search alumni by name, major, company, or position..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="border-red-200 focus:border-red-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
          ))}
        </div>
      ) : filteredAlumni.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">👥</div>
          <h3 className="text-2xl font-semibold text-red-800 mb-4">
            {searchTerm ? 'No Alumni Found' : 'Alumni Directory Coming Soon!'}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchTerm 
              ? `No alumni found matching "${searchTerm}". Try adjusting your search terms.`
              : "We're building our alumni directory. Check back soon to connect with our graduates!"
            }
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(groupedAlumni)
            .sort((a, b) => b.localeCompare(a))
            .map((decade: string) => (
              <div key={decade} className="space-y-6">
                <h2 className="text-2xl font-bold text-red-800 border-b-2 border-red-200 pb-2">
                  🎓 Class of {decade}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedAlumni[decade]
                    .sort((a: Alumni, b: Alumni) => b.graduation_year - a.graduation_year)
                    .map((alum: Alumni) => (
                    <Card key={alum.id} className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
                      <CardHeader className="text-center bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-lg">
                        <div className="w-20 h-20 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl">👨‍🎓</span>
                        </div>
                        <CardTitle className="text-lg">{alum.name}</CardTitle>
                        <div className="text-amber-100 text-sm">
                          Class of {alum.graduation_year}
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 text-center">
                        <Badge variant="secondary" className="mb-4 bg-red-100 text-red-800">
                          {alum.major}
                        </Badge>
                        
                        {alum.current_position && (
                          <div className="mb-3">
                            <h4 className="font-semibold text-red-800 text-sm">Current Position:</h4>
                            <p className="text-gray-700">{alum.current_position}</p>
                          </div>
                        )}
                        
                        {alum.company && (
                          <div className="mb-3">
                            <h4 className="font-semibold text-red-800 text-sm">Company:</h4>
                            <p className="text-gray-700">{alum.company}</p>
                          </div>
                        )}

                        {alum.bio && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 italic">
                              {alum.bio.length > 100 
                                ? `${alum.bio.substring(0, 100)}...` 
                                : alum.bio}
                            </p>
                          </div>
                        )}

                        {alum.contact_email && (
                          <div className="pt-3 border-t border-gray-100">
                            <a 
                              href={`mailto:${alum.contact_email}`}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              📧 Contact
                            </a>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Alumni Statistics */}
      <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-red-800 mb-6 text-center">
          📊 Alumni Success Stories
        </h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-3xl font-bold text-red-600 mb-2">1000+</div>
            <div className="text-sm text-gray-600">Total Alumni</div>
          </div>
          <div>
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💼</span>
            </div>
            <div className="text-3xl font-bold text-amber-600 mb-2">95%</div>
            <div className="text-sm text-gray-600">Employment Rate</div>
          </div>
          <div>
            <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🏢</span>
            </div>
            <div className="text-3xl font-bold text-red-600 mb-2">200+</div>
            <div className="text-sm text-gray-600">Partner Companies</div>
          </div>
          <div>
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🌟</span>
            </div>
            <div className="text-3xl font-bold text-amber-600 mb-2">50+</div>
            <div className="text-sm text-gray-600">Industry Leaders</div>
          </div>
        </div>
      </div>

      {/* Industry Distribution */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-red-800 mb-6 text-center">
          🏭 Industries Our Alumni Excel In
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💻</span>
            </div>
            <h4 className="font-semibold text-red-800 mb-2">Information Technology</h4>
            <p className="text-sm text-gray-600">Software development, IT services, cybersecurity</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚙️</span>
            </div>
            <h4 className="font-semibold text-red-800 mb-2">Engineering</h4>
            <p className="text-sm text-gray-600">Manufacturing, automotive, construction</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💼</span>
            </div>
            <h4 className="font-semibold text-red-800 mb-2">Business & Finance</h4>
            <p className="text-sm text-gray-600">Banking, consulting, entrepreneurship</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎓</span>
            </div>
            <h4 className="font-semibold text-red-800 mb-2">Education</h4>
            <p className="text-sm text-gray-600">Teaching, training, educational leadership</p>
          </div>
        </div>
      </div>

      {/* Connect with Alumni */}
      <div className="bg-gradient-to-r from-amber-50 to-red-50 rounded-2xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-red-800 mb-4">
          🤝 Connect with Our Alumni Network
        </h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Our alumni are always willing to share their experiences and provide guidance 
          to current students and fellow graduates. Join our alumni community!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-red-100 px-6 py-3 rounded-full">
            <span className="text-red-800 font-semibold">📱 Alumni WhatsApp Group</span>
          </div>
          <div className="bg-amber-100 px-6 py-3 rounded-full">
            <span className="text-amber-800 font-semibold">💼 LinkedIn Network</span>
          </div>
          <div className="bg-red-100 px-6 py-3 rounded-full">
            <span className="text-red-800 font-semibold">🎉 Annual Reunion</span>
          </div>
        </div>
      </div>
    </div>
  );
}
