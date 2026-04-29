import React from 'react';
import { useTimerContext } from '../context/TimerProvider';
import { useAppContext } from '../context/AppProvider';
import { useTasksContext } from '../context/TasksContext';
import { useCommunityContext } from '../context/CommunityContext';
import { Play, Pause, RotateCcw, ArrowRight, CheckCircle2, Clock, Target, ListTodo, Activity, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, mode } = useAppContext();
  const { timeLeft, isRunning, startTimer, pauseTimer, resetTimer, duration } = useTimerContext();
  const { tasks } = useTasksContext();
  const { posts } = useCommunityContext();
  
  // Stats Calculations
  const completedTasks = tasks.filter(t => t.completed).length;
  const activeTasks = tasks.filter(t => !t.completed).length;
  const focusTimeToday = duration - Math.floor(timeLeft / 60);

  // Format time
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. USER PROFILE SECTION */}
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xl font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name || 'User'}!</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Let's make today productive.</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Active Mode</span>
          <span className="px-3 py-1 bg-primary/10 text-primary font-medium rounded-full text-sm">
            {mode}
          </span>
        </div>
      </div>

      {/* 2. STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Tasks Completed</div>
          </div>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
            <ListTodo size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{activeTasks}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Active Tasks</div>
          </div>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{focusTimeToday} <span className="text-base font-normal text-gray-500">min</span></div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Focus Time Today</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Task Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Target size={20} className="text-primary" />
                <h2 className="text-xl font-bold">Upcoming Tasks</h2>
              </div>
              <Link to="/tasks" className="text-primary hover:text-primary/80 font-medium flex items-center gap-1 text-sm bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors">
                View All Tasks <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="space-y-4">
              {tasks.length > 0 ? (
                tasks.slice(0, 4).map(task => {
                  const completedSteps = task.steps.filter(s => s.completed).length;
                  const totalSteps = task.steps.length;
                  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : (task.completed ? 100 : 0);
                  
                  return (
                    <div key={task.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800/50 hover:border-primary/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                          {task.title}
                        </h3>
                        <span className="text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                          {completedSteps}/{totalSteps} steps
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden mt-3">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-500 ${task.completed ? 'bg-green-500' : 'bg-primary'}`} 
                          style={{ width: `${progress}%` }} 
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50">
                  <p className="text-gray-500 mb-4">No tasks available.</p>
                  <Link to="/tasks" className="text-primary font-medium hover:underline">Go to Tasks to add some</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Column: Focus Widget & Community */}
        <div className="space-y-6">
          {/* 4. FOCUS WIDGET */}
          <div className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-primary" />
            <div className="flex items-center justify-center gap-2 mb-6">
              <Activity size={20} className="text-primary" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Focus Session</h3>
            </div>
            
            <div className={`text-6xl font-bold font-mono tracking-wider mb-8 drop-shadow-sm transition-colors ${isRunning ? 'text-primary' : 'text-gray-800 dark:text-gray-200'}`}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>

            <div className="flex justify-center gap-4">
              {isRunning ? (
                <button 
                  onClick={pauseTimer}
                  className="px-6 py-3 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-xl hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors shadow-sm flex items-center gap-2 font-medium"
                >
                  <Pause size={20} /> Pause Focus
                </button>
              ) : (
                <button 
                  onClick={startTimer}
                  className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/30 hover:-translate-y-0.5 flex items-center gap-2 font-medium"
                >
                  <Play size={20} /> Start Focus
                </button>
              )}
              
              <button 
                onClick={resetTimer}
                className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 shadow-sm"
                aria-label="Reset Timer"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>

          {/* 5. COMMUNITY PREVIEW */}
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-primary" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Community</h3>
              </div>
              <Link to="/community" className="text-primary hover:text-primary/80 font-medium text-sm">
                View all
              </Link>
            </div>
            
            <div className="space-y-4 mb-6">
              {posts.slice(0, 2).map(post => (
                <div key={post.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800/50 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                      {post.author.charAt(0)}
                    </div>
                    <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{post.author}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    "{post.content}"
                  </p>
                </div>
              ))}
            </div>
            
            <Link to="/community" className="w-full py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-sm">
              Go to Community <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
