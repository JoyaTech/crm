
import React from 'react';
import { useCRM } from '../contexts/CRMContext';
import { Task, TaskStatus } from '../types';
import { PlusIcon } from './Icons';

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const getPriorityColor = (priority: Task['priority']) => {
        if (priority === 'High') return 'border-l-red-500';
        if (priority === 'Medium') return 'border-l-yellow-500';
        return 'border-l-sky-500';
    }

    return (
        <div className={`bg-slate-800 p-4 rounded-lg border border-slate-700 border-l-4 ${getPriorityColor(task.priority)}`}>
            <p className="font-bold text-slate-100">{task.title}</p>
            <p className="text-sm text-slate-400 mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
        </div>
    )
}

const TasksView: React.FC = () => {
  const { tasks } = useCRM();

  const getTasksForStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  }

  const statuses: TaskStatus[] = [TaskStatus.ToDo, TaskStatus.InProgress, TaskStatus.Done];

  return (
    <div className="h-full flex flex-col">
       <header className="p-6 border-b border-slate-700 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Tasks</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-500">
            <PlusIcon className="w-4 h-4" />
            New Task
        </button>
      </header>
       <div className="flex-1 flex gap-5 p-6 overflow-x-auto">
        {statuses.map(status => (
          <div key={status} className="flex-1 bg-slate-800/50 rounded-lg p-4 min-w-[300px]">
            <h3 className="font-bold text-slate-200 mb-4">{status} ({getTasksForStatus(status).length})</h3>
            <div className="space-y-3">
              {getTasksForStatus(status).map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksView;
