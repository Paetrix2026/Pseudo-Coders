import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppProvider';
import { useAuthContext } from '../context/AuthContext';
import { useTimerContext } from '../context/TimerProvider';
import { auth } from '../firebase/config';
import { Sun, Moon, LayoutDashboard, CheckSquare, Users, Timer, Settings, LogOut, Play, Pause } from 'lucide-react';

export const Layout: React.FC = () => {
  const { theme, setTheme, user, setUser } = useAppContext();
  const { logout } = useAuthContext();
  const { timeLeft, isRunning, pauseTimer, startTimer } = useTimerContext();
  const location = useLocation();

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const handleLogout = async () => {
    setUser(null);
    await logout();
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Focus', path: '/focus', icon: Timer },
    { name: 'Community', path: '/community', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  // Draggable Timer State
  const [timerPos, setTimerPos] = React.useState({ x: window.innerWidth - 160, y: 16 });
  const [isDragging, setIsDragging] = React.useState(false);
  const dragRef = React.useRef<{ startX: number; startY: number; initialPosX: number; initialPosY: number } | null>(null);

  React.useEffect(() => {
    if (auth.currentUser) {
      const saved = localStorage.getItem(`timer_position_${auth.currentUser.uid}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed.x === 'number' && typeof parsed.y === 'number') {
            setTimerPos(parsed);
          }
        } catch (e) {}
      }
    }
  }, []);

  React.useEffect(() => {
    if (!isDragging && auth.currentUser) {
      localStorage.setItem(`timer_position_${auth.currentUser.uid}`, JSON.stringify(timerPos));
    }
  }, [isDragging, timerPos]);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag on left click
    if (e.button !== 0) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPosX: timerPos.x,
      initialPosY: timerPos.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setTimerPos({
      x: dragRef.current.initialPosX + dx,
      y: dragRef.current.initialPosY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setIsDragging(false);
    dragRef.current = null;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-card-light dark:bg-card-dark border-r border-gray-200 dark:border-gray-800 flex flex-col transition-colors duration-300">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="bg-primary text-white px-2 py-1 rounded-lg">C</span>
            ClearMind
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-gray-200 dark:border-gray-800 bg-card-light/50 dark:bg-card-dark/50 backdrop-blur-sm transition-colors duration-300">
          <div className="flex items-center gap-2">
            <span className="font-medium text-lg">Welcome back, {user?.name || 'Guest'}</span>
          </div>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8 pr-32 relative">
          <Outlet />

          {/* Floating Draggable Timer Widget */}
          {location.pathname !== '/focus' && (isRunning || (timeLeft > 0 && timeLeft < 25 * 60)) && (
            <div 
              style={{ position: 'fixed', left: timerPos.x, top: timerPos.y, touchAction: 'none' }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`rounded-full shadow-lg border border-gray-200 dark:border-gray-700 p-2 pr-4 flex items-center gap-3 z-50 cursor-grab ${isDragging ? 'cursor-grabbing' : ''} ${!isRunning ? 'opacity-70 hover:opacity-100 transition-opacity' : ''} bg-card-light dark:bg-card-dark`}
            >
              {isRunning ? (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); pauseTimer(); }}
                    className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors flex-shrink-0"
                  >
                    <Pause size={14} />
                  </button>
                  <div className="font-mono font-bold text-primary select-none whitespace-nowrap">
                    {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                  </div>
                </>
              ) : (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); startTimer(); }}
                    className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
                  >
                    <Play size={14} className="ml-0.5" />
                  </button>
                  <div className="font-mono font-medium text-gray-500 select-none whitespace-nowrap">
                    {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
