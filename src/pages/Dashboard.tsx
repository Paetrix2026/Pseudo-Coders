import React from 'react';
import { useTimerContext } from '../context/TimerProvider';
import { useAppContext } from '../context/AppProvider';
import { useTasksContext } from '../context/TasksContext';
import { useCommunityContext } from '../context/CommunityContext';
import { Play, Pause, RotateCcw, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TaskCard } from '../components/TaskCard';
  
export const Dashboard: React.FC = () => {
  const { user } = useAppContext();
  const { timeLeft, isRunning, startTimer, pauseTimer, resetTimer } = useTimerContext();
  const { tasks } = useTasksContext();
  const { posts } = useCommunityContext();
  
  // Format time
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ready to focus, {user?.name}?</h1>
          <p className="text-gray-500 dark:text-gray-400">Here's what you need to do today.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/tasks" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium transition-colors">
            Go to Tasks
          </Link>
          <button onClick={isRunning ? pauseTimer : startTimer} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors shadow-sm shadow-primary/20 flex items-center gap-2">
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
            {isRunning ? 'Pause Focus' : 'Start Focus'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-semibold">Priority Tasks</h2>
            <Link to="/tasks" className="text-primary hover:text-primary/80 font-medium flex items-center gap-1 text-sm bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid gap-6">
            {tasks.length > 0 ? (
              <TaskCard task={tasks[0]} />
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50">
                <p className="text-gray-500 mb-4">No tasks available.</p>
                <Link to="/tasks" className="text-primary font-medium hover:underline">Import dummy tasks</Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Focus Timer Widget */}
          <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
            <h3 className="font-semibold text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-wider text-sm">Focus Timer</h3>
            
            <div className="text-6xl font-bold font-mono tracking-wider mb-8 text-primary drop-shadow-sm">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>

            <div className="flex justify-center gap-4">
              {isRunning ? (
                <button 
                  onClick={pauseTimer}
                  className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  <Pause size={28} />
                </button>
              ) : (
                <button 
                  onClick={startTimer}
                  className="p-4 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-md shadow-primary/30 hover:-translate-y-0.5"
                >
                  <Play size={28} className="ml-1" />
                </button>
              )}
              
              <button 
                onClick={resetTimer}
                className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 shadow-sm"
              >
                <RotateCcw size={28} />
              </button>
            </div>
            
            <Link to="/focus" className="inline-block mt-8 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
              Open Full Screen
            </Link>
          </div>

          {/* Recent Shoutouts Widget */}
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-sm">Community Pulse</h3>
              <Link to="/community" className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {posts.slice(0, 2).map(post => (
                <div key={post.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {post.author.charAt(0)}
                    </div>
                    <span className="font-medium text-sm">{post.author}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                    "{post.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
