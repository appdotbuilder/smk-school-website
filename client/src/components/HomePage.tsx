
export function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-16 bg-gradient-to-r from-red-100 to-amber-100 rounded-3xl shadow-lg">
        <h1 className="text-5xl font-bold text-red-800 mb-4">
          🏫 Welcome to SMK School
        </h1>
        <p className="text-xl text-red-700 mb-8 max-w-2xl mx-auto">
          Building Tomorrow's Technical Leaders Through Excellence in Education and Innovation
        </p>
        <div className="flex justify-center space-x-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-red-600">500+</div>
            <div className="text-sm text-gray-600">Students</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-red-600">15+</div>
            <div className="text-sm text-gray-600">Programs</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-red-600">98%</div>
            <div className="text-sm text-gray-600">Job Placement</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-500">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Quality Education</h3>
          <p className="text-gray-600">
            Industry-aligned curriculum designed to prepare students for real-world challenges
            in technical fields.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-amber-500">
          <div className="text-4xl mb-4">🔧</div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Modern Facilities</h3>
          <p className="text-gray-600">
            State-of-the-art laboratories and workshops equipped with the latest technology
            for hands-on learning.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-500">
          <div className="text-4xl mb-4">👨‍🏫</div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Expert Faculty</h3>
          <p className="text-gray-600">
            Experienced instructors with industry expertise committed to student success
            and professional development.
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gradient-to-r from-amber-50 to-red-50 p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-red-800 mb-6 text-center">
          🚀 Quick Access
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">📚</div>
            <h4 className="font-semibold text-red-700">Academic Programs</h4>
            <p className="text-sm text-gray-600">Explore our technical programs</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">📝</div>
            <h4 className="font-semibold text-red-700">Student Registration</h4>
            <p className="text-sm text-gray-600">Apply for admission</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">📅</div>
            <h4 className="font-semibold text-red-700">School Events</h4>
            <p className="text-sm text-gray-600">Stay updated with events</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
            <div className="text-2xl mb-2">🏆</div>
            <h4 className="font-semibold text-red-700">Achievements</h4>
            <p className="text-sm text-gray-600">Our success stories</p>
          </div>
        </div>
      </div>
    </div>
  );
}
