import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigation } from './Navigation';
import { Home } from './pages/Home';
import { Inventory } from './pages/Inventory';
import { Analytics } from './pages/Analytics';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';

type Page = 'home' | 'inventory' | 'analytics' | 'notifications' | 'settings' | 'profile';

export function Dashboard() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { user } = useAuth();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'inventory':
        return <Inventory />;
      case 'analytics':
        return <Analytics />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
