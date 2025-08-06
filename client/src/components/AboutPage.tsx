
export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-red-800 mb-4">
          📖 About SMK School
        </h1>
        <p className="text-xl text-red-700">
          Empowering Students Through Technical Excellence Since 1985
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-red-800 mb-6 flex items-center">
          <span className="mr-3">🎯</span>
          Our Mission
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          To provide exceptional technical and vocational education that prepares students 
          for successful careers in industry while fostering innovation, creativity, and 
          lifelong learning. We are committed to developing skilled professionals who 
          contribute meaningfully to society and the economy.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-red-800 mb-4 flex items-center">
            <span className="mr-3">🔍</span>
            Our Vision
          </h3>
          <p className="text-gray-700 leading-relaxed">
            To be the leading technical school in the region, recognized for excellence 
            in education, innovation in teaching methods, and outstanding graduate outcomes. 
            We envision a future where our alumni become industry leaders and change-makers.
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-red-50 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-red-800 mb-4 flex items-center">
            <span className="mr-3">💎</span>
            Our Values
          </h3>
          <ul className="text-gray-700 space-y-2">
            <li className="flex items-center"><span className="mr-2">✓</span>Excellence in Education</li>
            <li className="flex items-center"><span className="mr-2">✓</span>Innovation and Creativity</li>
            <li className="flex items-center"><span className="mr-2">✓</span>Integrity and Ethics</li>
            <li className="flex items-center"><span className="mr-2">✓</span>Student-Centered Approach</li>
            <li className="flex items-center"><span className="mr-2">✓</span>Industry Collaboration</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-red-800 mb-6 flex items-center">
          <span className="mr-3">📈</span>
          Our History
        </h2>
        <div className="space-y-6">
          <div className="border-l-4 border-red-500 pl-6">
            <h4 className="font-semibold text-red-700">1985 - Foundation</h4>
            <p className="text-gray-600">
              SMK School was established with a vision to provide quality technical education
              to meet the growing industrial demands of our region.
            </p>
          </div>
          <div className="border-l-4 border-amber-500 pl-6">
            <h4 className="font-semibold text-red-700">1995 - Expansion</h4>
            <p className="text-gray-600">
              Added new departments and modern laboratories to accommodate growing student
              enrollment and emerging technology fields.
            </p>
          </div>
          <div className="border-l-4 border-red-500 pl-6">
            <h4 className="font-semibold text-red-700">2005 - Recognition</h4>
            <p className="text-gray-600">
              Achieved national accreditation and recognition for excellence in technical
              education and graduate employability.
            </p>
          </div>
          <div className="border-l-4 border-amber-500 pl-6">
            <h4 className="font-semibold text-red-700">2020 - Modernization</h4>
            <p className="text-gray-600">
              Implemented digital learning platforms and Industry 4.0 technologies to
              prepare students for the future workforce.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-100 to-amber-100 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-red-800 mb-6 flex items-center">
          <span className="mr-3">👥</span>
          Our Leadership
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <h4 className="font-semibold text-red-800">Dr. Ahmad Sudirman</h4>
            <p className="text-sm text-gray-600">Principal</p>
            <p className="text-xs text-gray-500 mt-2">M.Ed. in Technical Education</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👩‍💼</span>
            </div>
            <h4 className="font-semibold text-red-800">Siti Nurhaliza, M.Pd</h4>
            <p className="text-sm text-gray-600">Vice Principal Academic</p>
            <p className="text-xs text-gray-500 mt-2">M.Pd. in Educational Management</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👨‍💻</span>
            </div>
            <h4 className="font-semibold text-red-800">Budi Santoso, S.T</h4>
            <p className="text-sm text-gray-600">Head of Technical Programs</p>
            <p className="text-xs text-gray-500 mt-2">S.T. in Engineering</p>
          </div>
        </div>
      </div>
    </div>
  );
}
