
import React, { useState, useMemo } from 'react';
import { Task, TaskStatus, User, Deal, Contact } from '../types';
import { PlusIcon, UserIcon, ClockIcon } from './Icons';

interface TaskCardProps {
    task: Task;
    assignee?: User;
    relatedEntityName: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, assignee, relatedEntityName }) => {
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== TaskStatus.Done;
    const priorityColor = {
        Low: 'bg-green-600',
        Medium: 'bg-yellow-600',
        High: 'bg-red-600',
    };

    return (
        <div className="bg-slate-800 rounded-lg p-4 mb-3 cursor-pointer border border-slate-700 hover:border-sky-500 transition-all shadow-md">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-100">{task.title}</h4>
                <div title={task.priority} className={`w-3 h-3 rounded-full ${priorityColor[task.priority]}`}></div>
            </div>
            <p className="text-sm text-slate-400 mb-3">
                קשור ל: <span className="font-medium text-slate-300">{relatedEntityName}</span>
            </p>
            <div className={`flex items-center text-sm mb-4 ${isOverdue ? 'text-red-400' : 'text-slate-400'}`}>
                <ClockIcon className="w-4 h-4 mr-2" />
                <span>{new Date(task.dueDate).toLocaleDateString('he-IL')}</span>
                {isOverdue && <span className="mr-2 px-2 py-0.5 bg-red-900 text-red-300 text-xs rounded-full">באיחור</span>}
            </div>
            <div className="flex justify-between items-center text-xs">
                 {assignee && (
                    <div title={assignee.name} className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sky-300 font-bold ring-2 ring-slate-700">
                        {assignee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                 )}
            </div>
        </div>
    );
};

interface TasksViewProps {
  tasks: Task[];
  users: User[];
  deals: Deal[];
  contacts: Contact[];
}

const TasksView: React.FC<TasksViewProps> = ({ tasks, users, deals, contacts }) => {
  const [filter, setFilter] = useState('All');

  const filteredTasks = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    switch(filter) {
        case 'Overdue':
            return tasks.filter(t => new Date(t.dueDate) < today && t.status !== TaskStatus.Done);
        case 'Due Today':
            return tasks.filter(t => new Date(t.dueDate).toDateString() === today.toDateString());
        case 'Next 7 days':
            return tasks.filter(t => {
                const dueDate = new Date(t.dueDate);
                return dueDate >= today && dueDate < nextWeek;
            });
        default:
            return tasks;
    }
  }, [tasks, filter]);

  const taskStatusColumns = Object.values(TaskStatus);

  const getRelatedEntityName = (task: Task) => {
    if (task.relatedType === 'Deal') {
        const deal = deals.find(d => d.id === task.relatedId);
        return deal ? deal.name : 'דיל לא ידוע';
    }
    const contact = contacts.find(c => c.id === task.relatedId);
    return contact ? contact.fullName : 'איש קשר לא ידוע';
  };
  
  const filters = ['All', 'Overdue', 'Due Today', 'Next 7 days'];

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">משימות</h1>
        <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg">
                {filters.map(f => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === f ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
                        {f === 'All' ? 'הכל' : f === 'Overdue' ? 'באיחור' : f === 'Due Today' ? 'להיום' : '7 ימים הבאים'}
                    </button>
                ))}
            </div>
          <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            <PlusIcon className="w-5 h-5" />
            <span>משימה חדשה</span>
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-max">
          {taskStatusColumns.map(status => (
            <div key={status} className="bg-slate-900/70 rounded-xl">
              <div className="p-4 border-b border-slate-700 sticky top-0 bg-slate-900/70 backdrop-blur-sm rounded-t-xl">
                <h3 className="font-semibold text-white">{status} <span className="text-sm text-slate-400">({filteredTasks.filter(t => t.status === status).length})</span></h3>
              </div>
              <div className="p-2 space-y-3 h-[calc(100vh-220px)] overflow-y-auto">
                {filteredTasks
                  .filter(task => task.status === status)
                  .map(task => (
                    <TaskCard 
                        key={task.id}
                        task={task} 
                        assignee={users.find(u => u.id === task.assigneeId)}
                        relatedEntityName={getRelatedEntityName(task)}
                    />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TasksView;
