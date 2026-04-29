import React from 'react';
import { TaskCard } from '../components/TaskCard';
import { TaskGenerator } from '../components/TaskGenerator';
import { useTasksContext } from '../context/TasksContext';
import { Download } from 'lucide-react';

export const Tasks: React.FC = () => {
  const { tasks, importDummyTasks } = useTasksContext();

  const handleImport = () => {
    importDummyTasks();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400">Adapted specifically for your needs.</p>
        </div>
        
        <button 
          onClick={handleImport}
          className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-medium transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5"
        >
          <Download size={20} />
          Import Tasks
        </button>
      </div>

      {/* Task Generator Panel */}
      <TaskGenerator />

      {tasks.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-gray-50/50 dark:bg-gray-900/50">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 text-gray-400">
            <Download size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2">No tasks available</h3>
          <p className="text-gray-500 mb-6">Import the dummy tasks to see the adaptive views.</p>
          <button 
            onClick={handleImport}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-sm"
          >
            Import Example Tasks
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};
