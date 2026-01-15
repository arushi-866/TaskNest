import { useState } from 'react';

const TaskItem = ({ task, onEdit, onDelete, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-700 border-red-200 ring-red-100';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-100';
      case 'Low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 ring-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'badge-status-completed';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100';
      case 'Pending':
        return 'bg-slate-50 text-slate-600 border-slate-200 ring-slate-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200 ring-slate-100';
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    try {
      await onUpdate(task._id, { ...task, status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  return (
    <div
      className={`group relative bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-white/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
        task.status === 'Completed' ? 'opacity-75 hover:opacity-100' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-lg font-bold text-gray-800 flex-1 pr-2 leading-tight ${
          task.status === 'Completed' ? 'line-through text-gray-500' : ''
        }`}>
          {task.title}
        </h3>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-200"
            title="Edit task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Delete task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className={`${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority} Priority
        </span>
        <span
          className={`${getStatusColor(
            task.status
          )}`}
        >
          {task.status}
        </span>
      </div>

      {/* Due Date */}
      {task.dueDate && (
        <div className={`mb-4 p-2 rounded-lg ${
          isOverdue ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            <svg className={`w-4 h-4 ${isOverdue ? 'text-red-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={`text-xs font-medium ${isOverdue ? 'text-red-700' : 'text-gray-700'}`}>
              Due: {formatDate(task.dueDate)}
              {isOverdue && <span className="ml-1 font-bold">(Overdue)</span>}
            </span>
          </div>
        </div>
      )}

      {/* Status Selector */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Update Status
        </label>
        <select
          value={task.status}
          onChange={handleStatusChange}
          disabled={isUpdating}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-white/50 hover:bg-white hover:border-indigo-300 cursor-pointer"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

export default TaskItem;
