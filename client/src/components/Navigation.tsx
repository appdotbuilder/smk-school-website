
import { Button } from '@/components/ui/button';

type Page = 'home' | 'about' | 'programs' | 'registration' | 'departments' | 
           'events' | 'achievements' | 'latest-info' | 'alumni' | 'admin';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home' as Page, label: '🏠 Home' },
    { id: 'about' as Page, label: '📖 About Us' },
    { id: 'programs' as Page, label: '🎓 Programs' },
    { id: 'departments' as Page, label: '🏢 Departments' },
    { id: 'events' as Page, label: '📅 Events' },
    { id: 'achievements' as Page, label: '🏆 Achievements' },
    { id: 'latest-info' as Page, label: '📰 Latest Info' },
    { id: 'alumni' as Page, label: '👥 Alumni' },
    { id: 'registration' as Page, label: '📝 Registration' },
    { id: 'admin' as Page, label: '⚙️ Admin' },
  ];

  return (
    <nav className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold">🏫 SMK School</div>
            <div className="hidden md:block text-sm text-red-100">
              Excellence in Technical Education
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onNavigate(item.id)}
                className={
                  currentPage === item.id
                    ? "bg-amber-100 text-red-700 hover:bg-amber-200"
                    : "text-white hover:bg-red-500 hover:text-white"
                }
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
