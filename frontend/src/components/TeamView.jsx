import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Mail, Shield, User, CheckSquare, Plus, Calendar, Edit2 } from 'lucide-react';
import teamService from '../services/teamService';
import { createTask, updateTask } from '../utils/api';
import toast from 'react-hot-toast';
import TaskForm from './TaskForm';

const TeamView = ({ team, onBack }) => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchData();
  }, [team._id, activeTab]);

  // Fetch members on mount to have them available for task assignment
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await teamService.getTeamMembers(team._id);
        setMembers(res.data.members);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    fetchMembers();
  }, [team._id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'tasks') {
        const res = await teamService.getTeamTasks(team._id);
        setTasks(res.data.tasks);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await teamService.inviteMember(team._id, inviteEmail);
      setInviteEmail('');
      setInviteSuccess(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send invite');
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      // Construct a clean payload with whitelist approach
      const payload = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        category: taskData.category,
        teamId: team._id
      };

      // Only add optional fields if they have valid values
      if (taskData.assignedTo && taskData.assignedTo !== '' && taskData.assignedTo !== 'null') {
        payload.assignedTo = typeof taskData.assignedTo === 'object' ? taskData.assignedTo._id : taskData.assignedTo;
      }
      if (taskData.dueDate && taskData.dueDate !== '' && taskData.dueDate !== 'null') {
        payload.dueDate = taskData.dueDate;
      }

      const newTask = await createTask(payload);
      setTasks([newTask, ...tasks]);
      setShowTaskForm(false);
      toast.success('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      const updatedTask = await updateTask(id, taskData);
      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
      setEditingTask(null);
      setShowTaskForm(false);
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleToggleComplete = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const updatedTask = await updateTask(task._id, { ...task, status: newStatus });
      setTasks(tasks.map((t) => (t._id === task._id ? updatedTask : t)));
      toast.success(newStatus === 'Completed' ? 'Task completed!' : 'Task re-opened');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start space-x-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
          <ArrowLeft className="text-gray-600" size={24} />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 break-words">{team.name}</h2>
           
          </div>
          <p className="text-gray-500 text-sm sm:text-base">{team.description}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 sm:px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === 'tasks'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            <CheckSquare size={18} />
            <span>Team Tasks</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 sm:px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === 'members'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Users size={18} />
            <span>Members</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        {activeTab === 'members' ? (
          <div className="space-y-8">
            {/* Invite Section */}
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <h3 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center">
                <Mail size={16} className="mr-2" /> Invite New Member
              </h3>
              {inviteSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center animate-fade-in">
                  <div className="flex items-center justify-center text-green-700 font-medium mb-3">
                    <span className="bg-green-100 p-1 rounded-full mr-2">✓</span>
                    Invitation email sent successfully!
                  </div>
                  <button
                    onClick={() => setInviteSuccess(false)}
                    className="text-sm bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
                  >
                    Send Invite Again
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full"
                    required
                  />
                  <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium w-full sm:w-auto">
                    Send Invite
                  </button>
                </form>
              )}
            </div>

            {/* Members List */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Members</h3>
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 gap-3">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">
                        {member.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{member.user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{member.user.email}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center w-fit ${
                      member.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {member.role === 'Admin' ? <Shield size={12} className="mr-1" /> : <User size={12} className="mr-1" />}
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Tasks assigned to this team</h3>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskForm(true);
                }}
                className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                <Plus size={16} className="mr-2" />
                Add Task
              </button>
            </div>
            
            {tasks.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <CheckSquare size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No tasks found for this team.</p>
                <button 
                  onClick={() => setShowTaskForm(true)}
                  className="text-indigo-600 font-medium mt-2 hover:underline"
                >
                  Create the first task
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map(task => (
                  <div 
                    key={task._id} 
                    className={`group p-4 border rounded-xl transition-all duration-200 hover:shadow-md flex items-start gap-4 ${
                      task.status === 'Completed' ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleComplete(task)}
                      className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        task.status === 'Completed' 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 hover:border-indigo-500'
                      }`}
                    >
                      {task.status === 'Completed' && <CheckSquare size={14} />}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className={`text-lg font-bold text-gray-900 truncate pr-4 ${
                          task.status === 'Completed' ? 'line-through text-gray-500' : ''
                        }`}>
                          {task.title}
                        </h4>
                        <button 
                          onClick={() => openEditModal(task)}
                          className="text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        {/* Assignee */}
                        {task.assignedTo && (
                          <div className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                            <User size={12} className="mr-1" />
                            {task.assignedTo.name}
                          </div>
                        )}
                        
                        {/* Due Date */}
                        {task.dueDate && (
                          <div className={`flex items-center text-xs px-2 py-1 rounded-md ${
                            new Date(task.dueDate) < new Date() && task.status !== 'Completed'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-blue-50 text-blue-600'
                          }`}>
                            <Calendar size={12} className="mr-1" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}

                        {/* Priority */}
                        <span className={`text-xs px-2 py-1 rounded-md border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? (data) => handleUpdateTask(editingTask._id, data) : handleCreateTask}
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
            teamMembers={members}
          />
        </div>
      )}
    </div>
  );
};

export default TeamView;                        