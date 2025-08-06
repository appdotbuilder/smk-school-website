
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Achievement } from '../../../server/src/schema';

export function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const loadAchievements = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await trpc.getAchievements.query();
      setAchievements(result);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  const categories = ['all', ...new Set(achievements.map((achievement: Achievement) => achievement.category))];
  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter((achievement: Achievement) => achievement.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'academic': return '🎓';
      case 'sports': return '🏃‍♂️';
      case 'competition': return '🏆';
      case 'community': return '🤝';
      case 'innovation': return '💡';
      case 'leadership': return '👑';
      default: return '⭐';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-red-800 mb-4">
          🏆 School Achievements
        </h1>
        <p className="text-xl text-red-700 max-w-2xl mx-auto">
          Celebrating the outstanding accomplishments of our students, faculty, and school 
          community. These achievements reflect our commitment to excellence in education.
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-red-800 mb-4 text-center">
          Filter by Category
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category: string) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-800'
              }`}
            >
              {category === 'all' ? '🌟 All Categories' : `${getCategoryIcon(category)} ${category}`}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : filteredAchievements.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">🏆</div>
          <h3 className="text-2xl font-semibold text-red-800 mb-4">
            {selectedCategory === 'all' ? 'No Achievements Yet' : `No ${selectedCategory} Achievements`}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {selectedCategory === 'all' 
              ? "We're working hard to achieve great things. Check back soon to see our accomplishments!"
              : `No achievements in the ${selectedCategory} category yet. Try selecting a different category.`
            }
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement: Achievement) => (
            <Card key={achievement.id} className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2">{getCategoryIcon(achievement.category)}</span>
                    <span className="text-sm">{achievement.title}</span>
                  </div>
                  <Badge variant="secondary" className="bg-amber-200 text-amber-800">
                    {achievement.category}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {achievement.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="mr-2">👤</span>
                    <span className="font-semibold text-red-800">Recipient:</span>
                    <span className="ml-2">{achievement.recipient}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="mr-2">📅</span>
                    <span className="font-semibold text-red-800">Date:</span>
                    <span className="ml-2">{achievement.achievement_date.toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Achievement Statistics */}
      <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-red-800 mb-6 text-center">
          📊 Achievement Overview
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎓</span>
            </div>
            <div className="text-3xl font-bold text-red-600">{achievements.filter((a: Achievement) => a.category.toLowerCase() === 'academic').length}</div>
            <div className="text-sm text-gray-600">Academic Awards</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🏃‍♂️</span>
            </div>
            <div className="text-3xl font-bold text-amber-600">{achievements.filter((a: Achievement) => a.category.toLowerCase() === 'sports').length}</div>
            <div className="text-sm text-gray-600">Sports Achievements</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🏆</span>
            </div>
            <div className="text-3xl font-bold text-red-600">{achievements.filter((a: Achievement) => a.category.toLowerCase() === 'competition').length}</div>
            <div className="text-sm text-gray-600">Competitions Won</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🤝</span>
            </div>
            <div className="text-3xl font-bold text-amber-600">{achievements.filter((a: Achievement) => a.category.toLowerCase() === 'community').length}</div>
            <div className="text-sm text-gray-600">Community Service</div>
          </div>
        </div>
      </div>

      {/* Notable Achievements */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-red-800 mb-6 text-center">
          ⭐ Why We Excel
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-red-700 mb-4">🎯 Our Success Factors:</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="mr-3 text-red-500">✓</span>
                <div>
                  <strong>Quality Education:</strong> Comprehensive curriculum aligned with industry standards
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-amber-500">✓</span>
                <div>
                  <strong>Experienced Faculty:</strong> Dedicated teachers with professional expertise
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-red-500">✓</span>
                <div>
                  <strong>Modern Facilities:</strong> State-of-the-art equipment and learning environments
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-amber-500">✓</span>
                <div>
                  <strong>Student Support:</strong> Comprehensive guidance and mentorship programs
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-red-700 mb-4">🚀 Areas of Excellence:</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="mr-3 text-red-500">🎓</span>
                <div>Technical skills competitions and certifications</div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-amber-500">💡</span>
                <div>Innovation and entrepreneurship projects</div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-red-500">🏃‍♂️</span>
                <div>Sports and physical education programs</div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-amber-500">🤝</span>
                <div>Community service and social responsibility</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
