import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const CreateTeamModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState(['']);
  const [tasks, setTasks] = useState(['']);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAddMember = () => {
    setMembers([...members, '']);
  };

  const handleRemoveMember = (index) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  };

  const handleMemberChange = (index, value) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleAddTask = () => {
    setTasks([...tasks, '']);
  };

  const handleRemoveTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleTaskChange = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCreate({ 
        name, 
        description,
        members: members.filter(m => m.trim() !== ''),
        tasks: tasks.filter(t => t.trim() !== '')
      });
      setName('');
      setDescription('');
      setMembers(['']);
      setTasks(['']);
      onClose();
    } catch (error) {
      console.error('Failed to create team', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">Create New Team</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6">
          <form id="createTeamForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Engineering Squad"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="What is this team for?"
                />
              </div>
            </div>

            {/* Members Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Add Members</label>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
                >
                  <Plus size={16} className="mr-1" /> Add Member
                </button>
              </div>
              <div className="space-y-2">
                {members.map((member, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="email"
                      value={member}
                      onChange={(e) => handleMemberChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="colleague@example.com"
                    />
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

           
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            type="submit"
            form="createTeamForm"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 flex justify-center items-center"
          >
            {loading ? 'Creating...' : 'Create Team'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;