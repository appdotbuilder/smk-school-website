
import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { HomePage } from '@/components/HomePage';
import { AboutPage } from '@/components/AboutPage';
import { ProgramsPage } from '@/components/ProgramsPage';
import { RegistrationPage } from '@/components/RegistrationPage';
import { DepartmentsPage } from '@/components/DepartmentsPage';
import { SchoolEventsPage } from '@/components/SchoolEventsPage';
import { AchievementsPage } from '@/components/AchievementsPage';
import { LatestInfoPage } from '@/components/LatestInfoPage';
import { AlumniPage } from '@/components/AlumniPage';
import { AdminPage } from '@/components/AdminPage';

type Page = 'home' | 'about' | 'programs' | 'registration' | 'departments' | 
           'events' | 'achievements' | 'latest-info' | 'alumni' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'programs':
        return <ProgramsPage />;
      case 'registration':
        return <RegistrationPage />;
      case 'departments':
        return <DepartmentsPage />;
      case 'events':
        return <SchoolEventsPage />;
      case 'achievements':
        return <AchievementsPage />;
      case 'latest-info':
        return <LatestInfoPage />;
      case 'alumni':
        return <AlumniPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
