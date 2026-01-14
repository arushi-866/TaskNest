import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import TaskStats from './TaskStats';
import Loading from './Loading';
import Tooltip from './Tooltip';
import Profile from './Profile';
import { getTasks, createTask, updateTask, deleteTask } from '../utils/api';
import toast from 'react-hot-toast';
import TeamDashboard from './TeamDashboard';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentView, setCurrentView] = useState('tasks');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      setTasks([newTask, ...tasks]);
      setShowForm(false);
      toast.success('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      throw error;
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      const updatedTask = await updateTask(id, taskData);
      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
      setEditingTask(null);
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      throw error;
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  // Get unique categories
  const categories = [...new Set(tasks.map(task => task.category || 'Work'))];

  const filteredTasks = tasks.filter((task) => {
    // Status filter
    if (statusFilter !== 'all') {
      const statusMap = {
        'pending': 'Pending',
        'in-progress': 'In Progress',
        'completed': 'Completed'
      };
      if (task.status !== statusMap[statusFilter]) return false;
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      if (task.priority !== priorityFilter) return false;
    }

    // Category filter
    if (categoryFilter !== 'all') {
      const taskCategory = task.category || 'Work';
      if (taskCategory !== categoryFilter) return false;
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = task.title?.toLowerCase().includes(query);
      const matchesDescription = task.description?.toLowerCase().includes(query);
      const matchesCategory = (task.category || 'Work').toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription && !matchesCategory) return false;
    }

    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'priority':
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'Pending').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    completed: tasks.filter((t) => t.status === 'Completed').length,
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      {/* Navigation */}
      <nav className="bg-[var(--color-white)] border-b border-[var(--color-border)] sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20 gap-2 md:gap-4 py-2">
            <div className="flex items-center space-x-2 md:space-x-3">
              <img src="/logo.png" alt="TaskNest" className="h-10 w-10 md:h-16 md:w-16 object-contain" />
              <h1 className="hidden md:block text-3xl font-extrabold text-indigo-600 tracking-tight font-sans">TaskNest</h1>
              <div className="hidden md:flex bg-white/50 rounded-lg p-1 ml-1 md:ml-2">
                <button
                  onClick={() => setCurrentView('tasks')}
                  className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md font-bold text-sm md:text-base transition-all duration-200 ${
                    currentView === 'tasks' ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => setCurrentView('teams')}
                  className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md text-sm md:text-base font-bold transition-all duration-200 ${
                    currentView === 'teams' ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Teams
                </button>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-1 md:space-x-3">
              {currentView !== 'teams' && (
                <>
                  {/* Search Button */}
                  <Tooltip text="Search your tasks" position="bottom">
                    <button
                      onClick={() => setShowSearch(!showSearch)}
                      className={`p-1.5 md:p-2.5 hover:bg-white/50 rounded-lg transition-all duration-200 ${showSearch ? 'bg-white/50' : ''}`}
                    >
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </Tooltip>

                  {/* Stats Chart Button */}
                  <Tooltip text={showStats ? "Hide Statistics Charts" : "Show Statistics Charts"} position="bottom">
                    <button
                      onClick={() => setShowStats(!showStats)}
                      className="p-1.5 md:p-2.5 text-gray-700 hover:text-indigo-600 hover:bg-white/50 rounded-lg transition-all duration-200"
                    >
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </button>
                  </Tooltip>

                  {/* Filter Button */}
                  <Tooltip text="Filter tasks by status, priority, or category" position="bottom">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="p-1.5 md:p-2.5 text-gray-700 hover:text-indigo-600 hover:bg-white/50 rounded-lg transition-all duration-200 relative"
                    >
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      {(statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all') && (
                        <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500"></span>
                      )}
                    </button>
                  </Tooltip>

                  {/* New Task Button */}
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center space-x-2 btn-primary hover-lift"
                    title="Create a new task"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden sm:inline">New Task</span>
                  </button>
                </>
              )}

              {/* Profile Button */}
              <Tooltip text="View Profile" position="bottom">
                <button
                  onClick={() => setShowProfile(true)}
                  className="p-1.5 md:p-2.5 text-gray-700 hover:text-indigo-600 hover:bg-white/50 rounded-lg transition-all duration-200 relative"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </Tooltip>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-4 shadow-lg animate-fade-in">
            {/* View Toggles */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => { setCurrentView('tasks'); setIsMobileMenuOpen(false); }}
                className={`flex-1 py-2 rounded-md font-bold text-sm transition-all duration-200 ${
                  currentView === 'tasks' ? 'bg-white shadow text-indigo-600' : 'text-gray-600'
                }`}
              >
                Tasks
              </button>
              <button
                onClick={() => { setCurrentView('teams'); setIsMobileMenuOpen(false); }}
                className={`flex-1 py-2 rounded-md font-bold text-sm transition-all duration-200 ${
                  currentView === 'teams' ? 'bg-white shadow text-indigo-600' : 'text-gray-600'
                }`}
              >
                Teams
              </button>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              {currentView !== 'teams' && (
                <>
                  <button
                    onClick={() => { setShowSearch(!showSearch); setIsMobileMenuOpen(false); }}
                    className={`flex items-center justify-center space-x-2 p-3 rounded-lg border ${showSearch ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-gray-200 text-gray-700'}`}
                  >
                    <span>Search</span>
                  </button>
                  <button
                    onClick={() => { setShowStats(!showStats); setIsMobileMenuOpen(false); }}
                    className={`flex items-center justify-center space-x-2 p-3 rounded-lg border ${showStats ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-gray-200 text-gray-700'}`}
                  >
                    <span>Stats</span>
                  </button>
                  <button
                    onClick={() => { setShowFilters(!showFilters); setIsMobileMenuOpen(false); }}
                    className={`flex items-center justify-center space-x-2 p-3 rounded-lg border ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-gray-200 text-gray-700'}`}
                  >
                    <span>Filters</span>
                  </button>
                  <button
                    onClick={() => { setShowForm(true); setIsMobileMenuOpen(false); }}
                    className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-indigo-600 text-white shadow-sm"
                  >
                    <span>New Task</span>
                  </button>
                </>
              )}
              <button
                onClick={() => { setShowProfile(true); setIsMobileMenuOpen(false); }}
                className={`flex items-center justify-center space-x-2 p-3 rounded-lg border border-gray-200 text-gray-700 ${currentView === 'teams' ? 'col-span-2' : ''}`}
              >
                <span>Profile</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Profile Modal */}
        {showProfile && <Profile onClose={() => setShowProfile(false)} />}

        {currentView === 'teams' ? (
          <TeamDashboard />
        ) : (
          <>
        {/* Welcome Message */}
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center space-x-2 text-xl text-gray-700">
            <span className="font-medium">Welcome,</span>
            <span className="font-bold text-gray-900">{user?.name}</span>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-fade-in">
          <div className="dashboard-card p-4 hover-lift">
            <div className="text-sm text-gray-600 mb-1">Total Tasks</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="dashboard-card p-4 hover-lift">
            <div className="text-sm text-gray-600 mb-1">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="dashboard-card p-4 hover-lift">
            <div className="text-sm text-gray-600 mb-1">In Progress</div>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </div>
          <div className="dashboard-card p-4 hover-lift">
            <div className="text-sm text-gray-600 mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </div>
        </div>

        {/* Interactive Charts */}
        {showStats && tasks.length > 0 && (
          <div className="mb-8 animate-fade-in">
            <TaskStats tasks={tasks} />
          </div>
        )}

        {/* Header */}
        <div className="mb-6 animate-slide-in">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h2>
          <p className="text-gray-600">Manage and organize your tasks efficiently</p>
        </div>

        {/* Search Bar (Toggled) */}
        {showSearch && (
          <div className="mb-6 animate-scale-in">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search tasks by title, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block ml-8 w-full pl-10 pr-10 py-3 input-field"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors"
                >
                  <svg className="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filters Sidebar */}
        {showFilters && (
          <div className="fixed right-0 top-16 md:top-20 bottom-0 w-full sm:w-80 bg-white/95 backdrop-blur-xl shadow-2xl p-6 overflow-y-auto border-l border-white/20 animate-fade-in z-40">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Filter Tasks</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="priority">Priority (High to Low)</option>
                  <option value="dueDate">Due Date (Earliest First)</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <div className="flex flex-wrap gap-2">
                  {['All', 'pending', 'in-progress', 'completed'].map((filterOption) => (
                    <button
                      key={filterOption}
                      onClick={() => setStatusFilter(filterOption)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        statusFilter === filterOption
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {filterOption.charAt(0).toUpperCase() + filterOption.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'High', 'Medium', 'Low'].map((filterOption) => (
                    <button
                      key={filterOption}
                      onClick={() => setPriorityFilter(filterOption)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        priorityFilter === filterOption
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {filterOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      categoryFilter === 'all'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        categoryFilter === category
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear All Filters */}
              {(statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all' || sortBy !== 'newest') && (
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setPriorityFilter('all');
                    setCategoryFilter('all');
                    setSortBy('newest');
                  }}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Task Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
            <TaskForm
              task={editingTask}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Tasks List */}
        {loading ? (
          <Loading message="Loading your tasks..." />
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-6">
              {tasks.length === 0 
                ? "Get started by creating your first task!" 
                : "No tasks match your current filters. Try adjusting your search or filters."}
            </p>
            {tasks.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl font-semibold transition-all duration-300 hover-lift"
              >
                Create Your First Task
              </button>
            )}
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onEdit={handleEdit}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
          />
        )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
