import { useState, useEffect } from 'react';

const TaskForm = ({ task, onSubmit, onCancel, teamMembers }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Work',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
    assignedTo: '',
  });
  const [error, setError] = useState('');
  const [focused, setFocused] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: task.category || 'Work',
        priority: task.priority || 'Medium',
        status: task.status || 'Pending',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        assignedTo: task.assignedTo?._id || task.assignedTo || '',
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleBlur = (field) => {
    setFocused({ ...focused, [field]: false });
  };

  const setToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, dueDate: today }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const submitData = {
        ...formData,
        dueDate: formData.dueDate || undefined,
        assignedTo: formData.assignedTo || undefined,
      };

      if (task) {
        await onSubmit(task._id, submitData);
      } else {
        await onSubmit(submitData);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    }
  };

  return (
    <div className="dashboard-card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {task ? 'Update your task details' : 'Fill in the details to create a new task'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          title="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-lg mb-6 animate-scale-in">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            onFocus={() => handleFocus('title')}
            onBlur={() => handleBlur('title')}
            className="w-full input-field"
            placeholder="Enter task title..."
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            onFocus={() => handleFocus('description')}
            onBlur={() => handleBlur('description')}
            className="w-full input-field resize-none"
            placeholder="Add a detailed description (optional)..."
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            onFocus={() => handleFocus('category')}
            onBlur={() => handleBlur('category')}
            className="w-full input-field"
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Exercise">Exercise</option>
            <option value="Shopping">Shopping</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Finance">Finance</option>
            <option value="Travel">Travel</option>
            <option value="Family">Family</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              onFocus={() => handleFocus('priority')}
              onBlur={() => handleBlur('priority')}
              className="w-full input-field"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              onFocus={() => handleFocus('status')}
              onBlur={() => handleBlur('status')}
              className="w-full input-field"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {teamMembers && teamMembers.length > 0 && (
          <div>
            <label htmlFor="assignedTo" className="block text-sm font-semibold text-gray-700 mb-2">
              Assign To
            </label>
            <select
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              onFocus={() => handleFocus('assignedTo')}
              onBlur={() => handleBlur('assignedTo')}
              className="w-full input-field"
            >
              <option value="">Unassigned</option>
              {teamMembers.map((member) => (
                <option key={member.user._id} value={member.user._id}>
                  {member.user.name} ({member.user.email})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700">
              Due Date
            </label>
            <button
              type="button"
              onClick={setToday}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Set to Today (EOD)
            </button>
          </div>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            onFocus={() => handleFocus('dueDate')}
            onBlur={() => handleBlur('dueDate')}
            className="w-full input-field"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary hover-lift"
          >
            {task ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
